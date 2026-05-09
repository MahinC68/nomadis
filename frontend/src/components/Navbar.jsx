import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/trips', label: 'My Trips' },
  { to: '/plan', label: 'Plan a Trip', accent: true },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav
      style={{
        position: 'fixed',
        top: 16,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(12, 10, 30, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 999,
          boxShadow: `
            0 1px 0 rgba(255,255,255,0.14) inset,
            0 -1px 0 rgba(0,0,0,0.5) inset,
            0 10px 40px rgba(0,0,0,0.5),
            0 2px 10px rgba(0,0,0,0.35),
            0 0 0 1px rgba(255,255,255,0.09)
          `,
          padding: 4,
          gap: 2,
          pointerEvents: 'auto',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '8px 16px 8px 12px',
            fontWeight: 800,
            fontSize: 15,
            color: '#F5E6C8',
            textDecoration: 'none',
            borderRight: '1px solid rgba(255,255,255,0.09)',
            marginRight: 4,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 18 }}>🌍</span>
          <span>Nomadis</span>
        </Link>

        {NAV_LINKS.map(({ to, label, accent }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                fontSize: 13.5,
                fontWeight: active ? 700 : 500,
                textDecoration: 'none',
                borderRadius: 999,
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                ...(accent
                  ? {
                      background: 'linear-gradient(175deg, #ff7e7e 0%, #e55050 100%)',
                      color: '#fff',
                      boxShadow:
                        '0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 3px 12px rgba(255,100,100,0.45)',
                    }
                  : active
                  ? {
                      background: 'rgba(255,255,255,0.13)',
                      color: '#fff',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.12) inset',
                    }
                  : {
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.58)',
                    }),
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
