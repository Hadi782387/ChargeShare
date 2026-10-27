import { HOSTS } from '../data/hosts'

export default function Home({ battery, setBattery, onSOS, onMap }) {
  const low = battery <= 20
  return (
    <div className="px-5 pt-8 space-y-4">
      <div>
        <p className="text-muted text-sm">Mumbai, Maharashtra</p>
        <h1 className="text-2xl font-extrabold">Drive smart. Stay charged.</h1>
      </div>

      <div className="card">
        <div className="flex justify-between items-end">
          <div><p className="text-sm text-muted">Battery level</p><p className="text-4xl font-extrabold">{battery}%</p></div>
          <span className="text-4xl">🚗</span>
        </div>
        <input type="range" min="1" max="100" value={battery} onChange={(e) => setBattery(+e.target.value)}
          className="w-full mt-3 accent-indigo" aria-label="Battery level" />
      </div>

      <button onClick={onSOS}
        className={`w-full rounded-3xl py-8 text-white font-extrabold text-2xl shadow-lg active:scale-[.98] transition ${low ? 'bg-sos' : 'bg-indigo'}`}>
        {low ? 'SOS · Find a charger now' : 'Find charging help'}
        <span className="block text-sm font-semibold opacity-80 mt-1">Reachable hosts and public stations near you</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <div className="card"><p className="text-sm text-muted">Nearby hosts</p><p className="text-2xl font-extrabold">{HOSTS.filter((h) => h.kind !== 'public').length}</p></div>
        <div className="card"><p className="text-sm text-muted">Public stations</p><p className="text-2xl font-extrabold">{HOSTS.filter((h) => h.kind === 'public').length}</p></div>
      </div>
      <button className="chip w-full text-center" onClick={onMap}>Open map</button>
    </div>
  )
}
