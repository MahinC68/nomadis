import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SLIDERS = [
  { key: 'adventure', label: 'Adventure', emoji: '🧗', desc: 'Hiking, thrills, pushing your limits' },
  { key: 'culture', label: 'Culture', emoji: '🏛️', desc: 'Museums, history, local traditions' },
  { key: 'relaxation', label: 'Relaxation', emoji: '🧘', desc: 'Slow mornings, spas, calm vibes' },
  { key: 'nightlife', label: 'Nightlife', emoji: '🍸', desc: 'Bars, clubs, evening entertainment' },
  { key: 'nature', label: 'Nature', emoji: '🌿', desc: 'Parks, landscapes, the great outdoors' },
  { key: 'food', label: 'Food', emoji: '🍜', desc: 'Local cuisine, markets, fine dining' },
]

const BUDGET_OPTIONS = [
  { value: 'budget', label: 'Budget', emoji: '🎒', desc: 'Free attractions & street food' },
  { value: 'mid', label: 'Mid-range', emoji: '✈️', desc: 'Mix of paid & free experiences' },
  { value: 'luxury', label: 'Luxury', emoji: '💎', desc: 'Premium experiences, no compromises' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [prefs, setPrefs] = useState({
    adventure: 5, culture: 5, relaxation: 5, nightlife: 5, nature: 5, food: 5,
  })
  const [budget, setBudget] = useState('mid')

  const handleContinue = () => {
    const scaled = Object.fromEntries(
      Object.entries(prefs).map(([k, v]) => [k, parseFloat((v / 10).toFixed(1))])
    )
    localStorage.setItem('nomadisPrefs', JSON.stringify({ ...scaled, budget_range: budget }))
    navigate('/plan')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-5xl block mb-4">🧭</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Tell us how you travel</h1>
          <p className="text-gray-500 leading-relaxed">
            Slide each dial to match your travel personality. This powers your personalised ML matches.
          </p>
        </div>

        {/* Sliders */}
        <div className="space-y-4 mb-10">
          {SLIDERS.map(({ key, label, emoji, desc }) => (
            <div key={key} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </div>
                <span className="w-10 h-10 bg-coral/10 text-coral font-bold text-lg rounded-xl flex items-center justify-center flex-shrink-0">
                  {prefs[key]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={prefs[key]}
                onChange={(e) => setPrefs((p) => ({ ...p, [key]: Number(e.target.value) }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>Not for me</span>
                <span>Top priority</span>
              </div>
            </div>
          ))}
        </div>

        {/* Budget */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What's your budget style?</h2>
          <div className="grid grid-cols-3 gap-4">
            {BUDGET_OPTIONS.map(({ value, label, emoji, desc }) => (
              <button
                key={value}
                onClick={() => setBudget(value)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  budget === value
                    ? 'border-coral bg-coral/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-coral/40'
                }`}
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <p className={`font-bold text-sm mb-1 ${budget === value ? 'text-coral' : 'text-gray-900'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400 leading-snug">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-coral text-white py-4 rounded-2xl text-lg font-bold hover:bg-coral-dark transition-all shadow-lg shadow-coral/25 hover:-translate-y-0.5"
        >
          Continue to Plan →
        </button>
      </div>

      <Footer />
    </div>
  )
}
