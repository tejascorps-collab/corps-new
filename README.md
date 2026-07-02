# FDI Prime Investments — Admin Platform

A rich, dark-luxury **Investment & Property Management Platform** for FDI consultancy and
property investment, built to match the reference dashboard design (navy/black + gold theme).

> **Frontend prototype with mock data** — fully navigable UI across all modules. No backend/database yet.

## Tech Stack
- **React 18** + **Vite 5**
- **Tailwind CSS 3** (custom `ink` / `gold` / `brand` palette in `tailwind.config.js`)
- **React Router 6** for navigation
- **Recharts** for charts, **lucide-react** for icons
- Fonts: Inter (UI) + Playfair Display (display headings)

## Getting Started
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Modules

**Dashboard** — KPI cards, AUM/Profit chart, investment distribution donut, FDI pipeline funnel,
enquiries, activities, task summary ring, recent investments & properties, footer stat strip.

**FDI Consultancy**
- Investors · Investment Seekers · FDI Projects
- Proposal Builder (sectioned editor + live PDF-style preview)
- Documentation (with checklist) · FEMA Compliance (checklist + sector limits + RBI forms)
- Due Diligence (verification matrix) · Investor Matching Engine · Services & Pricing

**Property Investment**
- Property Database (category filters, cards) · Property Deals (acquisition workflow)
- Investor Pool · Fund Management · Profit Distribution (80/20 split calc)
- International Property (country-wise: currency, tax, residency)

**Business Management**
- CRM & Leads (kanban + pipeline) · Tasks & Calendar
- Accounts & Finance (invoices, cash flow, GST/TDS) · Reports & Analytics · Settings & Users (roles matrix)

**Portals** — Investor Portal · Investment Seeker Portal

## Project Structure
```
src/
  components/
    layout/     Sidebar, Topbar, Layout
    ui/         Primitives.jsx  (Card, StatCard, Badge, Table, PageHeader, Toolbar, Progress…)
    charts/     Charts.jsx      (AUM/Profit, Donut, Ring, HBar, Cashflow, Funnel)
  config/nav.js  Sidebar navigation model
  data/mockData.js  All sample data (single source of truth)
  pages/        Dashboard + fdi/ property/ business/ portals/
```

## Customising
- **Theme colors:** `tailwind.config.js` → `colors.ink / gold / brand`
- **Data:** `src/data/mockData.js` — swap for real API calls when a backend is added
- **Navigation / routes:** `src/config/nav.js` and `src/App.jsx`

## Compliance Note
The pooled property-investment model (collecting investor money, buying/selling property, and
distributing profit) may fall under SEBI-regulated collective investment / AIF rules and FEMA
requirements for foreign investors. Obtain advice from a qualified securities, real-estate, and
tax lawyer before operating this model commercially.
