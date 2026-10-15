import { getProduct } from '../../../src/data/products.js'
import { positiveQuantity, requiredProductId } from './validation.js'

export function prepareCartAddition(args) {
  const productId = requiredProductId(args, ['product_id', 'quantity'])
  const quantity = positiveQuantity(args?.quantity)
  const product = getProduct(productId)
  if (!product) return { success: false, message: 'That product is not in the catalogue.' }
  if (product.stock < 1) return { success: false, message: `${product.name} is sold out.` }
  if (quantity > product.stock) return { success: false, message: `Only ${product.stock} ${product.name} are in stock.` }
  return { actionRequired: true, productId: product.id, productName: product.name, quantity }
}
