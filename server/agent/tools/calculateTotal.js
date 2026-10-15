import { getProduct } from '../../../src/data/products.js'
import { assertObjectKeys, positiveQuantity, requiredProductId } from './validation.js'

export function calculateTotal(args) {
  assertObjectKeys(args, ['items'])
  if (!args || !Array.isArray(args.items) || args.items.length < 1 || args.items.length > 20) {
    throw new Error('items must contain between one and twenty products.')
  }
  const aggregated = new Map()
  for (const item of args.items) {
    const productId = requiredProductId(item, ['product_id', 'quantity'])
    const quantity = positiveQuantity(item.quantity)
    aggregated.set(productId, (aggregated.get(productId) || 0) + quantity)
  }
  const items = [...aggregated].map(([productId, quantity]) => {
    const product = getProduct(productId)
    if (!product) throw new Error(`Product ${productId} was not found.`)
    if (quantity > product.stock) throw new Error(`${product.name} has only ${product.stock} in stock; ${quantity} requested.`)
    return {
      product_id: product.id,
      name: product.name,
      quantity,
      unit_price: product.price,
      line_total: product.price * quantity,
    }
  })
  return { items, subtotal: items.reduce((total, item) => total + item.line_total, 0), currency: 'USD' }
}
