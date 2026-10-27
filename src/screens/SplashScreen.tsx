import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, ArrowRight, BatteryCharging, Sparkles, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentRole } = useApp();

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-between px-6 py-10 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-sos/10 rounded-full blur-3xl -ml-20 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary text-bg flex items-center justify-center shadow-glow-primary transform -rotate-3 hover:rotate-0 transition">
            <Zap className="w-7 h-7 fill-current text-bg" />
          </div>
          <div>
            <h1 className="text-xl font-black text-ink tracking-tight">
              ChargeShare Rescue
            </h1>
            <p className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
              <span>Phase 1 EV Rescue Network</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/auth')}
          className="px-2.5 py-1 bg-surface border border-surface-border hover:border-primary rounded-xl text-[10px] font-bold text-ink-muted hover:text-ink flex items-center gap-1 transition"
        >
          <KeyRound className="w-3 h-3 text-primary" />
          <span>Login</span>
        </button>
      </div>

      {/* Central Illustration matching document */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-surface-card border border-surface-border shadow-inner flex items-center justify-center" />

          {/* SVG Charging Scene */}
          <svg
            viewBox="0 0 240 200"
            className="w-full h-full drop-shadow-2xl relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground grid */}
            <path
              d="M20 170 H220"
              stroke="#233554"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />

            {/* EV Car */}
            <g transform="translate(20, 75)">
              <ellipse cx="65" cy="85" rx="55" ry="6" fill="#000000" fillOpacity="0.4" />
              <path
                d="M10 55 C10 40 25 35 45 35 L75 35 C95 35 105 45 115 55 L125 58 C130 58 135 62 135 68 L135 78 C135 80 133 82 130 82 L10 82 C5 82 0 78 0 72 L0 65 C0 60 5 55 10 55 Z"
                fill="#162238"
                stroke="#22E58B"
                strokeWidth="1.5"
              />
              <path
                d="M35 35 L50 12 C53 8 58 6 63 6 L90 6 C96 6 101 9 104 14 L115 35 Z"
                fill="#0B1220"
                stroke="#22E58B"
                strokeWidth="1.5"
              />
              <path d="M40 33 L52 14 C54 11 57 10 60 10 L73 10 L73 33 Z" fill="#22E58B" fillOpacity="0.25" />
              <path d="M77 10 L89 10 C93 10 96 12 98 15 L108 33 L77 33 Z" fill="#22E58B" fillOpacity="0.25" />
              <rect x="0" y="62" width="6" height="8" rx="3" fill="#FF4D4F" />
              <rect x="130" y="64" width="6" height="8" rx="3" fill="#22E58B" />
              <circle cx="35" cy="82" r="14" fill="#0B1220" stroke="#233554" strokeWidth="2" />
              <circle cx="35" cy="82" r="6" fill="#22E58B" />
              <circle cx="105" cy="82" r="14" fill="#0B1220" stroke="#233554" strokeWidth="2" />
              <circle cx="105" cy="82" r="6" fill="#22E58B" />
            </g>

            {/* Charging Pedestal */}
            <g transform="translate(170, 50)">
              <rect x="5" y="105" width="30" height="10" rx="3" fill="#162238" />
              <rect x="10" y="25" width="20" height="85" rx="6" fill="#121C2F" stroke="#22E58B" strokeWidth="2" />
              <rect x="14" y="35" width="12" height="18" rx="2" fill="#0B1220" />
              <circle cx="20" cy="65" r="3" fill="#22E58B" className="animate-ping" />
              <circle cx="20" cy="85" r="6" fill="#22E58B" />
              <path d="M20 81 L18 85 H21 L20 89" stroke="#0B1220" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M10 70 C-5 70 -15 100 -30 80"
                stroke="#22E58B"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </svg>
        </div>

        {/* Live Seed Indicator */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-surface-border text-xs font-semibold text-ink">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>18 Seed Chargers Active across Mumbai</span>
        </div>
      </div>

      {/* Bottom Text & Actions */}
      <div className="relative z-10 space-y-4">
        <div>
          <h2 className="text-3xl font-black text-ink leading-tight">
            Stranded? <br />
            <span className="text-primary">Not Alone.</span>
          </h2>
          <p className="text-xs text-ink-muted mt-2 leading-relaxed">
            "Other apps help you find a charger. ChargeShare rescues you when you are about to run out." Range-aware private charger sharing network.
          </p>
        </div>

        {/* Primary Get Started Button */}
        <button
          onClick={() => {
            setCurrentRole('driver');
            navigate('/home');
          }}
          className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-bg font-black py-4 px-6 rounded-card shadow-glow-primary flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition group"
        >
          <span>Get Started (Driver SOS)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary Host Link */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            onClick={() => {
              setCurrentRole('host');
              navigate('/host');
            }}
            className="font-bold text-primary hover:underline flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-surface-card transition"
          >
            <Shield className="w-4 h-4" />
            <span>I'm a Charging Host</span>
          </button>

          <button
            onClick={() => navigate('/auth')}
            className="text-ink-muted hover:text-ink font-semibold flex items-center gap-1"
          >
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            <span>Switch Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
};
