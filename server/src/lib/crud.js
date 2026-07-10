import { prisma, nextId } from '../db.js'
import { requireAuth } from '../auth.js'
import { Router } from 'express'

// Build a standard REST resource router for a Prisma model.
//   GET    /            list (newest first)
//   GET    /:id         one
//   POST   /            create (server-generated prefixed id)
//   PATCH  /:id         update
//   DELETE /:id         delete
//   POST   /bulk-delete { ids: [] }
//
// opts: { model, prefix, idStart, shape(body) -> data, jsonFields: [] }
export function resource({ model, prefix, idStart = 1001, shape, jsonFields = [] }) {
  const r = Router()

  const out = (row) => {
    if (!row) return row
    const o = { ...row }
    for (const f of jsonFields) {
      try { o[f] = JSON.parse(o[f]) } catch { o[f] = [] }
    }
    return o
  }
  const stringifyJson = (data) => {
    for (const f of jsonFields) {
      if (Array.isArray(data[f])) data[f] = JSON.stringify(data[f])
    }
    delete data.id
    delete data.createdAt
    return data
  }
  // Create: apply the shape() defaults. Patch: only the provided fields.
  const inShape = (body) => stringifyJson(shape ? shape(body) : { ...body })
  const patchShape = (body) => stringifyJson({ ...body })

  r.use(requireAuth)

  r.get('/', async (_req, res) => {
    const rows = await prisma[model].findMany({ orderBy: { createdAt: 'desc' } })
    res.json(rows.map(out))
  })

  r.get('/:id', async (req, res) => {
    const row = await prisma[model].findUnique({ where: { id: req.params.id } })
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(out(row))
  })

  r.post('/', async (req, res) => {
    const id = await nextId(model, prefix, idStart)
    const row = await prisma[model].create({ data: { id, ...inShape(req.body) } })
    res.status(201).json(out(row))
  })

  r.patch('/:id', async (req, res) => {
    try {
      const row = await prisma[model].update({ where: { id: req.params.id }, data: patchShape(req.body) })
      res.json(out(row))
    } catch {
      res.status(404).json({ error: 'Not found' })
    }
  })

  r.delete('/:id', async (req, res) => {
    try {
      await prisma[model].delete({ where: { id: req.params.id } })
      res.status(204).end()
    } catch {
      res.status(404).json({ error: 'Not found' })
    }
  })

  r.post('/bulk-delete', async (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : []
    const result = await prisma[model].deleteMany({ where: { id: { in: ids } } })
    res.json({ deleted: result.count })
  })

  return r
}
