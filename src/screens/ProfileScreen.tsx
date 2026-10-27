import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { useApp } from '../context/AppContext';
import {
  User,
  Car,
  History,
  Wallet,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  CreditCard,
  Plus,
  ArrowRight,
  Phone,
  KeyRound,
  Shield,
  MapPin,
  Mail,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { formatCurrency } from '../utils/rescueLogic';
import { MOCK_VEHICLES } from '../data/mockData';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    driverProfile,
    hostProfile,
    currentRole,
    setCurrentRole,
    selectedVehicle,
    setSelectedVehicle,
    requests,
    logout,
  } = useApp();

  const [activeModal, setActiveModal] = useState<
    'vehicles' | 'history' | 'wallet' | 'support' | 'settings' | 'logout' | null
  >(null);

  const [walletAmount, setWalletAmount] = useState('500');

  const profile = currentRole === 'driver' ? driverProfile : hostProfile;

  return (
    <div className="flex-1 flex flex-col bg-bg text-ink min-h-screen">
      <Header title="Profile & Account" />

      <div className="flex-1 px-4 sm:px-6 pt-3 pb-24 space-y-3.5">
        {/* Credentials Card Displaying 1. Name 2. Phone 3. Address 4. Email */}
        <div className="bg-surface rounded-card p-4 sm:p-5 border border-surface-border shadow-card space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center text-primary text-xl font-black">
                {profile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-ink text-sm sm:text-base">{profile.name}</h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-primary-subtle text-primary text-[10px] font-bold border border-primary/20">
                    {currentRole === 'driver' ? 'EV Driver' : 'Charging Host'}
                  </span>
                </div>
                <p className="text-xs text-ink-muted">{profile.email}</p>
                <p className="text-xs text-ink-muted">{profile.phone}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/auth')}
              className="px-2.5 py-1 bg-surface-card border border-surface-border hover:border-primary text-ink text-[11px] font-bold rounded-xl transition flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5 text-primary" />
              <span>Edit</span>
            </button>
          </div>

          {/* User Address display */}
          <div className="p-2.5 bg-surface-card rounded-xl border border-surface-border text-xs flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-ink-muted uppercase block">
                {currentRole === 'driver' ? '3. Registered Address' : 'Private Bay Address'}
              </span>
              <span className="text-ink">
                {currentRole === 'driver' ? driverProfile.address : hostProfile.addressText}
              </span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border text-center text-xs">
            <div>
              <span className="text-[10px] text-ink-muted font-bold block uppercase">Rating</span>
              <span className="font-extrabold text-warning block mt-0.5">
                ★ {profile.ratingAvg}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ink-muted font-bold block uppercase">Rescues</span>
              <span className="font-extrabold text-primary block mt-0.5">
                {currentRole === 'driver' ? driverProfile.ratingCount : hostProfile.acceptedCount}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ink-muted font-bold block uppercase">Status</span>
              <span className="font-extrabold text-primary block mt-0.5">Verified</span>
            </div>
          </div>
        </div>

        {/* Panel Switcher Banner */}
        <div className="bg-surface-card rounded-xl p-3 border border-surface-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Switch to {currentRole === 'driver' ? 'Host Panel' : 'Driver Panel'}</span>
          </div>
          <button
            onClick={() => {
              const next = currentRole === 'driver' ? 'host' : 'driver';
              setCurrentRole(next);
              navigate(next === 'host' ? '/host' : '/home');
            }}
            className="px-3 py-1 bg-primary text-bg font-extrabold text-xs rounded-lg uppercase"
          >
            Switch
          </button>
        </div>

        {/* Navigation Items */}
        <div className="bg-surface rounded-card border border-surface-border divide-y divide-surface-border shadow-card overflow-hidden text-xs">
          {/* My Vehicles */}
          <button
            onClick={() => setActiveModal('vehicles')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-surface-card transition text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border text-primary flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-ink block">My Vehicles</span>
                <span className="text-[11px] text-ink-muted">
                  {selectedVehicle.model} ({selectedVehicle.connector})
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted" />
          </button>

          {/* Request History */}
          <button
            onClick={() => setActiveModal('history')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-surface-card transition text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border text-primary flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-ink block">Rescue History & Receipts</span>
                <span className="text-[11px] text-ink-muted">
                  {requests.length} past emergency sessions
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted" />
          </button>

          {/* Wallet */}
          <button
            onClick={() => setActiveModal('wallet')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-surface-card transition text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border text-primary flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-ink block">Wallet & Mock UPI</span>
                <span className="text-[11px] text-ink-muted">
                  Balance: ₹1,450.00 · Auto-Escrow active
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted" />
          </button>

          {/* Support */}
          <button
            onClick={() => setActiveModal('support')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-surface-card transition text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border text-sos flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-ink block">24/7 Roadside Assistance</span>
                <span className="text-[11px] text-ink-muted">
                  Toll-Free Helpline & Flatbed Towing
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveModal('settings')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-surface-card transition text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border text-ink-muted flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-ink block">App Preferences</span>
                <span className="text-[11px] text-ink-muted">
                  Theme, Safety Buffer (0.8x city / 0.7x highway)
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted" />
          </button>
        </div>

        {/* Log Out */}
        <button
          onClick={() => setActiveModal('logout')}
          className="w-full bg-surface hover:bg-sos/15 text-sos font-bold py-3.5 rounded-card border border-surface-border flex items-center justify-center gap-2 text-xs transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Switch Account</span>
        </button>
      </div>

      {/* Vehicles Modal */}
      <Modal
        isOpen={activeModal === 'vehicles'}
        onClose={() => setActiveModal(null)}
        title="Garage Vehicles"
      >
        <div className="space-y-2.5 text-xs">
          {MOCK_VEHICLES.map((v) => (
            <div
              key={v.id}
              onClick={() => {
                setSelectedVehicle(v);
                setActiveModal(null);
              }}
              className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                selectedVehicle.id === v.id
                  ? 'border-primary bg-primary-subtle'
                  : 'border-surface-border bg-surface-card'
              }`}
            >
              <div>
                <span className="font-bold text-ink block">{v.model}</span>
                <span className="text-[11px] text-ink-muted">
                  {v.batteryKwh} kWh pack · {v.kmPerKwh} km/kWh · {v.connector}
                </span>
              </div>
              {selectedVehicle.id === v.id && (
                <span className="px-2 py-0.5 rounded-full bg-primary text-bg font-bold text-[10px]">
                  Selected
                </span>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={activeModal === 'history'}
        onClose={() => setActiveModal(null)}
        title="Rescue Receipts"
      >
        <div className="space-y-2.5 text-xs max-h-[60vh] overflow-y-auto">
          {requests.map((r) => (
            <div key={r.id} className="p-3 bg-surface-card rounded-xl border border-surface-border space-y-1">
              <div className="flex justify-between items-center">
                <strong className="text-ink">{r.hostName}</strong>
                <span className="text-primary font-bold font-mono">{formatCurrency(r.estTotal)}</span>
              </div>
              <p className="text-[11px] text-ink-muted">{r.hostAddressText || r.hostAreaLabel}</p>
              <div className="flex justify-between text-[10px] text-ink-subtle pt-1 border-t border-surface-border">
                <span>{r.createdAt}</span>
                <span className="uppercase font-bold text-primary">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Wallet Modal */}
      <Modal
        isOpen={activeModal === 'wallet'}
        onClose={() => setActiveModal(null)}
        title="ChargeShare Wallet"
      >
        <div className="space-y-3.5 text-xs text-center py-2">
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
            <span className="text-[10px] text-ink-muted uppercase">Balance</span>
            <span className="text-3xl font-black text-primary block mt-1">₹1,450.00</span>
            <span className="text-[11px] text-ink-muted">UPI Linked: {profile.email}</span>
          </div>

          <button
            onClick={() => {
              alert('Simulated ₹500 top-up via UPI.');
              setActiveModal(null);
            }}
            className="w-full bg-primary text-bg font-black py-3 rounded-xl uppercase text-xs shadow-glow-primary"
          >
            Add ₹500 via UPI
          </button>
        </div>
      </Modal>

      {/* Support Modal */}
      <Modal
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
        title="24/7 EV Assistance"
      >
        <div className="space-y-2.5 text-xs">
          <div className="p-3 bg-surface-card rounded-xl border border-surface-border flex items-center justify-between">
            <div>
              <p className="font-bold text-ink">ChargeShare SOS Dispatch</p>
              <p className="text-[11px] text-ink-muted">1800 209 0209 (Toll Free)</p>
            </div>
            <a href="tel:18002090209" className="px-3 py-1.5 bg-primary text-bg font-bold rounded-lg">
              Call
            </a>
          </div>

          <div className="p-3 bg-surface-card rounded-xl border border-surface-border flex items-center justify-between">
            <div>
              <p className="font-bold text-ink">Roadside Flatbed Towing</p>
              <p className="text-[11px] text-ink-muted">+91 98201 11223</p>
            </div>
            <a href="tel:9820111223" className="px-3 py-1.5 bg-surface border border-surface-border text-ink font-bold rounded-lg">
              Call
            </a>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        title="Rescue Settings"
      >
        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-surface-card rounded-xl flex justify-between items-center">
            <span className="text-ink">City Range Buffer:</span>
            <strong className="text-primary">0.8x Factor</strong>
          </div>
          <div className="p-2.5 bg-surface-card rounded-xl flex justify-between items-center">
            <span className="text-ink">Highway Range Buffer:</span>
            <strong className="text-warning">0.7x Factor</strong>
          </div>
          <div className="p-2.5 bg-surface-card rounded-xl flex justify-between items-center">
            <span className="text-ink">Emergency Rescue Cap:</span>
            <strong className="text-primary">10 kWh Max</strong>
          </div>
        </div>
      </Modal>

      {/* Log out Modal */}
      <Modal
        isOpen={activeModal === 'logout'}
        onClose={() => setActiveModal(null)}
        title="Sign Out"
      >
        <div className="space-y-3 text-xs text-center py-2">
          <p className="text-ink-muted">
            Do you wish to log out and switch to another driver or host account?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 py-2.5 bg-surface-card border border-surface-border rounded-xl text-ink font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                logout();
                setActiveModal(null);
                navigate('/auth');
              }}
              className="flex-1 py-2.5 bg-sos text-white font-bold rounded-xl"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
