import { useEffect, useState } from 'react'
import Splash from './screens/Splash'
import Home from './screens/Home'
import Request from './screens/Request'
import Results from './screens/Results'
import { DEFAULT_ME, DEFAULT_VEHICLE } from './data/hosts'

export default function App() {
  const [screen, setScreen] = useState('splash') // splash | home | request | results
  const [battery, setBattery] = useState(18)
  const [vehicle, setVehicle] = useState(DEFAULT_VEHICLE)
  const [connector, setConnector] = useState('CCS2')
  const [me, setMe] = useState(DEFAULT_ME)
  const [picked, setPicked] = useState(null)

  // Real GPS if allowed (needs HTTPS), else fall back to the demo location.
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setMe({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {}
    )
  }, [])

  const tabs = [['home', 'Home'], ['request', 'SOS'], ['results', 'Map']]

  return (
    <div className="max-w-md mx-auto min-h-screen relative pb-20">
      {screen === 'splash' && <Splash onStart={() => setScreen('home')} onHost={() => alert('Host flow comes next')} />}
      {screen === 'home' && <Home battery={battery} setBattery={setBattery} onSOS={() => setScreen('request')} onMap={() => setScreen('results')} />}
      {screen === 'request' && <Request {...{ battery, setBattery, vehicle, setVehicle, connector, setConnector }} onSend={() => setScreen('results')} />}
      {screen === 'results' && <Results {...{ me, battery, vehicle, connector }} onRequest={(h) => { setPicked(h); alert(`Request sent to ${h.name}. Status screen is next.`) }} />}

      {screen !== 'splash' && (
        <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white border-t border-lav flex z-[1000]">
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setScreen(id)}
              className={`flex-1 py-4 text-sm font-semibold ${screen === id ? 'text-indigo' : 'text-muted'}`}>{label}</button>
          ))}
        </nav>
      )}
    </div>
  )
}
