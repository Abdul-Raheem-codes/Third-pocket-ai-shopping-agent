import { productCategories } from '../../src/data/categories.js'

const object = (properties, required = []) => ({
  type: 'object',
  properties,
  required,
  additionalProperties: false,
})

export const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'search_products',
      description: 'Search the real Third Pocket catalogue by query and optional category, budget, color, brand, or stock.',
      parameters: object({
        query: { type: 'string', maxLength: 120 },
        category: { type: 'string', enum: productCategories.map(({ id }) => id) },
        min_price: { type: 'number', minimum: 0 },
        max_price: { type: 'number', minimum: 0 },
        color: { type: 'string', maxLength: 40 },
        brand: { type: 'string', maxLength: 80 },
        in_stock_only: { type: 'boolean' },
      }),
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_product_info',
      description: 'Get accurate details for one product using its catalogue ID.',
      parameters: object({ product_id: { type: 'string', minLength: 1, maxLength: 100 } }, ['product_id']),
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_stock',
      description: 'Check the actual stock quantity for one catalogue product.',
      parameters: object({ product_id: { type: 'string', minLength: 1, maxLength: 100 } }, ['product_id']),
    },
  },
  {
    type: 'function',
    function: {
      name: 'compare_products',
      description: 'Compare two to four actual products by price, category, colors, description, and stock.',
      parameters: object({
        product_ids: { type: 'array', items: { type: 'string', minLength: 1, maxLength: 100 }, minItems: 2, maxItems: 4 },
      }, ['product_ids']),
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculate_total',
      description: 'Calculate authoritative prices for requested quantities and reject quantities exceeding stock.',
      parameters: object({
        items: {
          type: 'array',
          minItems: 1,
          maxItems: 20,
          items: object({
            product_id: { type: 'string', minLength: 1, maxLength: 100 },
            quantity: { type: 'integer', minimum: 1, maximum: 99 },
          }, ['product_id', 'quantity']),
        },
      }, ['items']),
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_to_cart',
      description: 'Request an explicit customer-approved addition to the existing storefront cart. Only call after the customer clearly asks to add a product to their cart.',
      parameters: object({
        product_id: { type: 'string', minLength: 1, maxLength: 100 },
        quantity: { type: 'integer', minimum: 1, maximum: 99 },
      }, ['product_id', 'quantity']),
    },
  },
]
