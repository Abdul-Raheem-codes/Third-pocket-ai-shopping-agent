import { searchProducts } from './tools/searchProducts.js'
import { getProductInfo } from './tools/getProductInfo.js'
import { checkStock } from './tools/checkStock.js'
import { compareProducts } from './tools/compareProducts.js'
import { calculateTotal } from './tools/calculateTotal.js'
import { prepareCartAddition } from './tools/addToCart.js'

export const toolRegistry = Object.freeze({
  search_products: searchProducts,
  get_product_info: getProductInfo,
  check_stock: checkStock,
  compare_products: compareProducts,
  calculate_total: calculateTotal,
  add_to_cart: prepareCartAddition,
})

export function executeTool(name, args) {
  const implementation = toolRegistry[name]
  if (!implementation) throw new Error(`Tool "${name}" is not allowed.`)
  return implementation(args)
}
