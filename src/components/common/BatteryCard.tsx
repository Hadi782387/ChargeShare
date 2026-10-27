import React from 'react';
import { BatteryCharging, Zap, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateRemainingKm } from '../../utils/rescueLogic';

export const BatteryCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { battery, setBattery, selectedVehicle, isHighwayMode } = useApp();

  const remainingKm = calculateRemainingKm(
    battery,
    selectedVehicle.batteryKwh,
    selectedVehicle.kmPerKwh,
    isHighwayMode
  );

  const isCritical = battery < 10;
  const isWarning = battery < 25;

  const statusColor = isCritical
    ? 'text-sos'
    : isWarning
    ? 'text-warning'
    : 'text-primary';

  const barColor = isCritical
    ? 'bg-sos'
    : isWarning
    ? 'bg-warning'
    : 'bg-primary';

  return (
    <div
      className={`bg-surface rounded-card p-5 border border-surface-border shadow-card relative overflow-hidden transition-all duration-300 ${
        isCritical ? 'ring-2 ring-sos/40' : ''
      }`}
    >
      {/* Background glow when in critical emergency */}
      {isCritical && (
        <div className="absolute top-0 right-0 w-36 h-36 bg-sos/15 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none animate-pulse" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Battery Level
            </span>
            {isCritical ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sos/20 text-sos border border-sos/30 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                <span>Stress SOS</span>
              </span>
            ) : isWarning ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/20 text-warning border border-warning/30">
                <span>Tight Range</span>
              </span>
            ) : null}
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-4xl font-black tracking-tight ${statusColor}`}>
              {battery}%
            </span>
            <span className="text-xs font-semibold text-ink-muted">
              ≈ {remainingKm.toFixed(1)} km range ({isHighwayMode ? '0.7x highway' : '0.8x city'})
            </span>
          </div>
        </div>

        {/* Vehicle Badge */}
        <div className="flex flex-col items-end">
          <div className="w-12 h-12 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center text-primary relative shadow-sm">
            <span className="text-2xl">🚙</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary text-bg flex items-center justify-center font-bold text-[9px]">
              ⚡
            </div>
          </div>
          <span className="text-[11px] font-bold text-ink mt-1 truncate max-w-[120px]">
            {selectedVehicle.model}
          </span>
        </div>
      </div>

      {/* Battery Visual Bar */}
      <div className="mt-4 relative z-10">
        <div className="w-full h-3 bg-surface-card rounded-full overflow-hidden p-0.5 border border-surface-border">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${Math.max(4, Math.min(100, battery))}%` }}
          />
        </div>

        {/* Interactive Slider & Presets */}
        <div className="mt-3">
          <div className="flex justify-between items-center text-[10px] text-ink-muted font-bold mb-1.5">
            <span>Drag slider to test reachability:</span>
            <div className="flex gap-1.5">
              {[5, 8, 18, 35, 60].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setBattery(preset)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition border ${
                    battery === preset
                      ? 'bg-primary text-bg border-primary'
                      : 'bg-surface-card text-ink-muted border-surface-border hover:text-ink'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={battery}
            onChange={(e) => setBattery(Number(e.target.value))}
            className="w-full accent-primary h-2 bg-surface-card rounded-lg cursor-pointer"
            aria-label="Adjust battery percentage"
          />
        </div>
      </div>
    </div>
  );
};
