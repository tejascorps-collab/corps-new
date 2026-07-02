// ---------------------------------------------------------------------------
// Admin accounts (prototype — no real backend; credentials live client-side).
// To change names / emails / passwords, edit this list.
// role: 'super_admin' has full access; 'admin' is a standard administrator.
// ---------------------------------------------------------------------------
export const USERS = [
  {
    id: 'u-super',
    name: 'Tejas Taran',
    email: 'superadmin@thecorps.in',
    password: 'super@123',
    role: 'super_admin',
    avatar: 'TT',
  },
  {
    id: 'u-admin-1',
    name: 'Admin One',
    email: 'admin1@thecorps.in',
    password: 'admin@123',
    role: 'admin',
    avatar: 'A1',
  },
  {
    id: 'u-admin-2',
    name: 'Admin Two',
    email: 'admin2@thecorps.in',
    password: 'admin@123',
    role: 'admin',
    avatar: 'A2',
  },
]

export const roleLabel = (role) =>
  ({ super_admin: 'Super Admin', admin: 'Administrator' }[role] || 'User')

// Validate a login attempt. Returns the matched user (without password) or null.
export function authenticate(email, password) {
  const u = USERS.find(
    (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password
  )
  if (!u) return null
  const { password: _pw, ...safe } = u
  return safe
}

export function findUserById(id) {
  const u = USERS.find((x) => x.id === id)
  if (!u) return null
  const { password: _pw, ...safe } = u
  return safe
}
