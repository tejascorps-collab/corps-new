import { Router } from 'express'
import { prisma } from '../db.js'
import { verifyPassword, signToken, publicUser, requireAuth } from '../auth.js'

const r = Router()

// POST /api/auth/login  { username|email, password }
r.post('/login', async (req, res) => {
  const email = String(req.body?.username || req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  await prisma.user.update({ where: { id: user.id }, data: { lastActive: 'just now' } })
  res.json({ token: signToken(user), user: publicUser(user) })
})

// GET /api/auth/me  (Bearer token) → current user
r.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth.sub } })
  if (!user) return res.status(401).json({ error: 'Not found' })
  res.json({ user: publicUser(user) })
})

export default r
