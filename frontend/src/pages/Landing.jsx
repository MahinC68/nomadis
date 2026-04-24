import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Blob({ color, style }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', borderRadius: '50%', background: color, pointerEvents: 'none', ...style }}
    />
  )
}

const DESTINATIONS = [
  { name: 'Paris',     emoji: '🗼', tag: 'Romance & Culture',   gradient: 'linear-gradient(135deg, #FF6B6B 0%, #ee0979 100%)' },
  { name: 'Tokyo',     emoji: '⛩️', tag: 'Food & Tradition',    gradient: 'linear-gradient(135deg, #667eea 0%, #4ECDC4 100%)' },
  { name: 'New York',  emoji: '🗽', tag: 'Energy & Nightlife',  gradient: 'linear-gradient(135deg, #2980B9 0%, #6DD5FA 100%)' },
  { name: 'Barcelona', emoji: '🏖️', tag: 'Sun & Architecture', gradient: 'linear-gradient(135deg, #f7971e 0%, #FFD166 100%)' },
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'Personalised recommendations',
    desc: 'Rate six travel preferences and the app matches every activity in the city to your score — so you\'re not wading through things you don\'t care about.',
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
    desc: 'Pick from Paris, Tokyo, New York, Barcelona, or Rome.',
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

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.5px)',
  backgroundSize: '22px 22px',
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ background: '#0d0f1c', minHeight: '88vh' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Blob color="#FF6B6B" style={{ top: '-15%', left: '-10%', width: 620, height: 620, filter: 'blur(110px)', opacity: 0.45 }} />
          <Blob color="#4ECDC4" style={{ top: '-12%', right: '-8%', width: 520, height: 520, filter: 'blur(100px)', opacity: 0.4 }} />
          <Blob color="#FF8C42" style={{ top: '38%', right: '-6%', width: 380, height: 380, filter: 'blur(90px)', opacity: 0.38 }} />
          <Blob color="#FFD166" style={{ bottom: '-12%', left: '28%', width: 460, height: 460, filter: 'blur(100px)', opacity: 0.3 }} />
          <Blob color="#4ECDC4" style={{ bottom: '4%', left: '-4%', width: 280, height: 280, filter: 'blur(75px)', opacity: 0.28 }} />
          <Blob color="#FF6B6B" style={{ top: '45%', left: '42%', width: 200, height: 200, filter: 'blur(60px)', opacity: 0.2 }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 border border-white/20 px-5 py-2 rounded-full text-sm mb-8 tracking-wide">
            Paris · Tokyo · New York · Barcelona · Rome
          </span>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none mb-6 tracking-tight">
            Plan your trip
            <br />
            around how you
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #FF6B6B 0%, #FFD166 60%, #ffa07a 100%)' }}
            >
              actually travel
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Tell us your travel style, pick a city, and get a personalised day-by-day itinerary built around what you actually enjoy.
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

        <div className="absolute bottom-6 flex flex-col items-center text-white/40 gap-1 animate-bounce">
          <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
          <span className="text-base">↓</span>
        </div>
      </section>

      {/* ── DESTINATIONS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              Where do you want to go?
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Five cities are supported right now. Pick one to see what your itinerary could look like.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DESTINATIONS.map((d) => (
              <button
                key={d.name}
                onClick={() => navigate('/plan')}
                className="relative rounded-3xl overflow-hidden group focus:outline-none focus:ring-4 focus:ring-coral/30 hover:-translate-y-1 transition-all duration-300"
                style={{ aspectRatio: '3/4' }}
              >
                <div className="absolute inset-0" style={{ background: d.gradient }} />
                <div className="absolute inset-0" style={DOT_PATTERN} />
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 gap-2">
                  <span className="text-5xl filter drop-shadow-lg">{d.emoji}</span>
                  <p className="text-white font-black text-2xl leading-tight drop-shadow-md">{d.name}</p>
                  <p className="text-white/75 text-sm font-medium">{d.tag}</p>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap">
                  Explore →
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT NOMADIS DOES ─────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
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
      <section className="py-20 bg-white overflow-hidden">
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
