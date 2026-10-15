async function postJson(path, body) {
  let response
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Could not reach the shopping assistant. Check that the API server is running, then retry.')
  }
  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('The shopping assistant returned an unreadable response. Please retry.')
  }
  if (!response.ok) throw new Error(payload?.error || 'The shopping assistant is temporarily unavailable. Please retry.')
  return payload
}

export const sendAssistantMessage = (messages, productIds) => postJson('/api/agent/chat', { messages, productIds })
export const continueAssistantAction = (actionId, result) => postJson('/api/agent/continue', { actionId, result })
