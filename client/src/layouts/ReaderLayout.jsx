import { NavLink, Outlet } from 'react-router-dom'
import { Search, Library, Compass, Trophy, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const tabs = [
  { to: '/library', label: 'Library', Icon: Library },
  { to: '/', label: 'Discover', Icon: Compass },
  { to: '/rank', label: 'Rank', Icon: Trophy },
  { to: '/profile', label: 'Profile', Icon: User },
]

export default function ReaderLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  async function signOut() { await logout(); navigate('/') }
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white pb-20 md:pb-0">
      <header className="sticky top-0 z-10 bg-cream/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <span className="text-xl font-extrabold text-brand">NovelHub</span>
          {user ? <div className="ml-auto flex items-center gap-3 text-sm"><Link to="/profile" className="font-medium text-ink">{user.name}</Link><button onClick={signOut} className="text-brand">Log out</button></div> : <Link to="/login" className="ml-auto text-sm font-semibold text-brand">Sign in</Link>}
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input className="w-full text-sm outline-none" placeholder="Search books..." />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t bg-white py-2 md:hidden">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${isActive ? 'text-brand' : 'text-gray-500'}`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
