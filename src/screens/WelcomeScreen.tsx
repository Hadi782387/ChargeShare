import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck, BatteryCharging, Sparkles } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-bg flex flex-col justify-between px-6 py-10 max-w-md mx-auto relative overflow-hidden">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary-subtle rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-mint-light rounded-full blur-3xl -ml-20 pointer-events-none" />

      {/* Top Brand Logo */}
      <div className="relative z-10 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-glow-primary">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-ink tracking-tight block leading-none">
              ChargeShare
            </span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Rescue Network
            </span>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-ink-muted bg-surface px-2.5 py-1 rounded-full border border-surface-border shadow-soft">
          Simulated Prototype
        </span>
      </div>

      {/* Center Hero Illustration */}
      <div className="relative z-10 my-auto py-8 flex flex-col items-center justify-center text-center">
        <div className="relative w-64 h-64 flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-subtle via-white to-mint-light border border-surface-border shadow-card flex items-center justify-center" />

          {/* Clean Vector EV Charging Illustration */}
          <svg
            viewBox="0 0 240 200"
            className="w-full h-full drop-shadow-md relative z-10 p-2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground line */}
            <path
              d="M20 170 H220"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />

            {/* EV Car */}
            <g transform="translate(20, 75)">
              <ellipse cx="65" cy="85" rx="55" ry="6" fill="#0F172A" fillOpacity="0.06" />
              <path
                d="M10 55 C10 40 25 35 45 35 L75 35 C95 35 105 45 115 55 L125 58 C130 58 135 62 135 68 L135 78 C135 80 133 82 130 82 L10 82 C5 82 0 78 0 72 L0 65 C0 60 5 55 10 55 Z"
                fill="#4F46E5"
              />
              <path
                d="M35 35 L50 12 C53 8 58 6 63 6 L90 6 C96 6 101 9 104 14 L115 35 Z"
                fill="#3730A3"
              />
              <path d="M40 33 L52 14 C54 11 57 10 60 10 L73 10 L73 33 Z" fill="#EEF2FF" fillOpacity="0.8" />
              <path d="M77 10 L89 10 C93 10 96 12 98 15 L108 33 L77 33 Z" fill="#EEF2FF" fillOpacity="0.8" />
              <rect x="0" y="62" width="6" height="8" rx="3" fill="#EF4444" />
              <rect x="130" y="64" width="6" height="8" rx="3" fill="#10B981" />
              <circle cx="35" cy="82" r="14" fill="#0F172A" />
              <circle cx="35" cy="82" r="6" fill="#FFFFFF" />
              <circle cx="105" cy="82" r="14" fill="#0F172A" />
              <circle cx="105" cy="82" r="6" fill="#FFFFFF" />
            </g>

            {/* Pedestal */}
            <g transform="translate(170, 50)">
              <rect x="5" y="105" width="30" height="10" rx="3" fill="#0F172A" />
              <rect x="10" y="25" width="20" height="85" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
              <rect x="14" y="35" width="12" height="18" rx="2" fill="#0F172A" />
              <circle cx="20" cy="65" r="3" fill="#10B981" />
              <circle cx="20" cy="85" r="6" fill="#4F46E5" />
              <path d="M20 81 L18 85 H21 L20 89" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M10 70 C-5 70 -15 100 -30 80"
                stroke="#4F46E5"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </svg>
        </div>

        <div className="space-y-2 max-w-xs mx-auto">
          <h2 className="text-2xl font-black text-ink leading-tight">
            Your next charge is closer than you think.
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Neighborhood private EV charger sharing and emergency roadside rescue when public stations are occupied or out of reach.
          </p>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="relative z-10 space-y-3 pt-4">
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-card shadow-glow-primary flex items-center justify-center gap-2 text-sm transition"
        >
          <span>Log In</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/signup')}
          className="w-full bg-surface hover:bg-surface-light active:scale-[0.98] text-ink border border-surface-border font-bold py-3.5 px-6 rounded-card shadow-soft flex items-center justify-center gap-2 text-sm transition"
        >
          <span>Sign Up</span>
        </button>

        <div className="text-center pt-2">
          <p className="text-[11px] text-ink-muted flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-mint" />
            <span>Simulated Frontend Demo · Zero real payments</span>
          </p>
        </div>
      </div>
    </div>
  );
};
