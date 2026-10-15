import { getProduct } from '../../../src/data/products.js'

export function assertObjectKeys(value, allowedKeys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some((key) => !allowedKeys.includes(key))) {
    throw new Error('Tool arguments must be an object containing only supported properties.')
  }
}

export function requiredProductId(value, allowedKeys = ['product_id']) {
  assertObjectKeys(value, allowedKeys)
  if (typeof value.product_id !== 'string' || value.product_id.length < 1 || value.product_id.length > 100) throw new Error('A valid product_id is required.')
  return value.product_id
}

export function positiveQuantity(value) {
  if (!Number.isInteger(value) || value < 1 || value > 99) {
    throw new Error('Quantity must be a whole number between 1 and 99.')
  }
  return value
}

export function publicProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    colors: [...product.colors],
    stock: product.stock,
    image: product.image,
  }
}
