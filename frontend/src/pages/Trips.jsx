import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getTrips } from '../api/nomadis'

const DEST_EMOJI = {
  Paris: '🗼', Tokyo: '⛩️', 'New York': '🗽', Barcelona: '🏖️', Rome: '🏛️',
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-500'
  return <span className={`text-xl font-bold ${color}`}>{score}%</span>
}

export default function Trips() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .catch(() => setError('Could not load trips. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const handleView = (trip) => {
    localStorage.setItem('currentTrip', JSON.stringify(trip))
    navigate('/itinerary', { state: { trip } })
  }

  // Aggregate avg match score per destination for bar chart
  const barData = Object.entries(
    trips.reduce((acc, t) => {
      if (!acc[t.destination]) acc[t.destination] = []
      acc[t.destination].push(t.avg_match_score || 0)
      return acc
    }, {})
  ).map(([destination, scores]) => ({
    destination,
    avgMatch: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }))

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Your Adventures</h1>
            <p className="text-gray-500 mt-1">
              {loading ? '…' : `${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`}
            </p>
          </div>
          <button
            onClick={() => navigate('/plan')}
            className="bg-coral text-white px-6 py-3 rounded-xl font-semibold hover:bg-coral-dark transition-colors shadow-md shadow-coral/20"
          >
            + New Trip
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-5xl mb-4 animate-spin block">🌍</span>
            <p>Loading your adventures…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600">{error}</div>
        )}

        {/* Empty state */}
        {!loading && !error && trips.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🧳</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No trips yet</h2>
            <p className="text-gray-500 mb-8">Start planning your first adventure!</p>
            <button
              onClick={() => navigate('/plan')}
              className="bg-coral text-white px-8 py-3 rounded-xl font-semibold hover:bg-coral-dark transition-colors"
            >
              Plan a Trip
            </button>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <>
            {/* Bar chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="font-bold text-gray-900 mb-5">⭐ Avg Match Score by Destination</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} barSize={42} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="destination"
                    tick={{ fontSize: 13, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, 'Avg Match']}
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13 }}
                  />
                  <Bar dataKey="avgMatch" radius={[8, 8, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? '#FF6B6B' : '#4ECDC4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Trip cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => handleView(trip)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{DEST_EMOJI[trip.destination] || '📍'}</span>
                    <ScoreBadge score={trip.avg_match_score || 0} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-coral transition-colors mb-2">
                    {trip.destination}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                      📅 {trip.trip_length_days} {trip.trip_length_days === 1 ? 'day' : 'days'}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full capitalize">
                      💼 {trip.budget_range}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(trip.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                  <p className="text-coral text-sm font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    View itinerary →
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
