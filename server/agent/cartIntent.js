import { getProduct } from '../../src/data/products.js'

const categoryTerms = [
  ['watches', /\bwatch(?:es)?\b/],
  ['wallets', /\bwallets?\b/],
  ['sunglasses', /\bsunglasses\b/],
  ['belts', /\bbelts?\b/],
  ['bags', /\b(?:bags?|backpacks?)\b/],
  ['bracelets', /\bbracelets?\b/],
  ['rings', /\brings?\b/],
  ['caps', /\b(?:caps?|hats?)\b/],
]

const hasExplicitAddIntent = (text) =>
  /\b(?:add|put|place)\b.{0,100}\b(?:to|in|into)\s+(?:my\s+)?(?:shopping\s+)?cart\b|\b(?:cart|basket)\b.{0,100}\b(?:add|put|place)\b/i.test(text)

function mentionsColor(text, color) {
  const escaped = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
}

export function isExplicitCartTarget(messages, productId, productContextIds = []) {
  const lastUser = [...messages].reverse().find((message) => message.role === 'user')?.content || ''
  if (!hasExplicitAddIntent(lastUser)) return false

  const product = getProduct(productId)
  if (!product) return false
  const normalizedText = lastUser.toLocaleLowerCase()
  if (normalizedText.includes(product.name.toLocaleLowerCase())) return true

  const candidates = [...new Set(productContextIds)].map((id) => getProduct(id)).filter(Boolean)
  const category = categoryTerms.find(([, expression]) => expression.test(normalizedText))?.[0]
  const mentionedColors = [...new Set(candidates.flatMap((candidate) => candidate.colors))]
    .filter((color) => mentionsColor(normalizedText, color))
  const narrowed = candidates.filter((candidate) => {
    if (category && candidate.category !== category) return false
    if (mentionedColors.length && !candidate.colors.some((color) => mentionedColors.includes(color))) return false
    return true
  })
  if (narrowed.length === 1) return narrowed[0].id === product.id

  const refersToSingleItem = /\b(?:this|that|it|the one)\b/i.test(lastUser)
  return refersToSingleItem && candidates.length === 1 && candidates[0].id === product.id
}
