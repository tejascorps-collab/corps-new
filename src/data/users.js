// ---------------------------------------------------------------------------
// Admin account roster.
//
// This list seeds the database (see server/prisma/seed.js). Passwords are NOT
// stored here anymore — they are supplied at seed time from environment
// variables (SEED_SUPERADMIN_PASSWORD / SEED_ADMIN_PASSWORD), which live in
// server/.env (outside git). See server/.env.example.
//
// role: 'super_admin' has full access; 'admin' is a standard administrator.
// ---------------------------------------------------------------------------
export const USERS = [
  { id: 'u-super', name: 'Tejas Taran', email: 'superadmin@akontec.pro', role: 'super_admin', avatar: 'TT' },
  { id: 'u-admin-1', name: 'Admin One', email: 'admin1@akontec.pro', role: 'admin', avatar: 'A1' },
  { id: 'u-admin-2', name: 'Admin Two', email: 'admin2@akontec.pro', role: 'admin', avatar: 'A2' },
]

export const roleLabel = (role) =>
  ({ super_admin: 'Super Admin', admin: 'Administrator' }[role] || 'User')
