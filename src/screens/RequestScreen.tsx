import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Car,
  AlertTriangle,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  CreditCard,
} from 'lucide-react';
import { ConnectorType } from '../types';
import { calculateRemainingKm, calculateRescueCost, formatCurrency } from '../utils/rescueLogic';
import { Modal } from '../components/common/Modal';

export const RequestScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    battery,
    setBattery,
    selectedVehicle,
    selectedConnector,
    setSelectedConnector,
    selectedChargerForRequest,
    chargers,
    createRequest,
    isHighwayMode,
    driverProfile,
  } = useApp();

  const targetCharger = selectedChargerForRequest || chargers[0];

  const [kwhNeeded, setKwhNeeded] = useState<number>(8.5);
  const [agreeRules, setAgreeRules] = useState<boolean>(true);
  const [emergencyNote, setEmergencyNote] = useState<string>(
    'Critical low battery on Link Road. Need emergency 20 min top-up.'
  );
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const cost = calculateRescueCost(
    kwhNeeded,
    targetCharger.energyPrice,
    targetCharger.serviceFee
  );

  const remainingKm = calculateRemainingKm(
    battery,
    selectedVehicle.batteryKwh,
    selectedVehicle.kmPerKwh,
    isHighwayMode
  );

  const connectors: ConnectorType[] = ['Type2', 'CCS2', 'BharatAC001', 'Socket15A'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeRules) {
      alert('Please agree to house rules before dispatching emergency request.');
      return;
    }

    createRequest({
      charger: targetCharger,
      batteryPct: battery,
      connector: selectedConnector,
      kwhNeeded,
      userNote: emergencyNote,
    });

    setShowSuccessModal(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg text-ink min-h-screen">
      <Header showBack title="SOS Request Summary" />

      <form onSubmit={handleSubmit} className="flex-1 px-4 sm:px-6 pt-3 pb-24 space-y-3.5">
        {/* Destination Host Overview */}
        <div className="bg-surface rounded-card p-4 border border-surface-border shadow-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={targetCharger.avatar}
              alt={targetCharger.hostName}
              className="w-12 h-12 rounded-xl object-cover border border-surface-border"
            />
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Target Rescue Host
              </span>
              <h3 className="font-extrabold text-ink text-sm">{targetCharger.title}</h3>
              <p className="text-[11px] text-ink-muted">
                {targetCharger.hostName} · {targetCharger.areaLabel} ({targetCharger.powerKw} kW)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary bg-primary-subtle px-2.5 py-1 rounded-full border border-primary/20">
            {targetCharger.connector}
          </span>
        </div>

        {/* Battery & Range Status */}
        <div className="bg-surface rounded-card p-4 border border-surface-border shadow-card space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-ink-muted uppercase">
              Current Battery Level
            </span>
            <span className="text-xl font-black text-sos">{battery}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={battery}
            onChange={(e) => setBattery(Number(e.target.value))}
            className="w-full accent-primary h-2 bg-surface-card rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-ink-muted font-semibold">
            <span>Range remaining: {remainingKm.toFixed(1)} km</span>
            <span>Driver: {driverProfile.name}</span>
          </div>
        </div>

        {/* Capped kWh Needed Slider (Max 10 kWh limit per Phase 1 rule) */}
        <div className="bg-surface rounded-card p-4 border border-surface-border shadow-card space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[11px] font-bold text-ink-muted uppercase block">
                Energy Requested (Max 10 kWh Cap)
              </span>
              <p className="text-[10px] text-primary font-semibold">
                Emergency limit prevents domestic meter tripping
              </p>
            </div>
            <span className="text-xl font-black text-primary">{kwhNeeded} kWh</span>
          </div>

          <input
            type="range"
            min="2"
            max="10"
            step="0.5"
            value={kwhNeeded}
            onChange={(e) => setKwhNeeded(Number(e.target.value))}
            className="w-full accent-primary h-2 bg-surface-card rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-ink-muted">
            <span>Minimum: 2 kWh</span>
            <span className="text-warning font-bold">Hard Cap: 10 kWh (~50 km gain)</span>
          </div>
        </div>

        {/* Transparent Cost Breakdown Lines (Section 9/B5) */}
        <div className="bg-surface rounded-card p-4 border border-surface-border shadow-card space-y-2">
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-surface-border pb-1.5 flex items-center justify-between">
            <span>Cost Breakdown</span>
            <span className="text-[10px] text-primary lowercase font-semibold">no hidden fees</span>
          </h4>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-ink-muted">
              <span>Energy ({kwhNeeded} kWh × {formatCurrency(targetCharger.energyPrice)}):</span>
              <span className="font-bold text-ink">{formatCurrency(cost.energy)}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Host Service Fee ({kwhNeeded} kWh × {formatCurrency(targetCharger.serviceFee)}):</span>
              <span className="font-bold text-ink">{formatCurrency(cost.hostFee)}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Platform Fee (10%):</span>
              <span className="font-bold text-ink">{formatCurrency(cost.platformFee)}</span>
            </div>
            <div className="flex justify-between text-ink pt-2 border-t border-surface-border text-sm font-extrabold">
              <span>Total Estimated Payment:</span>
              <span className="text-primary text-base">{formatCurrency(cost.total)}</span>
            </div>
          </div>

          {/* Advice Sentence Placeholder (A3) */}
          <div className="p-2.5 rounded-xl bg-surface-card border border-surface-border text-[11px] text-primary flex items-start gap-2 mt-2">
            <Sparkles className="w-4 h-4 shrink-0 text-primary mt-0.5" />
            <span>
              <strong>Rescue Advice:</strong> About 25 minutes of charging will add ~{kwhNeeded} kWh (+{Math.round(kwhNeeded * selectedVehicle.kmPerKwh * 0.75)} km), safely reaching your destination.
            </span>
          </div>
        </div>

        {/* Mock UPI Method & Agreement Checkbox */}
        <div className="bg-surface rounded-card p-3.5 border border-surface-border space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted font-bold flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Payment Mode:</span>
            </span>
            <span className="font-bold text-ink bg-surface-card px-2.5 py-1 rounded-lg border border-surface-border">
              Mock UPI Escrow ({formatCurrency(cost.total)})
            </span>
          </div>

          <label className="flex items-start gap-2 pt-1.5 border-t border-surface-border cursor-pointer select-none text-[11px] text-ink-muted">
            <input
              type="checkbox"
              required
              checked={agreeRules}
              onChange={(e) => setAgreeRules(e.target.checked)}
              className="accent-primary mt-0.5"
            />
            <span>
              I agree to the host's house rules ({targetCharger.rules}). Exact building address will unlock upon host acceptance.
            </span>
          </label>
        </div>

        {/* Send Request Button */}
        <button
          type="submit"
          className="w-full bg-sos hover:bg-sos-hover active:scale-[0.98] text-white font-black py-4 px-6 rounded-card shadow-glow-sos flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition"
        >
          <Send className="w-4 h-4" />
          <span>Confirm & Broadcast SOS</span>
        </button>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="SOS Dispatched to Host"
      >
        <div className="text-center py-2 space-y-3.5">
          <div className="w-14 h-14 rounded-full bg-primary-subtle text-primary border border-primary/30 flex items-center justify-center mx-auto shadow-glow-primary">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h3 className="text-base font-extrabold text-ink">
            Rescue Request Sent to {targetCharger.hostName}
          </h3>

          <p className="text-xs text-ink-muted">
            The host has 2:00 minutes to accept. If unanswered, ChargeShare automatically tries the next best ranked host.
          </p>

          <button
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/status');
            }}
            className="w-full bg-primary text-bg font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-glow-primary"
          >
            Track Live Request Status
          </button>
        </div>
      </Modal>
    </div>
  );
};
