import { useApp } from '../context/AppContext'
import FDIDashboard from './dashboards/FDIDashboard'
import PropertyDashboard from './dashboards/PropertyDashboard'

// "/" renders the dashboard for whichever workspace is active.
export default function Dashboard() {
  const { workspace } = useApp()
  return workspace === 'property' ? <PropertyDashboard /> : <FDIDashboard />
}
