import React from 'react';
import { ChargerHost } from '../../types';
import { Star, ShieldCheck, Zap, Navigation, Clock, Gauge, Compass } from 'lucide-react';
import { AvailabilityBadge } from './AvailabilityBadge';
import { formatCurrency, formatDistance } from '../../utils/rescueLogic';

interface ChargerCardProps {
  charger: ChargerHost;
  onRequest?: (charger: ChargerHost) => void;
  onSelect?: (charger: ChargerHost) => void;
  selected?: boolean;
}

export const ChargerCard: React.FC<ChargerCardProps> = ({
  charger,
  onRequest,
  onSelect,
  selected = false,
}) => {
  const isActionable =
    (charger.reachabilityStatus === 'reachable' || charger.reachabilityStatus === 'tight') &&
    charger.match &&
    charger.status === 'active';

  const totalRate = charger.energyPrice + Math.min(charger.serviceFee, 4);

  return (
    <div
      onClick={() => onSelect?.(charger)}
      className={`bg-surface rounded-card p-4 border transition-all duration-200 cursor-pointer shadow-card ${
        selected
          ? 'border-primary ring-2 ring-primary/20 bg-surface-card'
          : 'border-surface-border hover:border-surface-light bg-surface'
      } ${!isActionable ? 'opacity-75' : ''}`}
    >
      {/* Top row: Host & Availability status */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={charger.avatar}
              alt={charger.hostName}
              className="w-11 h-11 rounded-xl object-cover border border-surface-border"
            />
            {charger.verified && (
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary text-bg rounded-full flex items-center justify-center font-bold text-[9px]"
                title="Verified Host"
              >
                ✓
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-ink text-xs leading-snug">{charger.title}</h3>
            <p className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
              <span>{charger.hostName}</span>
              <span>·</span>
              <span className="capitalize px-1.5 py-0.2 bg-surface-card border border-surface-border rounded text-[10px] text-ink font-semibold">
                {charger.kind}
              </span>
              {charger.isHighway && (
                <span className="px-1.5 py-0.2 bg-warning-subtle text-warning border border-warning/30 rounded text-[10px] font-bold">
                  Highway Host
                </span>
              )}
            </p>
          </div>
        </div>

        <AvailabilityBadge
          status={charger.reachabilityStatus}
          availableNow={charger.status === 'active'}
        />
      </div>

      {/* Middle row: Specs */}
      <div className="grid grid-cols-4 gap-2 my-2.5 p-2 bg-surface-card rounded-xl border border-surface-border text-center">
        <div>
          <span className="text-[9px] font-bold text-ink-muted block uppercase">Road Dist</span>
          <span className="text-xs font-bold text-ink flex items-center justify-center gap-0.5 mt-0.5">
            <Navigation className="w-3 h-3 text-primary" />
            {formatDistance(charger.distanceKm)}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-ink-muted block uppercase">ETA</span>
          <span className="text-xs font-bold text-ink flex items-center justify-center gap-0.5 mt-0.5">
            <Clock className="w-3 h-3 text-warning" />
            {charger.etaMin || 5} min
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-ink-muted block uppercase">Power</span>
          <span className="text-xs font-bold text-primary flex items-center justify-center gap-0.5 mt-0.5">
            <Zap className="w-3 h-3 fill-current text-primary" />
            {charger.powerKw} kW
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-ink-muted block uppercase">Cost/kWh</span>
          <span className="text-xs font-bold text-ink block mt-0.5">
            {formatCurrency(totalRate)}
          </span>
        </div>
      </div>

      {/* Badges and Price line */}
      <div className="flex items-center justify-between text-xs text-ink-muted pt-2 border-t border-surface-border">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 font-bold text-ink text-[11px] bg-surface-card px-2 py-0.5 rounded-lg border border-surface-border">
            <Star className="w-3 h-3 fill-warning text-warning" />
            {charger.ratingAvg} ({charger.ratingCount})
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-surface-card border border-surface-border text-ink font-bold text-[11px]">
            {charger.connector}
          </span>
          {charger.evMetered && (
            <span className="px-1.5 py-0.5 bg-primary-subtle text-primary border border-primary/20 rounded text-[10px] font-bold">
              EV-metered
            </span>
          )}
        </div>

        {onRequest && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequest(charger);
            }}
            disabled={!isActionable}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              isActionable
                ? 'bg-primary text-bg hover:bg-primary-hover active:scale-95 shadow-glow-primary'
                : 'bg-surface-card text-ink-subtle border border-surface-border cursor-not-allowed'
            }`}
          >
            {isActionable
              ? 'Request SOS'
              : !charger.match
              ? 'Wrong Port'
              : 'Too Far'}
          </button>
        )}
      </div>
    </div>
  );
};
