import { getProduct } from '../../../src/data/products.js'
import { requiredProductId } from './validation.js'

export function checkStock(args) {
  const productId = requiredProductId(args)
  const product = getProduct(productId)
  if (!product) return { found: false, product_id: productId, message: 'No product with that ID exists in the catalogue.' }
  return {
    found: true,
    product_id: product.id,
    product_name: product.name,
    stock: product.stock,
    available: product.stock > 0,
  }
}
