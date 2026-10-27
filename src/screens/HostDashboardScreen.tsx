import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Navigation,
  ArrowRight,
  TrendingUp,
  Settings,
  AlertCircle,
  DollarSign,
  User,
  KeyRound,
  ShieldCheck,
  Power,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatCurrency, formatDistance } from '../utils/rescueLogic';
import { Modal } from '../components/common/Modal';

export const HostDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    hostProfile,
    toggleHostAvailability,
    requests,
    respondRequest,
    transitionRequestStatus,
  } = useApp();

  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [serviceFee, setServiceFee] = useState<number>(hostProfile.serviceFee || 3.0);

  const pendingRequests = requests.filter((r) => r.status === 'requested');
  const pastRequests = requests.filter((r) => r.status !== 'requested');

  return (
    <div className="flex-1 flex flex-col bg-bg text-ink min-h-screen">
      <Header title="Host Rescue Dashboard" />

      <div className="flex-1 px-4 sm:px-6 pt-3 pb-24 space-y-4">
        {/* Host Profile & Master Availability Switch (H1) */}
        <div className="bg-surface rounded-card p-4 sm:p-5 border border-surface-border shadow-card space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                  alt={hostProfile.name}
                  className="w-13 h-13 rounded-2xl object-cover border border-surface-border"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary text-bg rounded-full flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-ink text-sm sm:text-base">{hostProfile.name}</h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-primary-subtle text-primary text-[10px] font-bold border border-primary/20">
                    Verified Host
                  </span>
                </div>
                <p className="text-xs text-ink-muted">
                  ★ {hostProfile.ratingAvg} · {hostProfile.areaLabel}
                </p>
                <p className="text-[10px] text-ink-subtle truncate max-w-[200px]">
                  {hostProfile.phone} · {hostProfile.email}
                </p>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                Emergency Bay
              </span>
              <button
                onClick={toggleHostAvailability}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  hostProfile.availableNow ? 'bg-primary' : 'bg-surface-card border-surface-border'
                }`}
                role="switch"
                aria-checked={hostProfile.availableNow}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-bg shadow-md transition duration-200 ease-in-out ${
                    hostProfile.availableNow ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span
                className={`text-[10px] font-bold mt-1 ${
                  hostProfile.availableNow ? 'text-primary' : 'text-ink-muted'
                }`}
              >
                {hostProfile.availableNow ? 'Accepting SOS' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Charger Hardware Specs Card */}
          <div className="p-3 bg-surface-card rounded-xl border border-surface-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-primary">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="font-bold text-ink">{hostProfile.chargerModel}</p>
                <p className="text-[11px] text-ink-muted">
                  Tariff: {formatCurrency(hostProfile.energyPrice)} + Fee: {formatCurrency(hostProfile.serviceFee)} = {formatCurrency(hostProfile.energyPrice + hostProfile.serviceFee)}/kWh
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-1.5 rounded-lg bg-surface border border-surface-border text-ink-muted hover:text-ink transition"
              title="Edit Charger Pricing"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Earnings & Rescue Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-surface rounded-card p-3 border border-surface-border shadow-card">
            <span className="text-[10px] font-bold text-ink-muted uppercase">Today's Payout</span>
            <span className="text-xl font-black text-primary block mt-0.5">
              {formatCurrency(hostProfile.earningsToday)}
            </span>
            <span className="text-[10px] text-ink-muted">2 sessions</span>
          </div>

          <div className="bg-surface rounded-card p-3 border border-surface-border shadow-card">
            <span className="text-[10px] font-bold text-ink-muted uppercase">Rescues</span>
            <span className="text-xl font-black text-ink block mt-0.5">
              {hostProfile.acceptedCount}
            </span>
            <span className="text-[10px] text-primary font-bold">35 total</span>
          </div>

          <div className="bg-surface rounded-card p-3 border border-surface-border shadow-card">
            <span className="text-[10px] font-bold text-ink-muted uppercase">Declined</span>
            <span className="text-xl font-black text-sos block mt-0.5">
              {hostProfile.declinedCount}
            </span>
            <span className="text-[10px] text-ink-muted font-medium">3 total</span>
          </div>
        </div>

        {/* Incoming Rescue Requests Section (H2 Alert) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <span>Incoming SOS Dispatch</span>
              {pendingRequests.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-sos animate-ping" />
              )}
            </h3>
            <span className="text-[11px] text-ink-muted">2:00 auto-expire timer</span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-surface rounded-card p-5 border border-surface-border text-center text-xs text-ink-muted">
              No pending rescue requests right now. Your bay is visible on the driver map.
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-surface rounded-card p-4 border-2 border-warning/50 bg-warning/5 shadow-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.driverAvatar}
                      alt={req.driverName}
                      className="w-11 h-11 rounded-xl object-cover border border-surface-border"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-ink text-sm">{req.driverName}</h4>
                        <span className="px-1.5 py-0.2 bg-sos/20 text-sos text-[10px] font-extrabold rounded">
                          {req.batteryPct}% SOS
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted">
                        {req.vehicleModel} · {req.connector}
                      </p>
                      <p className="text-[10px] text-ink-muted">
                        Phone: {req.driverPhone} · {req.driverAddress}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-warning block">Expires in</span>
                    <span className="text-xs font-black text-warning font-mono">01:42</span>
                  </div>
                </div>

                {req.userNote && (
                  <p className="p-2.5 rounded-lg bg-surface-card border border-surface-border text-xs text-ink/90 italic">
                    "{req.userNote}"
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-surface-card p-2 rounded-xl border border-surface-border">
                  <div>
                    <span className="text-[9px] text-ink-muted font-bold block uppercase">Distance</span>
                    <span className="font-extrabold text-ink">1.2 km</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-muted font-bold block uppercase">Requested</span>
                    <span className="font-extrabold text-primary">{req.kwhNeeded} kWh</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-muted font-bold block uppercase">You Earn</span>
                    <span className="font-extrabold text-primary">{formatCurrency(req.estTotal)}</span>
                  </div>
                </div>

                {/* Working Accept & Decline Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      respondRequest(req.id, true);
                      navigate('/status');
                    }}
                    className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover active:scale-95 text-bg font-black text-xs uppercase tracking-wider transition shadow-glow-primary flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Rescue</span>
                  </button>

                  <button
                    onClick={() => respondRequest(req.id, false, 'Host busy')}
                    className="px-4 py-3 rounded-xl bg-surface-card hover:bg-sos/20 border border-surface-border text-ink-muted hover:text-sos font-bold text-xs transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Active / Completed Sessions */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            All Rescue Sessions
          </h3>

          {pastRequests.map((r) => (
            <div
              key={r.id}
              className="bg-surface rounded-card p-3.5 border border-surface-border flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={r.driverAvatar}
                  alt={r.driverName}
                  className="w-10 h-10 rounded-xl object-cover border border-surface-border"
                />
                <div>
                  <h4 className="font-bold text-ink">{r.driverName}</h4>
                  <p className="text-[11px] text-ink-muted">
                    {r.vehicleModel} · {r.createdAt}
                  </p>
                  <p className="text-[10px] text-primary font-bold">
                    PIN Code: {r.checkinCode}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <StatusBadge status={r.status} />
                <button
                  onClick={() => navigate('/status')}
                  className="text-[10px] font-bold text-primary hover:underline block"
                >
                  Manage Session &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Charger Pricing Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Host Charger Settings"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-ink-muted font-bold block uppercase mb-1">
              Host Service Fee (₹/kWh, Capped at ₹4 max)
            </label>
            <input
              type="number"
              min="0"
              max="4"
              step="0.5"
              value={serviceFee}
              onChange={(e) => setServiceFee(Number(e.target.value))}
              className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-ink font-bold"
            />
            <p className="text-[11px] text-primary mt-1 font-semibold">
              Legal compliance: AC service fee ceiling is ₹4/kWh outside solar hours.
            </p>
          </div>

          <button
            onClick={() => {
              setShowConfigModal(false);
              alert('Host rates updated successfully.');
            }}
            className="w-full bg-primary text-bg font-black py-3 rounded-xl text-xs uppercase"
          >
            Save Rates
          </button>
        </div>
      </Modal>
    </div>
  );
};
