import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET = process.env.JWT_SECRET || 'dev-insecure-secret'
const EXPIRES = '7d'

export const hashPassword = (pw) => bcrypt.hash(pw, 10)
export const verifyPassword = (pw, hash) => bcrypt.compare(pw, hash)

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: EXPIRES })

// Strip the password hash before returning a user to the client.
export const publicUser = (u) => {
  if (!u) return null
  const { passwordHash, ...safe } = u
  return safe
}

// Express middleware: require a valid Bearer token.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  try {
    req.auth = jwt.verify(token, SECRET) // { sub, role }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Require one of the given roles (e.g. requireRole('super_admin')).
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' })
  }
  next()
}
