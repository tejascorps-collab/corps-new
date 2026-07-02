// Client-side CSV export — no backend needed.
// columns: [{ key, label, get? }]  (get(row) overrides row[key])

function escapeCell(v) {
  if (v == null) return ''
  const s = Array.isArray(v) ? v.join('; ') : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCsv(rows, columns) {
  const header = columns.map((c) => escapeCell(c.label)).join(',')
  const body = rows
    .map((r) => columns.map((c) => escapeCell(c.get ? c.get(r) : r[c.key])).join(','))
    .join('\n')
  return `${header}\n${body}`
}

export function downloadCsv(filename, rows, columns) {
  const csv = toCsv(rows, columns)
  // BOM so Excel reads UTF-8 (₹ etc.) correctly
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return csv
}
