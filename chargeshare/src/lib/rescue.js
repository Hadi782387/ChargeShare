// Rescue Score (A2): plain math, no LLM, explainable to judges.
export function haversineKm(a, b) {
  const R = 6371, rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng)
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

// remaining km = battery% x pack kWh x km/kWh x 0.8 safety factor
export const remainingKm = (pct, kwh, kmPerKwh) => (pct / 100) * kwh * kmPerKwh * 0.8

export function rankHosts(hosts, me, vehicle, batteryPct, connector) {
  const range = remainingKm(batteryPct, vehicle.kwh, vehicle.kmPerKwh)
  return hosts
    .map((h) => {
      const dist = haversineKm(me, h)
      const reachable = dist * 1.3 <= range // 1.3 = road factor
      const match = h.connector === connector
      const score =
        0.35 * (reachable ? 1 - Math.min(dist / Math.max(range, 0.1), 1) : 0) +
        0.2 * (match ? Math.min(h.kw / 50, 1) : 0) +
        0.2 * (h.rating / 5) +
        0.15 * (1 - Math.min(Math.max((h.price - 8) / 12, 0), 1)) +
        0.1 * h.response
      return { ...h, dist, reachable, match, score, etaMin: Math.round((dist * 1.3 / 25) * 60) }
    })
    .sort((a, b) => b.reachable - a.reachable || b.match - a.match || b.score - a.score)
}
