import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { user, login } = useAuth()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  if (user) return <Navigate to="/" replace />
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true)
    try { await login(Object.fromEntries(new FormData(event.currentTarget))); navigate(location.state?.from?.pathname || '/', { replace: true }) }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return <AuthShell title="Welcome back" subtitle="Sign in to continue reading.">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="mt-5 text-center text-sm text-gray-600">New to PhantomPen? <Link className="font-semibold text-brand" to="/signup">Create an account</Link></p>
  </AuthShell>
}

function AuthShell({ title, subtitle, children }) {
  return <main className="mx-auto max-w-md px-4 py-16"><div className="rounded-3xl bg-white p-8 shadow-sm"><Link to="/" className="text-lg font-extrabold text-brand">PhantomPen</Link><h1 className="mt-8 text-3xl font-bold">{title}</h1><p className="mt-2 mb-7 text-gray-600">{subtitle}</p>{children}</div></main>
}
function Field({ label, name, ...props }) {
  return <label className="block text-sm font-medium">{label}<input name={name} {...props} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand" /></label>
}
