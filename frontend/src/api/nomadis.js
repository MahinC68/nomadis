const BASE = '/api'

const req = (method, path, body) =>
  fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }).then((r) => {
    if (!r.ok) throw new Error(`API ${r.status}: ${r.statusText}`)
    return r.json()
  })

export const recommend = (payload) => req('POST', '/recommend/', payload)
export const generateItinerary = (payload) => req('POST', '/generate-itinerary/', payload)
export const getTrips = () => req('GET', '/trips/')
