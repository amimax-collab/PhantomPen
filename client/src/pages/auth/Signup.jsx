import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Signup() {
  const { user, register } = useAuth()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  if (user) return <Navigate to="/" replace />
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true)
    try { await register(Object.fromEntries(new FormData(event.currentTarget))); navigate('/', { replace: true }) }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return <main className="mx-auto max-w-md px-4 py-16"><div className="rounded-3xl bg-white p-8 shadow-sm"><Link to="/" className="text-lg font-extrabold text-brand">PhantomPen</Link><h1 className="mt-8 text-3xl font-bold">Create your account</h1><p className="mt-2 mb-7 text-gray-600">Join as a reader or share your stories as an author.</p>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Name" name="name" autoComplete="name" required />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password (at least 8 characters)" name="password" type="password" minLength={8} autoComplete="new-password" required />
      <label className="block text-sm font-medium">I want to join as<select name="role" required defaultValue="reader" className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-3"><option value="reader">Reader</option><option value="author">Author</option></select></label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60">{busy ? 'Creating account…' : 'Create account'}</button>
    </form>
    <p className="mt-5 text-center text-sm text-gray-600">Already have an account? <Link className="font-semibold text-brand" to="/login">Sign in</Link></p>
  </div></main>
}
function Field({ label, name, ...props }) { return <label className="block text-sm font-medium">{label}<input name={name} {...props} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand" /></label> }
