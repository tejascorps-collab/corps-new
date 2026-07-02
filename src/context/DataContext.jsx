import { createContext, useContext, useState, useCallback } from 'react'
import * as data from '../data/mockData'
import { newInvestorId, newSeekerId, newPropertyId, newTicketId } from '../data/mockData'

const DataContext = createContext(null)
export const useData = () => useContext(DataContext)

// We mutate the shared mockData arrays (so detail getters like getInvestor and
// globalSearch see new records) AND keep React state in sync (to trigger re-renders).
export function DataProvider({ children }) {
  const [investors, setInvestors] = useState(data.investors)
  const [seekers, setSeekers] = useState(data.seekers)
  const [properties, setProperties] = useState(data.properties)
  const [tickets, setTickets] = useState(data.supportTickets)

  // ----- Investors -----
  const addInvestor = useCallback((form) => {
    const item = {
      id: newInvestorId(),
      name: form.name,
      country: form.country || 'India',
      capacity: form.capacity || '₹0 Cr',
      industries: form.industries ? form.industries.split(',').map((s) => s.trim()).filter(Boolean) : ['General'],
      kyc: form.kyc || 'Pending',
      invested: '₹0.00 Cr',
      roi: '—',
      rm: form.rm || 'Unassigned',
      risk: form.risk || 'Moderate',
      status: form.status || 'Onboarding',
    }
    data.investors.unshift(item)
    setInvestors([...data.investors])
    return item
  }, [])

  const updateInvestor = useCallback((id, patch) => {
    const idx = data.investors.findIndex((i) => i.id === id)
    if (idx === -1) return
    data.investors[idx] = { ...data.investors[idx], ...patch }
    setInvestors([...data.investors])
  }, [])

  const deleteInvestor = useCallback((id) => {
    const idx = data.investors.findIndex((i) => i.id === id)
    if (idx >= 0) data.investors.splice(idx, 1)
    setInvestors([...data.investors])
  }, [])

  const deleteInvestors = useCallback((ids) => {
    const set = new Set(ids)
    for (let i = data.investors.length - 1; i >= 0; i--) if (set.has(data.investors[i].id)) data.investors.splice(i, 1)
    setInvestors([...data.investors])
  }, [])

  // ----- Seekers -----
  const addSeeker = useCallback((form) => {
    const item = {
      id: newSeekerId(),
      company: form.company,
      cin: form.cin || '—',
      industry: form.industry || 'General',
      location: form.location || 'India',
      required: form.required || '₹0 Cr',
      equity: form.equity || '0%',
      roi: form.roi || '0%',
      stage: form.stage || 'Seed',
      valuation: form.valuation || '₹0 Cr',
      status: form.status || 'Enquiry',
    }
    data.seekers.unshift(item)
    setSeekers([...data.seekers])
    return item
  }, [])

  const updateSeeker = useCallback((id, patch) => {
    const idx = data.seekers.findIndex((s) => s.id === id)
    if (idx === -1) return
    data.seekers[idx] = { ...data.seekers[idx], ...patch }
    setSeekers([...data.seekers])
  }, [])

  const deleteSeeker = useCallback((id) => {
    const idx = data.seekers.findIndex((s) => s.id === id)
    if (idx >= 0) data.seekers.splice(idx, 1)
    setSeekers([...data.seekers])
  }, [])

  const deleteSeekers = useCallback((ids) => {
    const set = new Set(ids)
    for (let i = data.seekers.length - 1; i >= 0; i--) if (set.has(data.seekers[i].id)) data.seekers.splice(i, 1)
    setSeekers([...data.seekers])
  }, [])

  // ----- Properties -----
  const addProperty = useCallback((form) => {
    const item = {
      id: newPropertyId(),
      name: form.name,
      category: form.category || 'Commercial',
      location: form.location || 'India',
      purchase: form.purchase || '₹0 Cr',
      current: form.current || form.purchase || '₹0 Cr',
      expected: form.expected || '₹0 Cr',
      rental: form.rental || '—',
      roi: form.roi || '0%',
      legal: form.legal || 'Under Review',
      status: form.status || 'Acquired',
    }
    data.properties.unshift(item)
    setProperties([...data.properties])
    return item
  }, [])

  const updateProperty = useCallback((id, patch) => {
    const idx = data.properties.findIndex((p) => p.id === id)
    if (idx === -1) return
    data.properties[idx] = { ...data.properties[idx], ...patch }
    setProperties([...data.properties])
  }, [])

  const deleteProperty = useCallback((id) => {
    const idx = data.properties.findIndex((p) => p.id === id)
    if (idx >= 0) data.properties.splice(idx, 1)
    setProperties([...data.properties])
  }, [])

  const deleteProperties = useCallback((ids) => {
    const set = new Set(ids)
    for (let i = data.properties.length - 1; i >= 0; i--) if (set.has(data.properties[i].id)) data.properties.splice(i, 1)
    setProperties([...data.properties])
  }, [])

  // ----- Tickets -----
  const addTicket = useCallback((form) => {
    const item = {
      id: newTicketId(),
      subject: form.subject,
      requester: form.requester || '—',
      category: form.category || 'General',
      priority: form.priority || 'Medium',
      status: 'Open',
      updated: 'just now',
      agent: 'Unassigned',
    }
    data.supportTickets.unshift(item)
    setTickets([...data.supportTickets])
    return item
  }, [])

  const updateTicket = useCallback((id, patch) => {
    const idx = data.supportTickets.findIndex((t) => t.id === id)
    if (idx === -1) return
    data.supportTickets[idx] = { ...data.supportTickets[idx], ...patch }
    setTickets([...data.supportTickets])
  }, [])

  const deleteTicket = useCallback((id) => {
    const idx = data.supportTickets.findIndex((t) => t.id === id)
    if (idx >= 0) data.supportTickets.splice(idx, 1)
    setTickets([...data.supportTickets])
  }, [])

  const value = {
    investors, seekers, properties, tickets,
    addInvestor, updateInvestor, deleteInvestor, deleteInvestors,
    addSeeker, updateSeeker, deleteSeeker, deleteSeekers,
    addProperty, updateProperty, deleteProperty, deleteProperties,
    addTicket, updateTicket, deleteTicket,
  }
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
