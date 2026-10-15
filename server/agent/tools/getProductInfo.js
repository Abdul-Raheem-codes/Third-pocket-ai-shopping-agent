import { getProduct } from '../../../src/data/products.js'
import { publicProduct, requiredProductId } from './validation.js'

export function getProductInfo(args) {
  const productId = requiredProductId(args)
  const product = getProduct(productId)
  return product ? publicProduct(product) : { found: false, product_id: productId, message: 'No product with that ID exists in the catalogue.' }
}
