import { useState } from 'react'
import { Modal, TextField } from '../ui/Modal'
import { useApp } from '../../context/AppContext'

export default function ChangePasswordModal({ open, onClose }) {
  const { changePassword, pushNotification } = useApp()
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const reset = () => { setCur(''); setNext(''); setConfirm(''); setError(''); setBusy(false) }
  const close = () => { reset(); onClose() }

  const submit = async (e) => {
    e?.preventDefault()
    setError('')
    if (next.length < 8) return setError('New password must be at least 8 characters.')
    if (next !== confirm) return setError('New passwords do not match.')
    setBusy(true)
    const res = await changePassword(cur, next)
    setBusy(false)
    if (res.ok) {
      pushNotification({ type: 'system', title: 'Password changed', text: 'Your password was updated successfully.', tone: 'green', icon: 'ShieldCheck' })
      close()
    } else {
      setError(res.error || 'Could not change password.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Change Password"
      subtitle="Update your account password"
      icon="ShieldCheck"
      size="sm"
      footer={
        <>
          <button className="btn-ghost btn-sm" onClick={close}>Cancel</button>
          <button className="btn-gold btn-sm" onClick={submit} disabled={busy}>{busy ? 'Updating…' : 'Update Password'}</button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <TextField label="Current Password" type="password" value={cur} onChange={setCur} placeholder="••••••••" required full />
        <TextField label="New Password" type="password" value={next} onChange={setNext} placeholder="At least 8 characters" required full />
        <TextField label="Confirm New Password" type="password" value={confirm} onChange={setConfirm} placeholder="Re-enter new password" required full />
        {error && (
          <div className="rounded-xl border border-brand-red/20 bg-brand-red/10 px-3.5 py-2.5 text-sm text-brand-red">{error}</div>
        )}
        {/* Allow Enter to submit within the form */}
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Modal>
  )
}
