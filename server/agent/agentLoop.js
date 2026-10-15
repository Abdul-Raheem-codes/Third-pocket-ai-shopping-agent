import { randomUUID } from 'node:crypto'
import Groq from 'groq-sdk'
import { getProduct } from '../../src/data/products.js'
import { systemPrompt } from './systemPrompt.js'
import { toolDefinitions } from './toolDefinitions.js'
import { executeTool } from './toolRegistry.js'
import { prepareCartAddition } from './tools/addToCart.js'
import { isExplicitCartTarget } from './cartIntent.js'

const maxToolRounds = Math.min(8, Math.max(1, Number.parseInt(process.env.AGENT_MAX_TOOL_ROUNDS || '5', 10) || 5))
const pendingActions = new Map()
const completedActions = new Map()
const inFlightActions = new Map()
const ACTION_TTL_MS = 5 * 60 * 1000
const MAX_PENDING_ACTIONS = 100
let groqClient

function getClient() {
  if (!process.env.GROQ_API_KEY) throw new Error('The server is missing GROQ_API_KEY.')
  if (!groqClient) groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 30_000, maxRetries: 1 })
  return groqClient
}

function cleanExpiredActions() {
  const now = Date.now()
  for (const [id, action] of pendingActions) if (now - action.createdAt > ACTION_TTL_MS) pendingActions.delete(id)
  for (const [id, action] of completedActions) if (now - action.completedAt > ACTION_TTL_MS) completedActions.delete(id)
}

function toolMessage(call, result) {
  return { role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) }
}

function parseArguments(raw) {
  if (typeof raw !== 'string' || raw.length > 8_000) throw new Error('Tool arguments are missing or too large.')
  const args = JSON.parse(raw)
  if (!args || typeof args !== 'object' || Array.isArray(args)) throw new Error('Tool arguments must be a JSON object.')
  return args
}

function productIdsFrom(result, destination) {
  const add = (item) => {
    if (item && typeof item.id === 'string' && getProduct(item.id)) destination.add(item.id)
  }
  if (Array.isArray(result)) result.forEach(add)
  else if (result && typeof result === 'object') {
    if (Array.isArray(result.products)) result.products.forEach(add)
    if (Array.isArray(result.items)) result.items.forEach(add)
    add(result.product)
    add(result)
  }
}

function responseProducts(ids) {
  return [...ids].map((id) => getProduct(id)).filter(Boolean).map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    colors: [...product.colors],
    stock: product.stock,
    image: product.image,
  }))
}

async function completion(messages) {
  return getClient().chat.completions.create({
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages,
    tools: toolDefinitions,
    tool_choice: 'auto',
    parallel_tool_calls: true,
    temperature: 0.2,
    max_tokens: 900,
  })
}

async function runAgent(messages, activities = [], startRound = 0, calls = [], nextCall = 0, recommendedIds = new Set(), productContextIds = [], onProgress) {
  let currentCalls = calls
  let callIndex = nextCall
  let currentRound = startRound
  const saveProgress = (round, activeCalls, nextIndex) => {
    onProgress?.({
      messages,
      activities,
      round,
      calls: activeCalls,
      nextCall: nextIndex,
      recommendedIds,
      productContextIds,
    })
  }

  while (currentRound < maxToolRounds) {
    if (callIndex >= currentCalls.length) {
      saveProgress(currentRound, [], 0)
      const result = await completion(messages)
      const answer = result.choices?.[0]?.message
      if (!answer) throw new Error('The Groq response did not include a message.')
      if (!answer.tool_calls?.length) {
        const text = typeof answer.content === 'string' ? answer.content.trim() : ''
        if (!text) throw new Error('The Groq response was empty.')
        productIdsFrom(answer, recommendedIds)
        return { status: 'done', message: text, products: responseProducts(recommendedIds), activities }
      }
      messages.push(answer)
      currentCalls = answer.tool_calls
      callIndex = 0
      currentRound += 1
      saveProgress(currentRound, currentCalls, callIndex)
    }

    for (; callIndex < currentCalls.length; callIndex += 1) {
      const call = currentCalls[callIndex]
      const name = call.function?.name
      const activity = { tool: typeof name === 'string' ? name : 'unknown', status: 'complete', id: randomUUID() }
      let args
      let result
      try {
        if (!Object.hasOwn(toolRegistryNames, name)) throw new Error(`Tool "${name}" is not allowed.`)
        args = parseArguments(call.function?.arguments)
        if (name === 'add_to_cart') {
          if (!isExplicitCartTarget(messages, args.product_id, [...recommendedIds, ...productContextIds])) {
            throw new Error('Please explicitly ask to add one specific product to your cart. If several products match, tell me which one.')
          }
          result = prepareCartAddition(args)
          if (result.actionRequired) {
            cleanExpiredActions()
            if (pendingActions.size >= MAX_PENDING_ACTIONS) throw new Error('The cart action queue is busy. Please try again shortly.')
            recommendedIds.add(result.productId)
            activity.status = 'waiting'
            activities.push(activity)
            const actionId = randomUUID()
            pendingActions.set(actionId, {
              createdAt: Date.now(),
              messages,
              activities,
              calls: currentCalls,
              nextCall: callIndex + 1,
              round: currentRound,
              call,
              args,
              activityId: activity.id,
              productId: result.productId,
              quantity: result.quantity,
              recommendedIds,
              productContextIds,
              toolResult: null,
            })
            return {
              status: 'action_required',
              action: { id: actionId, productId: result.productId, quantity: result.quantity },
              activities,
            }
          }
        } else {
          result = executeTool(name, args)
        }
        productIdsFrom(result, recommendedIds)
        messages.push(toolMessage(call, result))
      } catch (error) {
        result = { success: false, error: error instanceof Error ? error.message : 'Tool arguments are invalid.' }
        activity.status = 'error'
        messages.push(toolMessage(call, result))
      }
      activities.push(activity)
      saveProgress(currentRound, currentCalls, callIndex + 1)
    }
    callIndex = currentCalls.length
    saveProgress(currentRound, [], 0)
  }

  throw new Error(`The agent reached its limit of ${maxToolRounds} tool-call rounds.`)
}

const toolRegistryNames = Object.freeze({
  search_products: true,
  get_product_info: true,
  check_stock: true,
  compare_products: true,
  calculate_total: true,
  add_to_cart: true,
})

export function validateConversation(input, productIds = []) {
  if (!Array.isArray(input) || input.length < 1 || input.length > 12) {
    throw new Error('Send between one and twelve conversation messages.')
  }
  const messages = input.map((message) => {
    if (!message || typeof message !== 'object' || !['user', 'assistant'].includes(message.role)
        || typeof message.content !== 'string' || message.content.trim().length === 0 || message.content.length > 2_000) {
      throw new Error('Each message must have a user or assistant role and contain at most 2,000 characters.')
    }
    return { role: message.role, content: message.content }
  })
  if (messages[messages.length - 1].role !== 'user') throw new Error('The latest conversation message must be from the customer.')
  if (!Array.isArray(productIds) || productIds.length > 8
      || productIds.some((id) => typeof id !== 'string' || !getProduct(id))) {
    throw new Error('Product context must contain at most eight valid catalogue IDs.')
  }
  const productContext = [...new Set(productIds)].map((id) => getProduct(id))
  const contextText = productContext.length
    ? `\n\nThese verified catalogue products were shown in the storefront earlier in this conversation. Use their IDs only when the customer refers to them:\n${productContext.map((product) => `${product.id}: ${product.name} (${product.category}, ${product.colors.join(', ')})`).join('\n')}`
    : ''
  return {
    messages: [{ role: 'system', content: systemPrompt + contextText }, ...messages],
    productContextIds: productContext.map((product) => product.id),
  }
}

export async function startAgent(input, productIds) {
  cleanExpiredActions()
  const conversation = validateConversation(input, productIds)
  return runAgent(conversation.messages, [], 0, [], 0, new Set(conversation.productContextIds), conversation.productContextIds)
}

export async function continueAgent(actionId, actionResult) {
  if (typeof actionId !== 'string' || actionId.length > 100) throw new Error('A valid cart action ID is required.')
  cleanExpiredActions()
  const completed = completedActions.get(actionId)
  if (completed) return completed.response
  const inFlight = inFlightActions.get(actionId)
  if (inFlight) return inFlight
  const pending = pendingActions.get(actionId)
  if (!pending) throw new Error('This cart action has expired. Please try again.')
  if (!actionResult || typeof actionResult.success !== 'boolean') throw new Error('A valid cart action result is required.')

  const operation = (async () => {
    if (!pending.toolResult) {
      const product = getProduct(pending.productId)
      const stillAvailable = Boolean(product && product.stock >= pending.quantity)
      const success = actionResult.success && stillAvailable
      pending.toolResult = success
        ? { success: true, product_id: product.id, product_name: product.name, quantity: pending.quantity }
        : {
          success: false,
          product_id: pending.productId,
          message: !stillAvailable
            ? `${product?.name || 'This product'} no longer has the requested quantity available.`
            : (typeof actionResult.message === 'string' ? actionResult.message.slice(0, 240) : 'The storefront could not add this item.'),
        }
      pending.messages.push(toolMessage(pending.call, pending.toolResult))
      const activity = pending.activities.find((entry) => entry.id === pending.activityId)
      if (activity) activity.status = pending.toolResult.success ? 'complete' : 'error'
    }
    const response = await runAgent(
      pending.messages, pending.activities, pending.round, pending.calls, pending.nextCall,
      pending.recommendedIds, pending.productContextIds, (progress) => Object.assign(pending, progress),
    )
    completedActions.set(actionId, { completedAt: Date.now(), response })
    pendingActions.delete(actionId)
    return response
  })()
  inFlightActions.set(actionId, operation)
  try {
    return await operation
  } finally {
    inFlightActions.delete(actionId)
  }
}
