import { getProduct } from '../../../src/data/products.js'
import { assertObjectKeys, publicProduct } from './validation.js'

export function compareProducts(args) {
  assertObjectKeys(args, ['product_ids'])
  if (!args || !Array.isArray(args.product_ids) || args.product_ids.length < 2 || args.product_ids.length > 4
      || args.product_ids.some((id) => typeof id !== 'string' || id.length < 1 || id.length > 100)) {
    throw new Error('product_ids must contain two to four valid product IDs.')
  }
  const uniqueIds = [...new Set(args.product_ids)]
  if (uniqueIds.length !== args.product_ids.length) throw new Error('product_ids must be unique.')
  return uniqueIds.map((id) => {
    const product = getProduct(id)
    return product ? publicProduct(product) : { id, found: false, message: 'No product with that ID exists in the catalogue.' }
  })
}
