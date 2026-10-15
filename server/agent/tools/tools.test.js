import test from 'node:test'
import assert from 'node:assert/strict'
import { searchProducts } from './searchProducts.js'
import { checkStock } from './checkStock.js'
import { calculateTotal } from './calculateTotal.js'
import { compareProducts } from './compareProducts.js'
import { prepareCartAddition } from './addToCart.js'

test('searches real products with token, price, color, and category filters', () => {
  const results = searchProducts({ query: 'Show me black wallets under $60', category: 'wallets', max_price: 60, color: 'black', in_stock_only: true })
  assert.deepEqual(results.map(({ id }) => id), ['everyday-cardholder'])
  assert.equal(results[0].price, 55)
  assert.throws(() => searchProducts({ unexpected: true }), /supported properties/)
})

test('reports actual stock including sold-out products', () => {
  assert.deepEqual(checkStock({ product_id: 'travel-organiser' }), {
    found: true, product_id: 'travel-organiser', product_name: 'Travel Organiser', stock: 0, available: false,
  })
})

test('calculates totals from catalogue prices and rejects quantities beyond stock', () => {
  const total = calculateTotal({ items: [{ product_id: 'everyday-cardholder', quantity: 2 }] })
  assert.equal(total.subtotal, 110)
  assert.throws(() => calculateTotal({ items: [{ product_id: 'travel-organiser', quantity: 1 }] }), /only 0 in stock/)
  assert.throws(() => calculateTotal({ items: [
    { product_id: 'everyday-cardholder', quantity: 30 },
    { product_id: 'everyday-cardholder', quantity: 1 },
  ] }), /only 30 in stock/)
})

test('compares products using actual catalogue fields and reports invalid IDs', () => {
  const result = compareProducts({ product_ids: ['field-automatic', 'missing-product'] })
  assert.equal(result[0].price, 285)
  assert.equal(result[1].found, false)
})

test('prepares, but does not fabricate, cart actions', () => {
  assert.deepEqual(prepareCartAddition({ product_id: 'field-automatic', quantity: 2 }), {
    actionRequired: true, productId: 'field-automatic', productName: 'Field Automatic', quantity: 2,
  })
  assert.match(prepareCartAddition({ product_id: 'travel-organiser', quantity: 1 }).message, /sold out/)
})
