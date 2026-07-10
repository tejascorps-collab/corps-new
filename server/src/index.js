import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { prisma } from './db.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import { investors, seekers, properties, leads, tickets, callLogs } from './routes/entities.js'

const app = express()
app.use(express.json({ limit: '1mb' }))

const origins = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
app.use(cors({ origin: origins.length ? origins : true }))

// Health check (used by nginx / uptime checks).
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, ts: new Date().toISOString() })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/investors', investors)
app.use('/api/seekers', seekers)
app.use('/api/properties', properties)
app.use('/api/leads', leads)
app.use('/api/tickets', tickets)
app.use('/api/call-logs', callLogs)

// JSON 404 + error handlers (so the SPA never gets HTML from the API).
app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint not found' }))
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = Number(process.env.PORT) || 4000
app.listen(port, () => console.log(`FDI Prime API listening on :${port}`))
