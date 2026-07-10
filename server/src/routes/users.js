import { Router } from 'express'
import { prisma, nextId } from '../db.js'
import { requireAuth, requireRole, hashPassword, publicUser } from '../auth.js'

const r = Router()
r.use(requireAuth)

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

// List team members (no hashes).
r.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
  res.json(users.map(publicUser))
})

// Invite / create a user (super admins only).
r.post('/', requireRole('super_admin'), async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!email) return res.status(400).json({ error: 'Email required' })
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(409).json({ error: 'A user with that email already exists' })

  const id = await nextId('user', 'USR', 1)
  const name = req.body?.name || email.split('@')[0]
  const password = req.body?.password || 'changeme123'
  const user = await prisma.user.create({
    data: {
      id,
      name,
      email,
      passwordHash: await hashPassword(password),
      role: req.body?.role === 'super_admin' ? 'super_admin' : 'admin',
      avatar: initials(name),
      status: 'Invited',
    },
  })
  res.status(201).json(publicUser(user))
})

r.patch('/:id', requireRole('super_admin'), async (req, res) => {
  const data = { ...req.body }
  delete data.id
  delete data.passwordHash
  if (data.password) { data.passwordHash = await hashPassword(data.password); delete data.password }
  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data })
    res.json(publicUser(user))
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

r.delete('/:id', requireRole('super_admin'), async (req, res) => {
  if (req.params.id === req.auth.sub) return res.status(400).json({ error: 'You cannot delete yourself' })
  try {
    await prisma.user.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

export default r
