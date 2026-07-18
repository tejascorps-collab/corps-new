import 'dotenv/config'
import { prisma } from '../src/db.js'
import { hashPassword } from '../src/auth.js'
import { USERS as LOGIN_ACCOUNTS } from '../../src/data/users.js'
import {
  investors, seekers, properties, leads as mockLeads,
  supportTickets, seedCallLogs, teamMembers,
} from '../../src/data/mockData.js'

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

// Resolve a login account's password from the environment. No weak defaults —
// seeding fails loudly if the credentials aren't configured in server/.env.
function passwordForRole(role) {
  const pw = role === 'super_admin'
    ? process.env.SEED_SUPERADMIN_PASSWORD
    : process.env.SEED_ADMIN_PASSWORD
  if (!pw) {
    throw new Error(
      `Missing seed password for role "${role}". Set SEED_SUPERADMIN_PASSWORD and ` +
      `SEED_ADMIN_PASSWORD in server/.env (see server/.env.example).`
    )
  }
  return pw
}

async function seedUsers() {
  const seen = new Set()

  // 1) Real login accounts. Passwords come from env and are (re)applied on every
  //    seed — so a manual re-seed rotates them to the configured values.
  for (const u of LOGIN_ACCOUNTS) {
    const email = (u.role === 'super_admin' && process.env.SEED_SUPERADMIN_EMAIL
      ? process.env.SEED_SUPERADMIN_EMAIL
      : u.email).toLowerCase()
    seen.add(email)
    const passwordHash = await hashPassword(passwordForRole(u.role))
    await prisma.user.upsert({
      where: { email },
      update: { name: u.name, role: u.role, avatar: u.avatar, passwordHash },
      create: {
        id: u.id.replace('u-', 'USR-'),
        name: u.name,
        email,
        passwordHash,
        role: u.role,
        title: u.role === 'super_admin' ? 'Super Admin' : 'Administrator',
        avatar: u.avatar,
        status: 'Active',
        lastActive: 'Now',
      },
    })
  }

  // 2) Team members (job titles preserved). Password is env-driven; falls back to
  //    a placeholder only for local dev. Re-applied on seed like the accounts above.
  const teamPw = process.env.SEED_TEAM_PASSWORD || 'change-me-team'
  const defaultPw = await hashPassword(teamPw)
  let n = 1
  for (const m of teamMembers) {
    const email = m.email.toLowerCase()
    if (seen.has(email)) continue
    seen.add(email)
    await prisma.user.upsert({
      where: { email },
      update: { name: m.name, title: m.role, status: m.status, lastActive: m.last, passwordHash: defaultPw },
      create: {
        id: `USR-${100 + n++}`,
        name: m.name,
        email,
        passwordHash: defaultPw,
        role: m.role === 'Super Admin' ? 'super_admin' : 'admin',
        title: m.role,
        avatar: initials(m.name),
        status: m.status,
        lastActive: m.last,
      },
    })
  }
}

async function seedTable(model, rows, map) {
  for (const row of rows) {
    const { id, ...data } = map(row)
    await prisma[model].upsert({ where: { id }, update: data, create: { id, ...data } })
  }
}

async function main() {
  console.log('Seeding users…')
  await seedUsers()

  console.log('Seeding investors…')
  await seedTable('investor', investors, (i) => ({
    id: i.id, name: i.name, country: i.country, capacity: i.capacity,
    industries: JSON.stringify(i.industries || []), kyc: i.kyc, invested: i.invested,
    roi: i.roi, rm: i.rm, risk: i.risk, status: i.status,
  }))

  console.log('Seeding seekers…')
  await seedTable('seeker', seekers, (s) => ({
    id: s.id, company: s.company, cin: s.cin, industry: s.industry, location: s.location,
    required: s.required, equity: s.equity, roi: s.roi, stage: s.stage, valuation: s.valuation, status: s.status,
  }))

  console.log('Seeding properties…')
  await seedTable('property', properties, (p) => ({
    id: p.id, name: p.name, category: p.category, location: p.location, purchase: p.purchase,
    current: p.current, expected: p.expected, rental: p.rental, roi: p.roi, legal: p.legal, status: p.status,
  }))

  console.log('Seeding leads…')
  let li = 1
  await seedTable('lead', mockLeads, (l) => ({
    id: `LEAD-${li++}`, name: l.name, company: l.company, type: l.type, source: l.source,
    stage: l.stage, owner: l.owner, value: l.value, phone: l.phone || '', last: l.last,
  }))

  console.log('Seeding tickets…')
  await seedTable('ticket', supportTickets, (t) => ({
    id: t.id, subject: t.subject, requester: t.requester, category: t.category,
    priority: t.priority, status: t.status, agent: t.agent, updated: t.updated,
  }))

  console.log('Seeding call logs…')
  await seedTable('callLog', seedCallLogs, (c) => ({
    id: c.id, name: c.name, number: c.number, direction: c.direction,
    status: c.status, duration: c.duration, agent: c.agent,
  }))

  const counts = {
    users: await prisma.user.count(),
    investors: await prisma.investor.count(),
    seekers: await prisma.seeker.count(),
    properties: await prisma.property.count(),
    leads: await prisma.lead.count(),
    tickets: await prisma.ticket.count(),
    callLogs: await prisma.callLog.count(),
  }
  console.log('Seed complete:', counts)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
