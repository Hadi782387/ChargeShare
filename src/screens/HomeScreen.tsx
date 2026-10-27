import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { BatteryCard } from '../components/common/BatteryCard';
import { useApp } from '../context/AppContext';
import {
  Zap,
  MapPin,
  Shield,
  QrCode,
  PhoneCall,
  Compass,
  ArrowRight,
  Sparkles,
  Car,
  ChevronRight,
  AlertTriangle,
  Mic,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { MOCK_VEHICLES } from '../data/mockData';
import { calculateRemainingKm } from '../utils/rescueLogic';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    battery,
    setBattery,
    selectedVehicle,
    setSelectedVehicle,
    selectedConnector,
    setSelectedConnector,
    chargers,
    driverProfile,
    isHighwayMode,
    setIsHighwayMode,
  } = useApp();

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showHelplineModal, setShowHelplineModal] = useState(false);
  const [emergencyText, setEmergencyText] = useState(
    'Nexon EV at 8% near Andheri station, need urgent Type 2 charge.'
  );
  const [isListening, setIsListening] = useState(false);

  const remainingKm = calculateRemainingKm(
    battery,
    selectedVehicle.batteryKwh,
    selectedVehicle.kmPerKwh,
    isHighwayMode
  );

  const nearbyHostsCount = chargers.filter((c) => !c.isHighway && c.status === 'active').length;
  const highwayHostsCount = chargers.filter((c) => c.isHighway).length;

  const isStressMode = battery < 10;
  const isWarningMode = battery < 25;

  // Web Speech API simulation for Mic button
  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setEmergencyText('Nexon EV, 8 percent, near Link Road, need Type 2 rescue');
      setIsListening(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg text-ink">
      <Header />

      <div className="flex-1 px-4 sm:px-6 pt-3 pb-24 space-y-4">
        {/* Trip Guard Highway Alert Banner (HW3) */}
        {isHighwayMode && (
          <div className="p-3 bg-warning-subtle border border-warning/40 rounded-xl text-warning text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 shrink-0" />
              <div>
                <strong className="block">Trip Guard Active (0.7x highway range)</strong>
                <span className="text-[11px] text-ink-muted">
                  Next highway charger at Khalapur (~48 km). Safe range: {remainingKm.toFixed(0)} km. Keep speed under 80 km/h.
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-xs font-bold text-warning underline shrink-0 ml-2"
            >
              Ladder
            </button>
          </div>
        )}

        {/* Personalized Driver Greeting & Credentials link */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">
              EV Driver Panel
            </p>
            <h2 className="text-lg font-black text-ink">
              Hello, {driverProfile.name.split(' ')[0]} 👋
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVehicleModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-surface-border hover:border-primary transition"
            >
              <Car className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-ink truncate max-w-[110px]">
                {selectedVehicle.model}
              </span>
              <ChevronRight className="w-3 h-3 text-ink-muted" />
            </button>
          </div>
        </div>

        {/* Battery Level Card */}
        <BatteryCard />

        {/* Big SOS Emergency Rescue Button (B1) */}
        <div className="relative group">
          {isStressMode && (
            <div className="absolute -inset-1 rounded-card bg-sos opacity-40 blur-lg group-hover:opacity-75 transition duration-500 animate-pulse" />
          )}

          <button
            onClick={() => navigate('/request')}
            className={`w-full rounded-card relative overflow-hidden transition-all duration-300 active:scale-[0.98] shadow-card text-left ${
              isStressMode
                ? 'bg-sos text-white py-7 px-5 shadow-glow-sos'
                : 'bg-surface border-2 border-primary/40 hover:border-primary text-ink py-6 px-5'
            }`}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="max-w-[240px]">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-warning" />
                  <span>{isStressMode ? 'Stress Emergency Mode' : 'Instant Rescue Loop'}</span>
                </div>

                <h3 className="text-2xl font-black tracking-tight leading-tight">
                  {isStressMode ? 'SOS · Find Charger Now' : 'Find Charging Help'}
                </h3>

                <p className="text-xs text-ink-muted mt-1 leading-snug">
                  {isStressMode
                    ? 'Battery critical (<10%). Priority dispatch to closest verified host.'
                    : `Ranked by range reachability (${remainingKm.toFixed(0)} km safe radius)`}
                </p>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  isStressMode ? 'bg-white text-sos' : 'bg-primary text-bg'
                }`}
              >
                <Zap className="w-8 h-8 fill-current" />
              </div>
            </div>
          </button>
        </div>

        {/* Voice & Emergency Text Box (A1 Natural-Language SOS) */}
        <div className="bg-surface rounded-card p-3.5 border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink-muted uppercase tracking-wider text-[10px]">
              Describe Your Emergency (Voice or Text)
            </span>
            <button
              onClick={handleMicClick}
              className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] font-bold transition ${
                isListening
                  ? 'bg-sos text-white border-sos animate-pulse'
                  : 'bg-surface-card border-surface-border text-primary hover:border-primary'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isListening ? 'Listening...' : 'Speak SOS'}</span>
            </button>
          </div>

          <textarea
            rows={2}
            value={emergencyText}
            onChange={(e) => setEmergencyText(e.target.value)}
            placeholder="E.g. Nexon EV, 8% near Andheri station, need Type 2..."
            className="w-full bg-surface-card border border-surface-border rounded-xl p-2.5 text-xs text-ink focus:outline-none focus:border-primary resize-none placeholder:text-ink-subtle"
          />

          {/* Highway Toggle switch on B1 */}
          <div className="flex items-center justify-between pt-1 border-t border-surface-border text-xs">
            <span className="text-ink-muted font-semibold text-[11px]">
              I am on a highway (Mumbai-Pune Expressway)
            </span>
            <button
              onClick={() => setIsHighwayMode(!isHighwayMode)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                isHighwayMode
                  ? 'bg-warning text-bg border-warning'
                  : 'bg-surface-card text-ink-muted border-surface-border'
              }`}
            >
              {isHighwayMode ? 'Highway ON' : 'Off'}
            </button>
          </div>
        </div>

        {/* Seed Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => navigate('/map')}
            className="bg-surface rounded-card p-3.5 border border-surface-border hover:border-primary cursor-pointer transition shadow-card group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-ink-muted uppercase">City Hosts</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            </div>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-black text-ink">{nearbyHostsCount}</span>
              <span className="text-xs text-primary font-bold">active</span>
            </div>
            <p className="text-[10px] text-ink-muted mt-1 flex items-center gap-1 group-hover:text-primary transition">
              <span>View Mumbai seed map</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>

          <div
            onClick={() => navigate('/map')}
            className="bg-surface rounded-card p-3.5 border border-surface-border hover:border-primary cursor-pointer transition shadow-card group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-ink-muted uppercase">Highway Points</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-warning-subtle text-warning border border-warning/30 rounded">
                Dhaba/Hotel
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-black text-ink">{highwayHostsCount}</span>
              <span className="text-xs text-ink-muted font-bold">stations</span>
            </div>
            <p className="text-[10px] text-ink-muted mt-1 flex items-center gap-1 group-hover:text-primary transition">
              <span>Khalapur & Lonavala</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Quick Access Icons */}
        <div>
          <h4 className="text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-2">
            Quick Rescue Tools
          </h4>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => navigate('/map')}
              className="bg-surface rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 border border-surface-border hover:border-primary active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-card border border-surface-border text-primary flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-ink">Find Bay</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="bg-surface rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 border border-surface-border hover:border-primary active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-card border border-surface-border text-primary flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-ink">Scan QR</span>
            </button>

            <button
              onClick={() => setShowHelplineModal(true)}
              className="bg-surface rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 border border-surface-border hover:border-primary active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-card border border-surface-border text-sos flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-ink">Helpline</span>
            </button>

            <button
              onClick={() => navigate('/auth')}
              className="bg-surface rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 border border-surface-border hover:border-primary active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-card border border-surface-border text-ink-muted flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-ink">Login Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Select Vehicle Modal */}
      <Modal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        title="Switch Garage Vehicle"
      >
        <div className="space-y-3">
          <p className="text-xs text-ink-muted">
            Range calculations update based on the vehicle pack capacity and real-world efficiency.
          </p>
          <div className="space-y-2">
            {MOCK_VEHICLES.map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  setSelectedVehicle(v);
                  setShowVehicleModal(false);
                }}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                  selectedVehicle.id === v.id
                    ? 'border-primary bg-primary-subtle'
                    : 'border-surface-border bg-surface-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🚙</span>
                  <div>
                    <h4 className="text-xs font-bold text-ink">{v.model}</h4>
                    <p className="text-[11px] text-ink-muted">
                      {v.batteryKwh} kWh pack · {v.kmPerKwh} km/kWh · {v.connector}
                    </p>
                  </div>
                </div>
                {selectedVehicle.id === v.id && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-bg text-[10px] font-bold">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* QR Scanner Modal */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title="Scan Host QR Code"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-44 h-44 mx-auto border-2 border-dashed border-primary rounded-card p-3 flex flex-col items-center justify-center bg-surface-card">
            <QrCode className="w-20 h-20 text-primary animate-pulse" />
            <p className="text-[11px] text-ink-muted mt-2">Align checkin QR code</p>
          </div>
          <button
            onClick={() => {
              setShowQrModal(false);
              navigate('/status');
            }}
            className="w-full bg-primary text-bg font-extrabold py-3 rounded-xl text-xs uppercase"
          >
            Simulate Check-in Start
          </button>
        </div>
      </Modal>

      {/* 24x7 Helpline Modal */}
      <Modal
        isOpen={showHelplineModal}
        onClose={() => setShowHelplineModal(false)}
        title="24/7 EV Helpline & Towing"
      >
        <div className="space-y-3">
          <div className="p-3 bg-surface-card rounded-xl border border-surface-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-ink">ChargeShare SOS Helpline</p>
              <p className="text-[11px] text-ink-muted">1800 209 0209 (Toll Free)</p>
            </div>
            <a
              href="tel:18002090209"
              className="px-3 py-1.5 bg-primary text-bg font-bold rounded-lg text-xs"
            >
              Call
            </a>
          </div>

          <div className="p-3 bg-surface-card rounded-xl border border-surface-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-ink">Flatbed Towing Service</p>
              <p className="text-[11px] text-ink-muted">+91 98201 11223</p>
            </div>
            <a
              href="tel:9820111223"
              className="px-3 py-1.5 bg-surface border border-surface-border text-ink font-bold rounded-lg text-xs"
            >
              Call Tow
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};
