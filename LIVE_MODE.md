# FDI Prime — Live Mode Readiness

Quick reference for what is safe to use with real data today, and what is still a
prototype screen. "Persists" = data you enter saves to the database, survives a
restart, and is visible to every user.

## ✅ Persists to the database (safe for live use)

| Module | Route | Notes |
|--------|-------|-------|
| Login / auth / password change | — | Real hashed passwords, JWT |
| Users & team management | Settings | Add/edit users |
| Investors | `/investors` | Full add / edit / delete |
| Investment Seekers | `/seekers` | Full add / edit / delete |
| Properties | `/properties` | Full add / edit / delete |
| Leads / CRM pipeline | `/crm` | Full add / edit / delete |
| Support Tickets | (Support) | Full add / edit / delete |
| Telephony config + call logs | `/telephony` | Config saves; calls need Twilio creds (below) |
| Dashboards (FDI + Property) | `/` | Read-only, now computed from the live data above |

## ⚠️ Display-only prototype (NOT saved — do not rely on for live work)

- **FDI Projects** (`/projects`) — shows sample projects, not the live seekers
- **Investor Matching** (`/matching`) — computes from live investors/seekers, but saved matches don't persist
- Proposal Builder, Documentation, FEMA Compliance, Due Diligence, Services & Pricing
- Tasks & Calendar, Reports, Accounts (invoices/cashflow)
- Property sub-modules: Fund Management, Profit Distribution, Investor Pool, International

## Dashboard: live vs. illustrative

- **Live (from your data):** Total AUM, investor/seeker/property counts, estimated
  profit, average ROI, sector distribution, project pipeline, recent enquiries,
  the FDI/property tables, and the footer stat strips.
- **Still illustrative (no backing data source yet):** the 12-month AUM/Profit
  history chart, Task Summary ring, Upcoming Activities, Fund Allocation donut,
  and the Cashflow chart. These need a history/tasks/calendar backend to be real.

## Enabling live telephony (Twilio)

Telephony is enabled but **not live** — credentials are blank. To turn on real
calling, a super-admin enters these in **Settings → Telephony** (stored in the DB,
never in code):

1. Account SID
2. API Key (SID) + API Secret
3. TwiML App SID
4. Caller ID (a verified Twilio number)

Then use the **Verify** button — it calls Twilio to validate the credentials.
On the Twilio side, point the TwiML App's Voice webhook and the number's status
callback at your public API:

- Voice URL: `https://app.akontec.pro/api/telephony/voice`
- Status callback: `https://app.akontec.pro/api/telephony/status`

## Credentials

Seed passwords are now env-driven (`server/.env`, gitignored) and applied on every
`npm run seed`. Defaults are no longer committed. See `server/.env.example`.
