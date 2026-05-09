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
        .btn-plan {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(175deg, #ff7e7e 0%, #e55050 100%);
          color: #fff;
          padding: 16px 40px;
          border-radius: 1rem;
          font-size: 18px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 3px 12px rgba(255,100,100,0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .btn-plan:hover {
          transform: translateY(-2px);
          opacity: 0.9;
          box-shadow: 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 8px 24px rgba(255,100,100,0.55);
        }
        .btn-plan:hover .btn-arrow {
          transform: translateX(5px);
        }
        .btn-arrow {
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #fff;
          padding: 16px 40px;
          border-radius: 1rem;
          font-size: 18px;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.25);
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.2);
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
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at 65% 50%, #18184a 0%, #0d0d2b 40%, #1c0c42 70%, #2e1060 100%)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '6rem 3rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            gap: '6rem',
          }}
        >
          {/* ── Left column: text + buttons ── */}
          <div>
            <h1
              className="text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight"
              style={{ color: '#F5E6C8' }}
            >
              Plan your trip
              <br />
              around how you{' '}
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
              className="text-lg md:text-xl mb-10 leading-relaxed font-light"
              style={{ color: 'rgba(232,218,192,0.64)', maxWidth: 460 }}
            >
              Tell us your travel style, pick a city, and get a personalised day-by-day
              itinerary built around what you actually enjoy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/plan')} className="btn-plan">
                Plan a Trip <span className="btn-arrow">→</span>
              </button>
              <button onClick={() => navigate('/onboarding')} className="btn-secondary">
                Set My Preferences
              </button>
            </div>
          </div>

          {/* ── Right column: 3D globe + orbiting planes ── */}
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            {/* Globe anchor — orbit rings/planes extend outside this box */}
            <div style={{ position: 'relative', width: 560, height: 560, flexShrink: 0 }}>

              {/* Sphere */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
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

              {/* Orbit ring A — matches CW plane radius */}
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

              {/* Orbit ring B — matches CCW plane radius */}
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

              {/* Plane 1: clockwise, outer orbit */}
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
                <div style={{ position: 'absolute', transform: 'translateX(342px) translateY(-7px) rotate(90deg)' }}>
                  <PlaneIcon size={42} color="#E8D5B0" glow />
                </div>
              </div>

              {/* Plane 2: counterclockwise, inner orbit, phase-shifted */}
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
                <div style={{ position: 'absolute', transform: 'translateX(304px) translateY(-6px) rotate(-90deg)' }}>
                  <PlaneIcon size={36} color="#DDB8C8" glow />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce"
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
            <button onClick={() => navigate('/plan')} className="btn-plan">
              Plan a Trip <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
