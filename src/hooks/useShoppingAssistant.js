import { useRef, useState } from 'react'
import { continueAssistantAction, sendAssistantMessage } from '../services/assistantApi.js'
import { getProduct } from '../data/products.js'

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your Third Pocket shopping assistant. Looking for a watch, wallet, sunglasses, or another accessory? Tell me your style and budget, and I'll help you find the right match.",
}

export default function useShoppingAssistant(addItem) {
  const [messages, setMessages] = useState([welcomeMessage])
  const [isLoading, setIsLoading] = useState(false)
  const loadingRef = useRef(false)
  const retryWork = useRef(null)
  const pendingContinuation = useRef(null)

  const finishAction = async (response) => {
    let actionCount = 0
    while (response?.status === 'action_required') {
      if (++actionCount > 5 || !response.action?.id) {
        throw new Error('The assistant could not complete the requested cart action. Please retry.')
      }
      const product = getProduct(response.action.productId)
      const outcome = product
        ? addItem(product.id, response.action.quantity)
        : { success: false, message: 'That product is no longer available in the catalogue.' }
      pendingContinuation.current = { actionId: response.action.id, outcome }
      response = await continueAssistantAction(response.action.id, outcome)
      pendingContinuation.current = null
    }
    if (response?.status !== 'done' || typeof response.message !== 'string') {
      throw new Error('The assistant returned an incomplete response. Please retry.')
    }
    return response
  }

  const run = async (work) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setIsLoading(true)
    try {
      const response = await work()
      setMessages((current) => [...current.filter((message) => !message.error), {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message,
        products: Array.isArray(response.products) ? response.products : [],
        activities: Array.isArray(response.activities) ? response.activities : [],
      }])
      retryWork.current = null
    } catch (error) {
      setMessages((current) => [...current.filter((message) => !message.error), {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'The shopping assistant is temporarily unavailable. Please retry.',
        error: true,
      }])
    } finally {
      loadingRef.current = false
      setIsLoading(false)
    }
  }

  const submit = (text) => {
    const content = text.trim()
    if (!content || loadingRef.current) return
    const history = messages
      .filter((message) => message.id !== 'welcome' && !message.error && typeof message.content === 'string')
      .map(({ role, content: messageContent }) => ({ role, content: messageContent }))
      .slice(-11)
    const conversation = [...history, { role: 'user', content }]
    const productIds = [...new Set(messages.flatMap((message) => message.products?.map((product) => product.id) || []))].slice(-8)
    setMessages((current) => [...current.filter((message) => !message.error), {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }])
    retryWork.current = async () => finishAction(await sendAssistantMessage(conversation, productIds))
    run(retryWork.current)
  }

  const retry = () => {
    if (!retryWork.current || loadingRef.current) return
    if (pendingContinuation.current) {
      const pending = pendingContinuation.current
      retryWork.current = async () => {
        const response = await continueAssistantAction(pending.actionId, pending.outcome)
        pendingContinuation.current = null
        return finishAction(response)
      }
    }
    run(retryWork.current)
  }

  const newConversation = () => {
    if (loadingRef.current) return
    setMessages([welcomeMessage])
    retryWork.current = null
    pendingContinuation.current = null
  }

  return { messages, isLoading, submit, retry, newConversation }
}
