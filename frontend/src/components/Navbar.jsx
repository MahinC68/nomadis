import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/plan', label: 'Plan Trip' },
  { to: '/trips', label: 'My Trips' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-coral transition-colors">
          <span className="text-2xl">🌍</span>
          <span>Nomadis</span>
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors ${
                pathname === to ? 'text-coral' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/plan"
            className="bg-coral text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-coral-dark transition-colors shadow-sm"
          >
            Plan a Trip
          </Link>
        </div>
      </div>
    </nav>
  )
}
