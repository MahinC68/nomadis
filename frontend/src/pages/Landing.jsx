import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* Airplane silhouette — side profile, points right by default */
function PlaneIcon({ size = 38, color = '#E8D5B0', glow }) {
  return (
    <svg
      viewBox="0 0 40 16"
      width={size}
      height={size * 0.4}
      fill={color}
      style={glow ? { filter: `drop-shadow(0 0 5px ${color}99) drop-shadow(0 0 12px ${color}55)` } : undefined}
      aria-hidden="true"
    >
      {/*
        Nose at (38,8). Wings from ~x=4 to x=22.
        Tail at x=0 with upper and lower fins.
        Path traces: upper nose → upper wing → upper tail fin → lower tail fin → lower wing → back to nose
      */}
      <path d="M38 8 L22 3 L8 0 L4 0 L8 7 L0 6 L0 10 L8 9 L4 16 L8 16 L22 11 L38 8Z" />
    </svg>
  )
}

const FEATURES = [
  {
    icon: '🎯',
    title: 'Personalised recommendations',
    desc: "Rate six travel preferences and the app matches every activity in the city to your score — so you're not wading through things you don't care about.",
    bg: 'bg-gradient-to-br from-orange-50 to-red-50',
    border: 'border-orange-100',
  },
  {
    icon: '🤖',
    title: 'AI writes your itinerary',
    desc: 'GPT turns the matched activities into a day-by-day plan with context for each choice — why this place, why today, and why it suits you.',
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    border: 'border-teal-100',
  },
  {
    icon: '✈️',
    title: 'No two itineraries are the same',
    desc: 'Your preferences are unique, so your itinerary is too. Two people visiting the same city will get completely different plans.',
    bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    border: 'border-yellow-100',
  },
]

const STEPS = [
  {
    num: 1,
    emoji: '🎛️',
    title: 'Set your travel preferences',
    desc: 'Rate six things — adventure, food, culture, nightlife, nature, relaxation — from 0 to 10.',
    color: 'bg-coral',
  },
  {
    num: 2,
    emoji: '🌆',
    title: 'Choose a destination',
    desc: 'Search any destination from our global database of cities.',
    color: 'bg-ocean',
  },
  {
    num: 3,
    emoji: '⚡',
    title: 'Get matched activities',
    desc: 'Every point of interest in that city gets ranked against your preferences using cosine similarity.',
    color: 'bg-coral',
  },
  {
    num: 4,
    emoji: '🧳',
    title: 'View your itinerary',
    desc: 'Get a day-by-day plan with an AI-written explanation of why each activity was picked for you.',
    color: 'bg-ocean',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Keyframe animations — injected once at component root */}
      <style>{`
        @keyframes orbitCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbitCCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes globePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.93; }
        }
      `}</style>

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at 55% 42%, #18184a 0%, #0d0d2b 40%, #1c0c42 70%, #2e1060 100%)',
        }}
      >
        {/* ── 3D Globe — absolutely centered, behind the text ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 560,
            height: 560,
            pointerEvents: 'none',
          }}
        >
          {/* Sphere */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              /*
               * Light source: top-left (~28% x, 22% y).
               * Elliptical overlays simulate continent-shaped landmasses
               * in subtly brighter teal scattered across the surface.
               * The base radial gradient runs from bright highlight at the
               * light source through mid-navy to near-black at the shadow.
               */
              background: `
                radial-gradient(ellipse at 22% 26%, rgba(38,158,172,0.6)  0%, transparent 26%),
                radial-gradient(ellipse at 68% 18%, rgba(14,74,94,0.65)   0%, transparent 22%),
                radial-gradient(ellipse at 55% 65%, rgba(16,84,106,0.5)   0%, transparent 24%),
                radial-gradient(ellipse at 10% 76%, rgba(8,48,68,0.62)    0%, transparent 20%),
                radial-gradient(ellipse at 82% 72%, rgba(12,64,84,0.5)    0%, transparent 22%),
                radial-gradient(ellipse at 36% 44%, rgba(6,42,62,0.36)    0%, transparent 30%),
                radial-gradient(circle   at 28% 22%, #1e8898 0%, #0b3c4e 20%, #061d2c 50%, #030d18 80%, #010608 100%)
              `,
              boxShadow: `
                inset -62px -34px 150px rgba(0,0,0,0.98),
                inset  22px  14px  65px rgba(76,210,210,0.042),
                inset   4px   4px  20px rgba(255,255,255,0.015),
                0   0 110px rgba(14,116,144,0.6),
                0   0 220px rgba(14,116,144,0.25),
                0   0 360px rgba(14,116,144,0.09),
                0  50px 120px rgba(0,0,0,0.8)
              `,
              animation: 'globePulse 8s ease-in-out infinite',
            }}
          />

          {/* Atmospheric limb — soft outer halo */}
          <div
            style={{
              position: 'absolute',
              inset: -16,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, transparent 58%, rgba(14,116,144,0.14) 78%, rgba(14,116,144,0.04) 100%)',
            }}
          />

          {/* ── Orbit ring A — matches CW plane radius ── */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 700,
              height: 700,
              marginTop: -350,
              marginLeft: -350,
              border: '1px solid rgba(100,220,210,0.1)',
              borderRadius: '50%',
            }}
          />

          {/* ── Orbit ring B — matches CCW plane radius ── */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 624,
              height: 624,
              marginTop: -312,
              marginLeft: -312,
              border: '1px dashed rgba(230,160,200,0.08)',
              borderRadius: '50%',
            }}
          />

          {/* ── Plane 1: clockwise, outer orbit ── */}
          {/*
            The orbit wrapper (0×0 div) is centered on the globe.
            animation: rotate(0→360deg) sweeps the wrapper CW.
            The plane inside is offset by translateX(r) — putting it at
            the orbit radius — then rotate(90deg) makes the nose face the
            tangent direction for clockwise travel at the 3-o'clock start.
          */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 0,
              height: 0,
              animation: 'orbitCW 24s linear infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                transform: 'translateX(342px) translateY(-7px) rotate(90deg)',
              }}
            >
              <PlaneIcon size={42} color="#E8D5B0" glow />
            </div>
          </div>

          {/* ── Plane 2: counterclockwise, inner orbit, phase-shifted ── */}
          {/*
            rotate(-90deg) faces the nose toward the correct tangent
            for CCW travel at the 3-o'clock starting position.
            animation-delay: -7s starts the plane mid-orbit so the two
            planes are never at the same screen position simultaneously.
          */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 0,
              height: 0,
              animation: 'orbitCCW 16s linear -7s infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                transform: 'translateX(304px) translateY(-6px) rotate(-90deg)',
              }}
            >
              <PlaneIcon size={36} color="#DDB8C8" glow />
            </div>
          </div>
        </div>

        {/* ── Text content — z-index above globe, below planes ── */}
        <div
          className="relative max-w-5xl mx-auto px-6 text-center"
          style={{ zIndex: 10, paddingTop: '6rem', paddingBottom: '6rem' }}
        >
          <span
            className="inline-flex items-center gap-2 backdrop-blur-sm border px-5 py-2 rounded-full text-sm mb-8 tracking-wide"
            style={{
              background: 'rgba(220,145,175,0.09)',
              borderColor: 'rgba(230,155,185,0.22)',
              color: 'rgba(242,182,205,0.8)',
            }}
          >
            Destinations worldwide
          </span>

          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black leading-none mb-6 tracking-tight"
            style={{ color: '#F5E6C8' }}
          >
            Plan your trip
            <br />
            around how you
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #FF6B6B 0%, #FFD166 60%, #ffa07a 100%)',
              }}
            >
              actually travel
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            style={{ color: 'rgba(232,218,192,0.64)' }}
          >
            Tell us your travel style, pick a city, and get a personalised day-by-day
            itinerary built around what you actually enjoy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/plan')}
              className="bg-coral text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-coral-dark transition-all shadow-2xl shadow-coral/40 hover:-translate-y-1"
            >
              Plan a Trip →
            </button>
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-white/10 backdrop-blur-sm text-white border border-white/25 px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all"
            >
              Set My Preferences
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 flex flex-col items-center gap-1 animate-bounce"
          style={{ color: 'rgba(245,230,200,0.3)', zIndex: 10 }}
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
          <span className="text-base">↓</span>
        </div>
      </section>

      {/* ── WHAT NOMADIS DOES ─────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#FFFDF0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              What Nomadis does
            </h2>
            <p className="text-lg text-gray-500">
              Three things that make your itinerary actually useful.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`${f.bg} border ${f.border} rounded-3xl p-8 hover:shadow-lg transition-all hover:-translate-y-1`}
              >
                <div className="text-6xl mb-6 leading-none">{f.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-20 overflow-hidden" style={{ background: '#FFFDF0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              How it works
            </h2>
            <p className="text-lg text-gray-500">Four steps, then you're done.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-gray-200 z-0" />

            {STEPS.map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`w-24 h-24 ${s.color} text-white rounded-3xl flex flex-col items-center justify-center mb-5 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default`}
                >
                  <span className="text-3xl leading-none mb-0.5">{s.emoji}</span>
                  <span className="text-xs font-black tracking-wider opacity-80">STEP {s.num}</span>
                </div>
                <h3 className="font-black text-gray-900 text-base mb-2 leading-snug px-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => navigate('/plan')}
              className="bg-coral text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-coral-dark transition-all shadow-lg shadow-coral/25 hover:-translate-y-0.5"
            >
              Plan a Trip →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
