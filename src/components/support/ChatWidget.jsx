import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Headset } from 'lucide-react'
import { cannedReplies } from '../../data/mockData'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([
    { from: 'them', text: '👋 Hi! You’re chatting with FDI Prime Support. How can we help today?', time: 'now' },
  ])
  const endRef = useRef(null)
  const timers = useRef([])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing, open])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const send = (e) => {
    e?.preventDefault()
    const t = text.trim()
    if (!t) return
    setMessages((m) => [...m, { from: 'me', text: t, time: 'now' }])
    setText('')
    setTyping(true)
    const reply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)]
    timers.current.push(
      setTimeout(() => {
        setTyping(false)
        setMessages((m) => [...m, { from: 'them', text: reply, time: 'now' }])
      }, 1300)
    )
  }

  return (
    <>
      {/* Launcher — sits above bottom nav on mobile */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-ink-950 shadow-glow transition hover:brightness-110 lg:bottom-6"
        aria-label="Live chat"
      >
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-36 right-4 z-40 flex h-[26rem] w-[calc(100vw-2rem)] max-w-sm animate-fade-in flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-card lg:bottom-24">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-gold-700/30 to-ink-800 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-gradient text-ink-950"><Headset size={18} /></span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">FDI Prime Support</div>
              <div className="flex items-center gap-1.5 text-[11px] text-brand-green">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" /> Online · replies in ~2 min
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-white"><X size={18} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-ink-900/50 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.from === 'me' ? 'rounded-br-sm bg-gold-gradient text-ink-950' : 'rounded-bl-sm bg-white/[0.06] text-slate-200'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white/[0.06] px-3.5 py-3">
                  <Dot /> <Dot d="150ms" /> <Dot d="300ms" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <form onSubmit={send} className="flex items-center gap-2 border-t border-white/10 p-2.5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="input py-2"
            />
            <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-gradient text-ink-950 hover:brightness-110">
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function Dot({ d = '0ms' }) {
  return <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: d }} />
}
