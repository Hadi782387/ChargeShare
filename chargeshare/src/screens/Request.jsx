import { CONNECTORS } from '../data/hosts'

export default function Request({ battery, setBattery, vehicle, setVehicle, connector, setConnector, onSend }) {
  return (
    <div className="px-5 pt-8 pb-6 space-y-4">
      <h1 className="text-xl font-extrabold">Request charging help</h1>

      <div className="card">
        <p className="text-sm text-muted">Battery level</p>
        <p className="text-3xl font-extrabold">{battery}%</p>
        <input type="range" min="1" max="100" value={battery} onChange={(e) => setBattery(+e.target.value)} className="w-full accent-indigo" />
      </div>

      <div className="card">
        <p className="text-sm text-muted mb-2">Vehicle type</p>
        <div className="grid grid-cols-3 gap-2">
          {['Car', 'Bike', 'Scooter'].map((t) => (
            <button key={t} className={`chip ${vehicle.type === t ? 'on' : ''}`} onClick={() => setVehicle({ ...vehicle, type: t })}>{t}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="text-sm text-muted mb-2">Connector type</p>
        <div className="grid grid-cols-2 gap-2">
          {CONNECTORS.map((c) => (
            <button key={c} className={`chip ${connector === c ? 'on' : ''}`} onClick={() => setConnector(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="text-sm text-muted mb-2">Describe your emergency (optional)</p>
        <textarea rows="3" className="w-full rounded-xl border border-lav p-3 text-sm" placeholder="Nexon EV at 6% near Andheri station, need CCS2" />
        {/* TODO A1: send this text to /ai parse_sos and pre-fill the fields above */}
      </div>

      <button className="btn" onClick={onSend}>Send request</button>
    </div>
  )
}
