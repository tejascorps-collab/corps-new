import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Sequential, human-friendly IDs per entity (INV-1001, PROP-301, …).
// Derives the next number from the current max so it survives restarts.
export async function nextId(model, prefix, start) {
  const rows = await prisma[model].findMany({ select: { id: true } })
  let max = start - 1
  for (const r of rows) {
    const n = parseInt(String(r.id).replace(`${prefix}-`, ''), 10)
    if (!Number.isNaN(n) && n > max) max = n
  }
  return `${prefix}-${max + 1}`
}
