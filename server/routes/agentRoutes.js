import { Router } from 'express'
import { continueAgent, startAgent } from '../agent/agentLoop.js'

const router = Router()

router.post('/chat', async (req, res) => {
  try {
    const result = await startAgent(req.body?.messages, req.body?.productIds)
    res.json(result)
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.status(400).json({ error: 'The request body is not valid JSON.' })
      return
    }
    if (error instanceof Error && /Send between|Each message|latest conversation|Product context/.test(error.message)) {
      res.status(400).json({ error: error.message })
      return
    }
    console.error('Shopping assistant request failed:', error instanceof Error ? error.message : 'Unknown error')
    res.status(502).json({ error: 'The shopping assistant is temporarily unavailable. Please try again.' })
  }
})

router.post('/continue', async (req, res) => {
  try {
    const result = await continueAgent(req.body?.actionId, req.body?.result)
    res.json(result)
  } catch (error) {
    if (error instanceof Error && /valid cart action|expired/.test(error.message)) {
      res.status(400).json({ error: error.message })
      return
    }
    console.error('Shopping assistant continuation failed:', error instanceof Error ? error.message : 'Unknown error')
    res.status(502).json({ error: 'The shopping assistant is temporarily unavailable. Please try again.' })
  }
})

export default router
