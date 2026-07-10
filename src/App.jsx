import { lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import { useApp } from './context/AppContext'

// Gate that redirects unauthenticated users to /login, preserving where they were headed.
// While the session is being restored from a stored token, show nothing (avoids a
// flash of the login page on refresh).
function RequireAuth({ children }) {
  const { authed, authLoading } = useApp()
  const location = useLocation()
  if (authLoading) {
    return (
      <div className="grid h-screen place-items-center bg-ink-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold-400" />
      </div>
    )
  }
  if (!authed) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

// Route-level code splitting — each page is its own chunk, loaded on demand.
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Support = lazy(() => import('./pages/business/Support'))

// FDI
const Investors = lazy(() => import('./pages/fdi/Investors'))
const InvestorDetail = lazy(() => import('./pages/fdi/InvestorDetail'))
const InvestmentSeekers = lazy(() => import('./pages/fdi/InvestmentSeekers'))
const SeekerDetail = lazy(() => import('./pages/fdi/SeekerDetail'))
const FDIProjects = lazy(() => import('./pages/fdi/FDIProjects'))
const FDIProjectDetail = lazy(() => import('./pages/fdi/FDIProjectDetail'))
const ProposalBuilder = lazy(() => import('./pages/fdi/ProposalBuilder'))
const Documentation = lazy(() => import('./pages/fdi/Documentation'))
const FEMACompliance = lazy(() => import('./pages/fdi/FEMACompliance'))
const DueDiligence = lazy(() => import('./pages/fdi/DueDiligence'))
const InvestorMatching = lazy(() => import('./pages/fdi/InvestorMatching'))
const ServicesPricing = lazy(() => import('./pages/fdi/ServicesPricing'))

// Property
const Properties = lazy(() => import('./pages/property/Properties'))
const PropertyDetail = lazy(() => import('./pages/property/PropertyDetail'))
const PropertyDeals = lazy(() => import('./pages/property/PropertyDeals'))
const InvestorPool = lazy(() => import('./pages/property/InvestorPool'))
const FundManagement = lazy(() => import('./pages/property/FundManagement'))
const ProfitDistribution = lazy(() => import('./pages/property/ProfitDistribution'))
const InternationalProperty = lazy(() => import('./pages/property/InternationalProperty'))

// Business
const CRM = lazy(() => import('./pages/business/CRM'))
const Telephony = lazy(() => import('./pages/business/Telephony'))
const TasksCalendar = lazy(() => import('./pages/business/TasksCalendar'))
const Accounts = lazy(() => import('./pages/business/Accounts'))
const Reports = lazy(() => import('./pages/business/Reports'))
const Settings = lazy(() => import('./pages/business/Settings'))

// Portals
const InvestorPortal = lazy(() => import('./pages/portals/InvestorPortal'))
const SeekerPortal = lazy(() => import('./pages/portals/SeekerPortal'))

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="investors" element={<Investors />} />
        <Route path="investors/:id" element={<InvestorDetail />} />
        <Route path="seekers" element={<InvestmentSeekers />} />
        <Route path="seekers/:id" element={<SeekerDetail />} />
        <Route path="projects" element={<FDIProjects />} />
        <Route path="projects/:id" element={<FDIProjectDetail />} />
        <Route path="proposal-builder" element={<ProposalBuilder />} />
        <Route path="documentation" element={<Documentation />} />
        <Route path="fema" element={<FEMACompliance />} />
        <Route path="due-diligence" element={<DueDiligence />} />
        <Route path="matching" element={<InvestorMatching />} />
        <Route path="services" element={<ServicesPricing />} />

        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="property-deals" element={<PropertyDeals />} />
        <Route path="investor-pool" element={<InvestorPool />} />
        <Route path="fund-management" element={<FundManagement />} />
        <Route path="profit-distribution" element={<ProfitDistribution />} />
        <Route path="international" element={<InternationalProperty />} />

        <Route path="crm" element={<CRM />} />
        <Route path="telephony" element={<Telephony />} />
        <Route path="tasks" element={<TasksCalendar />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
        <Route path="notifications" element={<Notifications />} />

        <Route path="portal/investor" element={<InvestorPortal />} />
        <Route path="portal/seeker" element={<SeekerPortal />} />

        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}
