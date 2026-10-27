import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Navigation,
  Zap,
  Phone,
  MessageSquare,
  Share2,
  Play,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  QrCode,
  DollarSign,
  AlertCircle,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatCurrency, formatDistance } from '../utils/rescueLogic';
import { RequestStatus } from '../types';
import { Modal } from '../components/common/Modal';

export const RequestStatusScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeRequest,
    advanceActiveStatus,
    transitionRequestStatus,
    payRequest,
    currentRole,
    driverProfile,
  } = useApp();

  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const req = activeRequest;

  if (!req) {
    return (
      <div className="flex-1 flex flex-col bg-bg text-ink min-h-screen">
        <Header showBack title="Rescue Tracking" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-surface-card border border-surface-border text-ink-muted flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-ink">No Active Rescue Session</h3>
          <p className="text-xs text-ink-muted max-w-xs">
            There is currently no ongoing emergency rescue request. Create one from the Home dashboard.
          </p>
          <button
            onClick={() => navigate('/request')}
            className="px-5 py-3 bg-primary text-bg font-extrabold text-xs rounded-xl shadow-glow-primary uppercase tracking-wider"
          >
            Create Emergency SOS
          </button>
        </div>
      </div>
    );
  }

  const steps: { key: RequestStatus; label: string; desc: string; icon: any }[] = [
    { key: 'requested', label: '1. Requested', desc: 'Dispatched to verified host', icon: Clock },
    { key: 'accepted', label: '2. Accepted', desc: 'Host reserved bay, address unlocked', icon: CheckCircle2 },
    { key: 'on_the_way', label: '3. On The Way', desc: 'Driver en route to destination', icon: Navigation },
    { key: 'arrived', label: '4. Arrived', desc: 'Checkin PIN verified at gate', icon: QrCode },
    { key: 'charging', label: '5. Charging Live', desc: 'Active top-up in progress (max 10 kWh)', icon: Zap },
    { key: 'completed', label: '6. Completed', desc: 'Session ended, ready for UPI settlement', icon: ShieldCheck },
  ];

  const currentIdx = steps.findIndex((s) => s.key === req.status);
  const isAddressUnlocked = req.status !== 'requested';

  const handleWhatsAppShare = () => {
    const text = `I am on my way to emergency charge at ${req.hostName}'s bay. Live rescue status: https://chargeshare.app/rescue/${req.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col bg-bg text-ink min-h-screen">
      <Header showBack title="Live Rescue Tracking" />

      <div className="flex-1 px-4 sm:px-6 pt-3 pb-24 space-y-3.5">
        {/* Step Status Reviewer Demo Bar */}
        <div className="bg-surface rounded-card p-3 border border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-bold text-ink">
              State: <span className="text-primary uppercase">{req.status}</span>
            </span>
          </div>
          <button
            onClick={advanceActiveStatus}
            className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-bg font-black text-xs flex items-center gap-1.5 transition shadow-glow-primary uppercase"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Next Phase Step</span>
          </button>
        </div>

        {/* Status Hero Card */}
        <div className="p-4 rounded-card bg-surface border border-surface-border shadow-card relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider">
              {req.status === 'completed'
                ? 'Rescue Complete'
                : req.status === 'charging'
                ? 'Charging Active'
                : 'Host Confirmed'}
            </span>
            <span className="text-xs text-ink-muted">PIN: <strong className="text-primary font-mono">{req.checkinCode}</strong></span>
          </div>

          <h3 className="text-lg font-black text-ink">
            {req.status === 'completed'
              ? 'Emergency Rescue Finished!'
              : req.status === 'charging'
              ? 'Recharging at 7.2 kW Wallbox'
              : `${req.hostName} is waiting for you`}
          </h3>

          {/* Unlocked Address Notice */}
          <div className="p-2.5 rounded-xl bg-surface-card border border-surface-border text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ink block">
                  {isAddressUnlocked ? req.hostAddressText : 'Address hidden until host accepts'}
                </span>
                <span className="text-[11px] text-ink-muted">
                  Gate Security code: <strong className="text-primary">{req.checkinCode}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Charging Meter (B10) */}
        {req.status === 'charging' && (
          <div className="bg-surface rounded-card p-4 border-2 border-primary/50 bg-primary/5 shadow-glow-primary text-center space-y-3">
            <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
              Live Session Energy Delivered
            </span>
            <div className="flex justify-center items-baseline gap-2">
              <span className="text-4xl font-black text-primary font-mono">
                {req.kwhDelivered || 4.2}
              </span>
              <span className="text-sm text-ink-muted font-bold">/ 10 kWh max</span>
            </div>
            <div className="w-full bg-surface-card h-2.5 rounded-full overflow-hidden border border-surface-border">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${((req.kwhDelivered || 4.2) / 10) * 100}%` }}
              />
            </div>
            <button
              onClick={() => transitionRequestStatus(req.id, 'completed')}
              className="w-full py-2.5 bg-sos hover:bg-sos-hover text-white font-extrabold rounded-xl text-xs uppercase"
            >
              Stop Charging Session
            </button>
          </div>
        )}

        {/* Completed Session Payment CTA (C1, C2) */}
        {req.status === 'completed' && (
          <div className="bg-surface rounded-card p-4 border border-primary text-center space-y-3 shadow-card">
            <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary border border-primary/30 flex items-center justify-center mx-auto">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-ink text-sm">Session Complete: 8.5 kWh Delivered</h4>
              <p className="text-xs text-ink-muted mt-0.5">
                Total payable amount: <strong className="text-primary">{formatCurrency(req.estTotal)}</strong>
              </p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3 bg-primary text-bg font-black rounded-xl text-xs uppercase tracking-wider shadow-glow-primary"
            >
              Pay {formatCurrency(req.estTotal)} via Mock UPI
            </button>
          </div>
        )}

        {/* Host Contact & Action Buttons */}
        <div className="bg-surface rounded-card p-3.5 border border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={req.hostAvatar}
              alt={req.hostName}
              className="w-11 h-11 rounded-xl object-cover border border-surface-border"
            />
            <div>
              <h4 className="font-bold text-ink text-xs">{req.hostName}</h4>
              <p className="text-[10px] text-ink-muted">Host Phone: {req.hostPhone}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${req.hostPhone}`}
              className="w-9 h-9 rounded-xl bg-surface-card border border-surface-border hover:border-primary flex items-center justify-center text-ink transition"
              title="Call Host"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => navigate('/chat')}
              className="w-9 h-9 rounded-xl bg-primary text-bg flex items-center justify-center transition shadow-glow-primary"
              title="Chat with Host"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="w-9 h-9 rounded-xl bg-surface-card border border-surface-border hover:border-primary flex items-center justify-center text-primary transition"
              title="Share Live Status on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Turn Guidance & Google Maps Deep Link */}
        <div className="bg-surface rounded-card p-4 border border-surface-border space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-primary" />
              <span>Turn Guidance</span>
            </span>
            <span className="text-ink-muted text-[11px]">ETA 4 min · 0.9 km</span>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.hostAddressText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-surface-card hover:bg-surface-light border border-surface-border text-ink font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            <span>Open in Google Maps Navigation</span>
            <ExternalLink className="w-4 h-4 text-primary" />
          </a>
        </div>

        {/* Vertical Progress Timeline */}
        <div className="bg-surface rounded-card p-4 border border-surface-border space-y-3">
          <h4 className="font-bold text-ink text-xs uppercase tracking-wider">
            Rescue Workflow Progress
          </h4>

          <div className="space-y-3">
            {steps.map((st, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const Icon = st.icon;

              return (
                <div key={st.key} className="flex items-start gap-3 relative">
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-7 w-0.5 h-8 -ml-[1px] ${
                        isPast ? 'bg-primary' : 'bg-surface-border'
                      }`}
                    />
                  )}

                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 z-10 text-xs ${
                      isPast
                        ? 'bg-primary text-bg font-bold'
                        : isCurrent
                        ? 'bg-primary text-bg font-bold ring-2 ring-primary/30 shadow-glow-primary'
                        : 'bg-surface-card border border-surface-border text-ink-subtle'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 pt-0.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${isCurrent ? 'text-primary' : isPast ? 'text-ink' : 'text-ink-muted'}`}>
                        {st.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-primary font-extrabold uppercase animate-pulse">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-ink-muted mt-0.5">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mock UPI Payment Modal (C2) */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Mock UPI Escrow Settlement"
      >
        <div className="space-y-3.5 text-xs text-center py-2">
          <div className="p-3 bg-surface-card rounded-xl border border-surface-border">
            <span className="text-ink-muted block text-[10px] uppercase">Final Payable Amount</span>
            <span className="text-2xl font-black text-primary mt-1 block">
              {formatCurrency(req.estTotal)}
            </span>
            <span className="text-[10px] text-ink-muted">Includes Energy + Capped Host Fee + 10% Platform Fee</span>
          </div>

          <p className="text-ink-muted text-left">
            Choose demo UPI application to simulate settlement:
          </p>

          <div className="grid grid-cols-3 gap-2">
            {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
              <button
                key={app}
                onClick={() => {
                  payRequest(req.id);
                  setShowPaymentModal(false);
                  alert(`Payment of ${formatCurrency(req.estTotal)} successful via ${app}!`);
                }}
                className="p-3 rounded-xl bg-surface-card border border-surface-border hover:border-primary text-ink font-bold text-xs transition"
              >
                {app}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
