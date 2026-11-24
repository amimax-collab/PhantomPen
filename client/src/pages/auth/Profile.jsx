import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  return <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-wide text-brand">Profile</p>
    <h1 className="mt-2 text-3xl font-bold">Your account</h1>
    <dl className="mt-8 divide-y divide-gray-100">
      <ProfileRow label="Name" value={user.name} />
      <ProfileRow label="Email" value={user.email} />
      <ProfileRow label="Account type" value={user.role} />
    </dl>
    <Link to="/library" className="mt-8 inline-block font-semibold text-brand">Go to your library →</Link>
  </section>
}
function ProfileRow({ label, value }) { return <div className="flex justify-between gap-4 py-4"><dt className="text-gray-500">{label}</dt><dd className="font-medium capitalize">{value}</dd></div> }
