import { createContext, useContext, useState, useEffect } from 'react'
import * as data from '../data/mockData'
import { api } from '../lib/api'
import { useApp } from './AppContext'

const DataContext = createContext(null)
export const useData = () => useContext(DataContext)

// Replace a shared mockData array's contents IN PLACE, so detail getters
// (getInvestor, …) and globalSearch — which close over these arrays — see the
// live DB data without any rewiring.
const replaceInPlace = (arr, next) => { arr.splice(0, arr.length, ...next) }

// The app is DB-backed now. DataContext fetches each collection from the API on
// login, keeps React state for re-renders, and mirrors it into the mockData
// arrays that the rest of the app already reads from.
export function DataProvider({ children }) {
  const { authed } = useApp()

  const [investors, setInvestors] = useState(data.investors)
  const [seekers, setSeekers] = useState(data.seekers)
  const [properties, setProperties] = useState(data.properties)
  const [tickets, setTickets] = useState(data.supportTickets)
  const [leads, setLeads] = useState(data.leads)
  const [loading, setLoading] = useState(false)

  // Hydrate everything once authenticated.
  useEffect(() => {
    if (!authed) return
    let alive = true
    setLoading(true)
    Promise.all([
      api.get('/investors'), api.get('/seekers'), api.get('/properties'),
      api.get('/tickets'), api.get('/leads'),
    ])
      .then(([inv, sek, prop, tkt, lead]) => {
        if (!alive) return
        replaceInPlace(data.investors, inv); setInvestors(inv)
        replaceInPlace(data.seekers, sek); setSeekers(sek)
        replaceInPlace(data.properties, prop); setProperties(prop)
        replaceInPlace(data.supportTickets, tkt); setTickets(tkt)
        replaceInPlace(data.leads, lead); setLeads(lead)
      })
      .catch(() => { /* keep last-known / seed data on failure */ })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [authed])

  // Keep the mockData array and React state in sync after a mutation.
  const sync = (arr, next, setState) => { replaceInPlace(arr, next); setState([...next]) }

  const makeCrud = (path, arr, setState) => ({
    add: async (form) => {
      const item = await api.post(path, form)
      sync(arr, [item, ...arr], setState)
      return item
    },
    update: async (id, patch) => {
      const item = await api.patch(`${path}/${id}`, patch)
      sync(arr, arr.map((x) => (x.id === id ? item : x)), setState)
      return item
    },
    remove: async (id) => {
      await api.del(`${path}/${id}`)
      sync(arr, arr.filter((x) => x.id !== id), setState)
    },
    removeMany: async (ids) => {
      await api.post(`${path}/bulk-delete`, { ids })
      const set = new Set(ids)
      sync(arr, arr.filter((x) => !set.has(x.id)), setState)
    },
  })

  const inv = makeCrud('/investors', investors, setInvestors)
  const sek = makeCrud('/seekers', seekers, setSeekers)
  const prop = makeCrud('/properties', properties, setProperties)
  const tkt = makeCrud('/tickets', tickets, setTickets)
  const lead = makeCrud('/leads', leads, setLeads)

  const value = {
    loading,
    investors, seekers, properties, tickets, leads,
    addInvestor: inv.add, updateInvestor: inv.update, deleteInvestor: inv.remove, deleteInvestors: inv.removeMany,
    addSeeker: sek.add, updateSeeker: sek.update, deleteSeeker: sek.remove, deleteSeekers: sek.removeMany,
    addProperty: prop.add, updateProperty: prop.update, deleteProperty: prop.remove, deleteProperties: prop.removeMany,
    addTicket: tkt.add, updateTicket: tkt.update, deleteTicket: tkt.remove,
    addLead: lead.add, updateLead: lead.update, deleteLead: lead.remove,
  }
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
