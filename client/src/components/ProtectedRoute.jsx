import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p className="py-20 text-center text-gray-500">Loading your account…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (allowedRoles?.length && !allowedRoles.includes(user.role)) return <p className="py-20 text-center text-gray-600">Not allowed. Your account does not have access to this page.</p>
  return <Outlet />
}
