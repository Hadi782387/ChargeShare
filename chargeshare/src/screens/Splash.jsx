export default function Splash({ onStart, onHost }) {
  return (
    <div className="min-h-screen flex flex-col px-6 pt-20 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo text-white grid place-items-center text-2xl">⚡</div>
        <div><h1 className="text-3xl font-extrabold">ChargeShare</h1><p className="text-muted text-sm">EV Rescue Network</p></div>
      </div>
      <div className="flex-1 grid place-items-center text-7xl">🚗🔌</div>
      <h2 className="text-2xl font-extrabold">Stranded? Not alone.</h2>
      <p className="text-muted mt-2 mb-6">Find nearby charging help from the community.</p>
      <button className="btn" onClick={onStart}>Get started</button>
      <button className="mt-4 text-indigo font-semibold text-sm" onClick={onHost}>I'm a charging host</button>
    </div>
  )
}
