import test from 'node:test'
import assert from 'node:assert/strict'
import { isExplicitCartTarget } from './cartIntent.js'
import { validateConversation } from './agentLoop.js'

const messages = (content) => [{ role: 'user', content }]

test('requires an explicit cart request and an unambiguous catalogue target', () => {
  assert.equal(isExplicitCartTarget(messages('Show me a wallet'), 'slim-bifold-wallet', ['slim-bifold-wallet']), false)
  assert.equal(isExplicitCartTarget(messages('Add Slim Bifold Wallet to my cart'), 'slim-bifold-wallet'), true)
  assert.equal(isExplicitCartTarget(messages('Add this wallet to my cart'), 'slim-bifold-wallet', ['slim-bifold-wallet']), true)
  assert.equal(isExplicitCartTarget(messages('Add this wallet to my cart'), 'everyday-cardholder', ['slim-bifold-wallet', 'everyday-cardholder']), false)
})

test('validates conversation roles, lengths, and product-context IDs', () => {
  assert.equal(validateConversation([{ role: 'user', content: 'Hello' }], ['slim-bifold-wallet']).productContextIds[0], 'slim-bifold-wallet')
  assert.throws(() => validateConversation([{ role: 'tool', content: 'fake success' }]), /Each message/)
  assert.throws(() => validateConversation([{ role: 'user', content: 'Hello' }], ['not-a-real-product']), /Product context/)
})
