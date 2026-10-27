import { MapContainer, TileLayer, CircleMarker, Circle, Tooltip } from 'react-leaflet'
import { rankHosts, remainingKm } from '../lib/rescue'
import { HOSTS } from '../data/hosts'

export default function Results({ me, battery, vehicle, connector, onRequest }) {
  const ranked = rankHosts(HOSTS, me, vehicle, battery, connector)
  const rangeKm = remainingKm(battery, vehicle.kwh, vehicle.kmPerKwh)
  const anyReachable = ranked.some((h) => h.reachable && h.match)

  return (
    <div>
      <div className="h-72">
        <MapContainer center={[me.lat, me.lng]} zoom={12} className="h-full w-full" zoomControl={false}>
          <TileLayer attribution="&copy; OpenStreetMap" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Circle center={[me.lat, me.lng]} radius={(rangeKm / 1.3) * 1000} pathOptions={{ color: '#4545D6', fillOpacity: 0.06 }} />
          <CircleMarker center={[me.lat, me.lng]} radius={9} pathOptions={{ color: '#fff', fillColor: '#4545D6', fillOpacity: 1, weight: 3 }} />
          {ranked.map((h) => (
            <CircleMarker key={h.id} center={[h.lat, h.lng]} radius={8}
              pathOptions={{ color: '#fff', weight: 2, fillOpacity: 1, fillColor: h.reachable && h.match ? '#2BB673' : '#B9B5C9' }}>
              <Tooltip>{h.name}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="px-5 pt-4 pb-6 space-y-3 -mt-4 relative z-[500] bg-lav rounded-t-3xl">
        <div className="flex justify-between items-baseline">
          <h2 className="font-extrabold">Nearby charging options</h2>
          <span className="text-xs text-muted">Range left ≈ {rangeKm.toFixed(0)} km</span>
        </div>

        {!anyReachable && (
          <div className="card bg-peach text-sm">No reachable host matches your connector. Try the nearest public station or call roadside help.</div>
        )}

        {ranked.map((h) => {
          const ok = h.reachable && h.match
          return (
            <div key={h.id} className={`card ${ok ? '' : 'opacity-60'}`}>
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-bold">{h.name} {h.verified && <span title="Verified">✅</span>}</p>
                  <p className="text-xs text-muted">{h.dist.toFixed(1)} km · {h.etaMin} min · {h.connector} · {h.kw} kW · ₹{h.price}/kWh · ★ {h.rating}</p>
                </div>
                <span className={`text-xs font-bold rounded-full px-2 py-1 h-fit whitespace-nowrap ${ok ? 'bg-mint text-green-800' : 'bg-peach text-ink'}`}>
                  {!h.match ? 'Wrong connector' : h.reachable ? 'Reachable' : 'Too far'}
                </span>
              </div>
              <button disabled={!ok} onClick={() => onRequest(h)}
                className="mt-3 w-full rounded-xl bg-indigo text-white font-semibold py-2 disabled:bg-muted/40">Request</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
