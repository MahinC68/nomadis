import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { recommend, generateItinerary, getCities } from '../api/nomadis'

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

  const [cities, setCities] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  const [cityInput, setCityInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [days, setDays] = useState(3)
  const [loadingStep, setLoadingStep] = useState(-1)
  const [error, setError] = useState('')

  const dropdownRef = useRef(null)

  const storedPrefs = JSON.parse(localStorage.getItem('nomadisPrefs') || 'null')
  const hasPrefs = storedPrefs !== null
  const isLoading = loadingStep >= 0

  useEffect(() => {
    getCities()
      .then(setCities)
      .catch(() => {})
      .finally(() => setCitiesLoading(false))
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(cityInput.toLowerCase())
  )

  const isValidCity = cities.some(
    (c) => c.toLowerCase() === cityInput.toLowerCase()
  )

  const showNotAvailable =
    cityInput.trim().length > 0 && !citiesLoading && filteredCities.length === 0

  const handleGenerate = async () => {
    if (!cityInput.trim()) {
      setError('Please select a destination.')
      return
    }
    if (!isValidCity) {
      setError('That destination isn\'t in our database. Select one from the list.')
      return
    }
    if (!hasPrefs) {
      setError('Please set your preferences first.')
      return
    }
    setError('')

    const payload = {
      destination: cityInput.trim(),
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

      <div className="flex-1 max-w-xl mx-auto w-full px-6 pb-16 pt-28">
        <div className="text-center mb-12">
          <span className="text-5xl block mb-4">🗺️</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Where are you headed?</h1>
          <p className="text-gray-500">Matched to your travel style using your saved preferences.</p>
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
          {/* Destination combobox */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
            <div ref={dropdownRef} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search destinations…"
                  value={cityInput}
                  onChange={(e) => {
                    setCityInput(e.target.value)
                    setShowDropdown(true)
                    setError('')
                  }}
                  onFocus={() => setShowDropdown(true)}
                  disabled={isLoading}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coral transition-colors disabled:opacity-50"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none select-none">
                  ▾
                </span>
              </div>

              {showDropdown && (
                citiesLoading ? (
                  <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-2xl shadow-xl mt-1.5 px-4 py-3 text-sm text-gray-400">
                    Loading destinations…
                  </div>
                ) : filteredCities.length > 0 ? (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-2xl shadow-xl mt-1.5 max-h-60 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <li
                        key={city}
                        onClick={() => {
                          setCityInput(city)
                          setShowDropdown(false)
                          setError('')
                        }}
                        className={`px-4 py-2.5 cursor-pointer text-sm transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                          cityInput === city
                            ? 'bg-coral/10 text-coral font-semibold'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-coral'
                        }`}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                ) : showNotAvailable ? (
                  <div className="absolute z-20 w-full bg-white border border-amber-200 rounded-2xl shadow-xl mt-1.5 px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>That destination isn't available — try another city from the list.</span>
                  </div>
                ) : null
              )}
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
