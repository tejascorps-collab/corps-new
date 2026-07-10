import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, TrendingUp, Building2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { company } from '../data/mockData'

export default function Login() {
  const { authed, login, pushNotification } = useApp()
  const nav = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Already signed in → bounce to the app.
  if (authed) return <Navigate to={from} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const ok = await login({ username, password })
    setBusy(false)
    if (ok) nav(from, { replace: true })
    else setError('Invalid email or password. Please try again.')
  }

  return (
    <div className="flex min-h-screen">
      {/* ---------- Left: brand / marketing panel ---------- */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/5 bg-panel-gradient p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(600px 300px at 80% -10%, rgba(212,175,55,0.12), transparent 60%), radial-gradient(500px 300px at -10% 90%, rgba(46,196,182,0.08), transparent 55%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <img src="/logo.svg" alt="" className="h-11 w-11" />
          <div>
            <div className="font-display text-lg font-bold text-white">{company.name}</div>
            <div className="text-xs text-gold-400">Investment & Property Management</div>
          </div>
        </div>

        <div className="relative">
          <h1 className="font-display text-4xl font-bold leading-tight text-white">
            Manage capital,<br />properties &amp;{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">FDI deals</span>
            <br />in one place.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            A unified console for investors, investment seekers and cross-border
            property portfolios — with compliance, matching and reporting built in.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: TrendingUp, label: '₹450 Cr+ managed' },
              { icon: Building2, label: '120+ properties' },
              { icon: ShieldCheck, label: 'FEMA compliant' },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-slate-200"
              >
                <f.icon size={16} className="text-gold-300" />
                {f.label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-slate-600">
          © {'2026'} {company.name}. All rights reserved.
        </div>
      </div>

      {/* ---------- Right: sign-in form ---------- */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src="/logo.svg" alt="" className="h-10 w-10" />
            <div className="font-display text-base font-bold text-white">{company.name}</div>
          </div>

          <h2 className="font-display text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-1.5 text-sm text-slate-400">Sign in to your admin console to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="label" htmlFor="username">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="username"
                  type="email"
                  autoComplete="username"
                  className="input pl-10"
                  placeholder="you@company.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="label mb-0" htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => pushNotification({ type: 'system', title: 'Reset link sent', text: 'Password reset link sent to your email.', tone: 'blue', icon: 'Mail' })}
                  className="text-xs text-gold-400 hover:text-gold-300"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input px-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-white/25 bg-transparent text-gold-400 accent-gold-400 focus:ring-1 focus:ring-gold-400/40"
              />
              Keep me signed in
            </label>

            {error && (
              <div className="rounded-xl border border-brand-red/20 bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">
                {error}
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-gold w-full">
              {busy ? (
                'Signing in…'
              ) : (
                <>
                  <LogIn size={16} /> Sign in
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
