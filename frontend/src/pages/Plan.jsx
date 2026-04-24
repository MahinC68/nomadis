import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { recommend, generateItinerary } from '../api/nomadis'

const CITIES = ['Paris', 'Tokyo', 'New York', 'Barcelona', 'Rome']

const LOADING_STEPS = [
  { icon: '🔍', label: 'Finding perfect matches...' },
  { icon: '✨', label: 'Crafting your itinerary...' },
  { icon: '🤖', label: 'Adding AI narration...' },
]

function LoadingStep({ step, index, current }) {
  const done = index < current
  const active = index === current
  return (
    <div className={`flex items-center gap-3 transition-opacity duration-300 ${index <= current ? 'opacity-100' : 'opacity-30'}`}>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
          done
            ? 'bg-green-100 text-green-600'
            : active
            ? 'bg-coral/10 text-coral animate-pulse'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        {done ? '✓' : step.icon}
      </div>
      <span
        className={`text-sm font-medium ${
          done ? 'text-green-600' : active ? 'text-coral' : 'text-gray-400'
        }`}
      >
        {step.label}
      </span>
    </div>
  )
}

export default function Plan() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(3)
  const [loadingStep, setLoadingStep] = useState(-1)
  const [error, setError] = useState('')

  const storedPrefs = JSON.parse(localStorage.getItem('nomadisPrefs') || 'null')
  const hasPrefs = storedPrefs !== null

  const isLoading = loadingStep >= 0

  const handleGenerate = async () => {
    if (!destination.trim()) { setError('Please enter or select a destination city.'); return }
    if (!hasPrefs) { setError('Please set your preferences first.'); return }
    setError('')

    const payload = {
      destination: destination.trim(),
      trip_length_days: days,
      adventure: storedPrefs.adventure ?? 0.5,
      culture: storedPrefs.culture ?? 0.5,
      relaxation: storedPrefs.relaxation ?? 0.5,
      nightlife: storedPrefs.nightlife ?? 0.5,
      nature: storedPrefs.nature ?? 0.5,
      food: storedPrefs.food ?? 0.5,
      budget_range: storedPrefs.budget_range ?? 'mid',
    }

    try {
      setLoadingStep(0)
      await recommend(payload)

      setLoadingStep(1)
      const trip = await generateItinerary(payload)

      setLoadingStep(2)
      await new Promise((r) => setTimeout(r, 700))

      localStorage.setItem('currentTrip', JSON.stringify(trip))
      navigate('/itinerary', { state: { trip } })
    } catch (e) {
      setError(e.message || 'Something went wrong. Make sure the backend is running on port 8000.')
      setLoadingStep(-1)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-5xl block mb-4">🗺️</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Where are you headed?</h1>
          <p className="text-gray-500">We'll find the best experiences for your travel style.</p>
        </div>

        {!hasPrefs && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="text-xl mt-0.5">💡</span>
            <p className="text-amber-800 text-sm">
              No preferences set yet.{' '}
              <button onClick={() => navigate('/onboarding')} className="font-bold underline hover:text-coral">
                Set them now
              </button>{' '}
              for personalised results.
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-7">
          {/* Destination input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination City</label>
            <input
              type="text"
              placeholder="e.g. Paris, Tokyo, New York…"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setError('') }}
              disabled={isLoading}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coral transition-colors disabled:opacity-50"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setDestination(c); setError('') }}
                  disabled={isLoading}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    destination === c
                      ? 'bg-coral text-white border-coral'
                      : 'border-gray-200 text-gray-500 hover:border-coral hover:text-coral'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Trip length slider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trip Length:{' '}
              <span className="text-coral font-bold">{days} {days === 1 ? 'day' : 'days'}</span>
            </label>
            <input
              type="range"
              min={1}
              max={14}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>1 day</span>
              <span>14 days</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Loading steps */}
          {isLoading && (
            <div className="space-y-3 py-2">
              {LOADING_STEPS.map((s, i) => (
                <LoadingStep key={i} step={s} index={i} current={loadingStep} />
              ))}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-coral text-white py-4 rounded-2xl text-lg font-bold hover:bg-coral-dark transition-all shadow-lg shadow-coral/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? 'Generating…' : 'Generate My Itinerary ✨'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
