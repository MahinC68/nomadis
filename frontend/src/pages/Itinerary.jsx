import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PREF_KEYS = ['adventure', 'culture', 'relaxation', 'nightlife', 'nature', 'food']
const PREF_LABELS = {
  adventure: 'Adventure', culture: 'Culture', relaxation: 'Relax',
  nightlife: 'Nightlife', nature: 'Nature', food: 'Food',
}
const PIE_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94', '#C7CEEA', '#B5EAD7']

function MatchBadge({ score }) {
  const cls =
    score >= 80 ? 'bg-green-100 text-green-700' :
    score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-600'
  return (
    <span className={`${cls} px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap`}>
      {score}% match
    </span>
  )
}

function ActivityCard({ act }) {
  const costLabel = act.avg_cost === 0 ? 'Free' : `$${act.avg_cost.toFixed(0)}`
  const envIcon = act.indoor_outdoor === 'indoor' ? '🏠' : act.indoor_outdoor === 'outdoor' ? '🌤️' : '🏠🌤️'
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-bold text-gray-900 leading-snug">{act.name}</h4>
        <MatchBadge score={act.match_score} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
        <span>🏷️ {act.category}</span>
        <span>⏱️ {act.duration_mins} min</span>
        <span>💰 {costLabel}</span>
        <span>{envIcon} {act.indoor_outdoor}</span>
      </div>
    </div>
  )
}

function DayAccordion({ day, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const acts = day.activities || []
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 bg-coral text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
            D{day.day}
          </span>
          <div className="text-left">
            <p className="font-bold text-gray-900">Day {day.day}</p>
            <p className="text-xs text-gray-400">{acts.length} activities</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-3 border-t border-gray-100 pt-4">
          {acts.map((act, i) => <ActivityCard key={i} act={act} />)}
        </div>
      )}
    </div>
  )
}

export default function Itinerary() {
  const navigate = useNavigate()
  const location = useLocation()
  const [trip, setTrip] = useState(null)
  const [showFull, setShowFull] = useState(false)

  useEffect(() => {
    const t = location.state?.trip ?? JSON.parse(localStorage.getItem('currentTrip') || 'null')
    if (!t) { navigate('/plan'); return }
    setTrip(t)
  }, [])

  if (!trip) return null

  const ij = trip.itinerary_json || {}
  const days = ij.days || []
  const narrative = ij.narrative || ''
  const allActs = days.flatMap((d) => d.activities || [])

  // Budget donut
  const budgetMap = {}
  allActs.forEach((a) => {
    if (a.avg_cost > 0) budgetMap[a.category] = (budgetMap[a.category] || 0) + a.avg_cost
  })
  const pieData = Object.entries(budgetMap).map(([name, value]) => ({ name, value: Math.round(value) }))

  // Radar
  const radarData = PREF_KEYS.map((k) => ({
    subject: PREF_LABELS[k],
    value: Math.round((trip[k] ?? 0) * 100),
    fullMark: 100,
  }))

  // Summary
  const totalCost = allActs.reduce((s, a) => s + (a.avg_cost || 0), 0)
  const totalMins = allActs.reduce((s, a) => s + (a.duration_mins || 0), 0)

  const PREVIEW_LEN = 450
  const narrativePreview = narrative.length > PREVIEW_LEN ? narrative.slice(0, PREVIEW_LEN) + '…' : narrative

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📍 {trip.destination}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                <span>📅 {trip.trip_length_days} {trip.trip_length_days === 1 ? 'day' : 'days'}</span>
                <span className="capitalize">💼 {trip.budget_range}</span>
                {trip.avg_match_score && (
                  <span className="text-green-600 font-semibold">⭐ {trip.avg_match_score}% avg match</span>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/trips')}
              className="border-2 border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl font-semibold hover:border-coral hover:text-coral transition-colors text-sm whitespace-nowrap"
            >
              View Past Trips →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            {narrative && (
              <div className="bg-gradient-to-br from-coral/5 to-ocean/5 border border-coral/20 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🤖</span> Your Personalised Narrative
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {showFull ? narrative : narrativePreview}
                </p>
                {narrative.length > PREVIEW_LEN && (
                  <button
                    onClick={() => setShowFull((s) => !s)}
                    className="text-coral text-sm font-semibold mt-3 hover:underline"
                  >
                    {showFull ? 'Show less' : 'Read full itinerary'}
                  </button>
                )}
              </div>
            )}

            <div className="space-y-3">
              {days.map((day, i) => (
                <DayAccordion key={day.day} day={day} defaultOpen={i === 0} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Budget donut */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">💰 Budget Breakdown</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`$${v}`, 'Est. cost']} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">🎉 All free activities!</p>
              )}
            </div>

            {/* Radar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">🎯 Your Travel Profile</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f0f0f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Radar
                    dataKey="value"
                    stroke="#FF6B6B"
                    fill="#FF6B6B"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">📊 Trip Summary</h3>
              <div className="space-y-2.5">
                {[
                  ['Total activities', allActs.length],
                  ['Est. total cost', `$${totalCost.toFixed(0)}`],
                  ['Total activity time', `${Math.round(totalMins / 60)}h`],
                  ['Avg match score', `${trip.avg_match_score ?? '—'}%`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/plan')}
              className="w-full bg-coral text-white py-3 rounded-xl font-semibold hover:bg-coral-dark transition-colors shadow-md shadow-coral/20"
            >
              Plan Another Trip
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
