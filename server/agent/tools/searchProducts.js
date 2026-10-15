import { products } from '../../../src/data/products.js'
import { productCategories } from '../../../src/data/categories.js'
import { emptyFilters, filterProducts } from '../../../src/utils/filterProducts.js'
import { assertObjectKeys, publicProduct } from './validation.js'

export function searchProducts(args = {}) {
  assertObjectKeys(args, ['query', 'category', 'min_price', 'max_price', 'color', 'brand', 'in_stock_only'])
  if (args.query !== undefined && (typeof args.query !== 'string' || args.query.length > 120)) throw new Error('query must be a string of at most 120 characters.')
  if (args.category !== undefined && !productCategories.some(({ id }) => id === args.category)) throw new Error('category is not in the catalogue.')
  for (const key of ['min_price', 'max_price']) {
    if (args[key] !== undefined && (typeof args[key] !== 'number' || !Number.isFinite(args[key]) || args[key] < 0)) {
      throw new Error(`${key} must be a non-negative number.`)
    }
  }
  if (args.min_price !== undefined && args.max_price !== undefined && args.min_price > args.max_price) {
    throw new Error('min_price cannot exceed max_price.')
  }
  for (const key of ['color', 'brand']) {
    if (args[key] !== undefined && (typeof args[key] !== 'string' || args[key].length > (key === 'color' ? 40 : 80))) {
      throw new Error(`${key} must be a valid string.`)
    }
  }
  if (args.in_stock_only !== undefined && typeof args.in_stock_only !== 'boolean') throw new Error('in_stock_only must be a boolean.')

  const filters = {
    ...emptyFilters,
    categories: args.category ? [args.category] : [],
    min: args.min_price === undefined ? '' : String(args.min_price),
    max: args.max_price === undefined ? '' : String(args.max_price),
    inStock: args.in_stock_only === true,
  }
  const ignoredQueryTokens = new Set(['above', 'and', 'at', 'below', 'between', 'find', 'for', 'in', 'less', 'me', 'more', 'most', 'of', 'on', 'or', 'over', 'show', 'than', 'the', 'to', 'under', 'up'])
  const queryTokens = ((args.query || '').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [])
    .filter((token) => !/^\d+$/.test(token) && !ignoredQueryTokens.has(token))
  const categoryLabels = new Map(productCategories.map(({ id, label }) => [id, label.toLocaleLowerCase()]))
  const matches = filterProducts(products, filters).filter((product) => {
    const searchable = [
      product.name, product.category, categoryLabels.get(product.category), product.brand,
      product.description, ...product.colors,
    ].join(' ').toLocaleLowerCase()
    if (queryTokens.some((token) => !searchable.includes(token))) return false
    if (args.color && !product.colors.some((color) => color.toLocaleLowerCase() === args.color.toLocaleLowerCase())) return false
    if (args.brand && product.brand.toLocaleLowerCase() !== args.brand.toLocaleLowerCase()) return false
    return true
  })

  return matches.slice(0, 8).map(publicProduct)
}
