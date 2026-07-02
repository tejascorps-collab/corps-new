import { useState, useRef, useEffect } from 'react'
import { PageHeader, Card, CardHeader, Badge, StatCard, Table, Avatar, initials, Icon } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField, ConfirmDialog } from '../../components/ui/Modal'
import { supportStats, chatConversations, cannedReplies } from '../../data/mockData'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { Send } from 'lucide-react'

const prioTone = { High: 'red', Medium: 'orange', Low: 'slate' }
const emptyTicket = { subject: '', requester: '', category: 'General', priority: 'Medium' }

export default function Support() {
  const [tab, setTab] = useState('chat')
  const { tickets, addTicket, deleteTicket } = useData()
  const { pushNotification } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyTicket)
  const [toDelete, setToDelete] = useState(null)
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.subject.trim()) return
    const item = addTicket(form)
    setModal(false)
    setForm(emptyTicket)
    setTab('tickets')
    pushNotification({ type: 'support', title: 'Ticket created', text: `${item.id}: ${item.subject}`, tone: 'red', icon: 'LifeBuoy', to: '/support' })
  }

  return (
    <div>
      <PageHeader title="Support Center" subtitle="Live chat, tickets & customer help desk" icon="LifeBuoy">
        <button className="btn-gold btn-sm" onClick={() => setModal(true)}>+ New Ticket</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Open Tickets" value={supportStats.open} delta={0} up icon="Inbox" tint="blue" />
        <StatCard label="In Progress" value={supportStats.inProgress} delta={0} up icon="Loader" tint="orange" />
        <StatCard label="Resolved Today" value={supportStats.resolvedToday} delta={12} up icon="CheckCircle2" tint="green" />
        <StatCard label="Avg. Response" value={supportStats.avgResponse} delta={8} up icon="Clock" tint="teal" />
        <StatCard label="CSAT" value={supportStats.csat} delta={3} up icon="Smile" tint="gold" />
      </div>

      <div className="mb-5 flex gap-1 border-b border-white/10">
        {[['chat', 'Live Chat'], ['tickets', 'Tickets']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`relative -mb-px px-4 py-2.5 text-sm font-medium transition ${tab === k ? 'text-gold-200' : 'text-slate-400 hover:text-slate-200'}`}>
            {l}
            {tab === k && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gold-gradient" />}
          </button>
        ))}
      </div>

      {tab === 'chat' ? <LiveChatConsole /> : <TicketsTable tickets={tickets} onDelete={setToDelete} />}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => { deleteTicket(toDelete.id); setToDelete(null) }}
        title="Delete ticket?"
        message={toDelete ? `Delete ${toDelete.id}: “${toDelete.subject}”? This cannot be undone.` : ''}
        confirmLabel="Delete ticket"
      />

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="New Support Ticket"
        subtitle="Log a new customer request"
        icon="LifeBuoy"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={submit}>Create Ticket</button>
          </>
        }
      >
        <form onSubmit={submit}>
          <FormGrid>
            <TextField label="Subject" value={form.subject} onChange={set('subject')} placeholder="Brief summary of the issue" required full />
            <TextField label="Requester" value={form.requester} onChange={set('requester')} placeholder="e.g. Dubai Capital Group" />
            <SelectField label="Category" value={form.category} onChange={set('category')} options={['General', 'KYC', 'Portal', 'Finance', 'Compliance', 'Account']} />
            <SelectField label="Priority" value={form.priority} onChange={set('priority')} options={['Low', 'Medium', 'High']} />
          </FormGrid>
        </form>
      </Modal>
    </div>
  )
}

function TicketsTable({ tickets, onDelete }) {
  return (
    <Table
      columns={[
        { key: 'id', label: 'Ticket' },
        { key: 'subject', label: 'Subject' },
        { key: 'requester', label: 'Requester' },
        { key: 'category', label: 'Category' },
        { key: 'priority', label: 'Priority' },
        { key: 'agent', label: 'Agent' },
        { key: 'status', label: 'Status' },
        { key: 'updated', label: 'Updated' },
        { key: 'actions', label: '', align: 'right' },
      ]}
      rows={tickets}
      renderCell={(key, row) => {
        if (key === 'id') return <span className="font-medium text-gold-300">{row.id}</span>
        if (key === 'subject') return <span className="font-medium text-slate-100">{row.subject}</span>
        if (key === 'priority') return <Badge tone={prioTone[row.priority]}>{row.priority}</Badge>
        if (key === 'status') return <Badge>{row.status}</Badge>
        if (key === 'agent') return row.agent === 'Unassigned' ? <span className="text-slate-500">Unassigned</span> : row.agent
        if (key === 'actions')
          return (
            <button
              onClick={() => onDelete(row)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-brand-red/10 hover:text-brand-red"
              title="Delete ticket"
            >
              <Icon name="Trash2" size={15} />
            </button>
          )
        return row[key]
      }}
    />
  )
}

function LiveChatConsole() {
  const { pushNotification } = useApp()
  const [activeId, setActiveId] = useState(chatConversations[0].id)
  // per-conversation message store (seeded from mock)
  const [store, setStore] = useState(() => Object.fromEntries(chatConversations.map((c) => [c.id, c.messages])))
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const timers = useRef([])
  const active = chatConversations.find((c) => c.id === activeId)
  const messages = store[activeId]

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing, activeId])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const send = (e) => {
    e?.preventDefault()
    const t = text.trim()
    if (!t) return
    setStore((s) => ({ ...s, [activeId]: [...s[activeId], { from: 'me', text: t, time: 'now' }] }))
    setText('')
    setTyping(true)
    const reply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)]
    timers.current.push(setTimeout(() => {
      setTyping(false)
      setStore((s) => ({ ...s, [activeId]: [...s[activeId], { from: 'them', text: reply, time: 'now' }] }))
    }, 1400))
  }

  return (
    <Card className="grid grid-cols-1 overflow-hidden md:grid-cols-[280px_1fr]" >
      {/* Conversation list */}
      <div className="border-b border-white/10 md:border-b-0 md:border-r">
        <div className="px-4 py-3 text-sm font-semibold text-white">Conversations</div>
        <div className="max-h-[440px] overflow-y-auto">
          {chatConversations.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)}
              className={`flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/[0.03] ${activeId === c.id ? 'bg-white/[0.04]' : ''}`}>
              <div className="relative">
                <Avatar initials={initials(c.name)} tint={c.tint} />
                {c.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-850 bg-brand-green" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-slate-100">{c.name}</span>
                  {c.unread > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[9px] font-bold text-ink-950">{c.unread}</span>}
                </div>
                <div className="truncate text-xs text-slate-500">{c.last}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active thread */}
      <div className="flex h-[500px] flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Avatar initials={initials(active.name)} tint={active.tint} />
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">{active.name}</div>
            <div className="text-[11px] text-slate-500">{active.role} · {active.online ? 'Online' : 'Offline'}</div>
          </div>
          <button onClick={() => pushNotification({ type: 'support', title: 'Calling requester', text: `Starting a call with ${active.name}…`, tone: 'green', icon: 'Phone' })} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="Phone" size={16} /></button>
          <button onClick={() => pushNotification({ type: 'support', title: 'Conversation', text: `More options for ${active.name}.`, tone: 'blue', icon: 'MoreVertical' })} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="MoreVertical" size={16} /></button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-ink-900/40 p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.from === 'me' ? 'rounded-br-sm bg-gold-gradient text-ink-950' : 'rounded-bl-sm bg-white/[0.06] text-slate-200'}`}>
                {m.text}
                <div className={`mt-0.5 text-[10px] ${m.from === 'me' ? 'text-ink-950/60' : 'text-slate-500'}`}>{m.time}</div>
              </div>
            </div>
          ))}
          {typing && <div className="text-xs text-slate-500">{active.name} is typing…</div>}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-white/10 p-3">
          <button type="button" onClick={() => pushNotification({ type: 'support', title: 'Attach a file', text: 'File attachments are coming soon.', tone: 'gold', icon: 'Paperclip' })} className="rounded-lg p-2 text-slate-400 hover:bg-white/5"><Icon name="Paperclip" size={18} /></button>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your reply…" className="input py-2.5" />
          <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-gradient text-ink-950 hover:brightness-110"><Send size={17} /></button>
        </form>
      </div>
    </Card>
  )
}
