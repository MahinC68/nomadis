import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/trips', label: 'My Trips' },
  { to: '/plan', label: 'Plan a Trip', accent: true },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <>
      <style>{`
        .nav-pill {
          display: flex;
          align-items: center;
          padding: 8px 18px;
          font-size: 13.5px;
          font-weight: 500;
          text-decoration: none;
          border-radius: 999px;
          white-space: nowrap;
          color: rgba(255,255,255,0.58);
          background: transparent;
          transition: color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
        }
        .nav-pill:hover {
          color: rgba(255,255,255,0.92);
          background: rgba(255,255,255,0.09);
        }
        .nav-pill.active {
          color: #fff;
          font-weight: 700;
          background: rgba(255,255,255,0.13);
          box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset;
        }
        .nav-pill.active:hover {
          background: rgba(255,255,255,0.18);
        }
        .nav-accent {
          display: flex;
          align-items: center;
          padding: 8px 18px;
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 999px;
          white-space: nowrap;
          color: #fff;
          background: linear-gradient(175deg, #ff7e7e 0%, #e55050 100%);
          box-shadow: 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 3px 12px rgba(255,100,100,0.45);
          transition: opacity 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }
        .nav-accent:hover {
          opacity: 0.88;
          transform: translateY(-1px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 6px 20px rgba(255,100,100,0.5);
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px 8px 12px;
          font-weight: 800;
          font-size: 15px;
          color: #F5E6C8;
          text-decoration: none;
          border-right: 1px solid rgba(255,255,255,0.09);
          margin-right: 4px;
          letter-spacing: -0.01em;
          white-space: nowrap;
          transition: color 0.18s ease;
        }
        .nav-logo:hover {
          color: #fff;
        }
      `}</style>

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
          <Link to="/" className="nav-logo">
            <span style={{ fontSize: 18 }}>🌍</span>
            <span>Nomadis</span>
          </Link>

          {NAV_LINKS.map(({ to, label, accent }) => {
            const active = pathname === to
            return accent ? (
              <Link key={to} to={to} className="nav-accent">
                {label}
              </Link>
            ) : (
              <Link key={to} to={to} className={`nav-pill${active ? ' active' : ''}`}>
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
