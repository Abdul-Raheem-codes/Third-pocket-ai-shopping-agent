import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import agentRoutes from './routes/agentRoutes.js'

dotenv.config()
dotenv.config({ path: 'server/.env', override: false })

const app = express()
const port = Number.parseInt(process.env.PORT || '3001', 10)
const allowedOrigins = new Set(
  (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
)

app.disable('x-powered-by')
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) callback(null, true)
    else callback(new Error('Origin is not allowed by CORS.'))
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json({ limit: '32kb' }))
app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/agent', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many assistant requests. Please wait a moment and try again.' },
}), agentRoutes)
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ error: 'The request body is not valid JSON.' })
    return
  }
  if (error?.message === 'Origin is not allowed by CORS.') {
    res.status(403).json({ error: 'This origin is not allowed to use the shopping assistant.' })
    return
  }
  console.error('API request failed:', error instanceof Error ? error.message : 'Unknown error')
  res.status(500).json({ error: 'The server could not process this request.' })
})

app.listen(port, () => {
  console.log(`Third Pocket AI API listening on port ${port}`)
})
