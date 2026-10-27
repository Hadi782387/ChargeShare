import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Shield,
  Car,
  MapPin,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { DEMO_DRIVER_CREDENTIALS, DEMO_HOST_CREDENTIALS, MOCK_VEHICLES } from '../data/mockData';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDriver, loginAsHost, setCurrentRole } = useApp();

  const [activeTab, setActiveTab] = useState<'driver' | 'host'>('driver');

  // Driver Credentials State (1. Name, 2. Phone No, 3. Address, 4. Email)
  const [driverName, setDriverName] = useState(DEMO_DRIVER_CREDENTIALS.name);
  const [driverPhone, setDriverPhone] = useState(DEMO_DRIVER_CREDENTIALS.phone);
  const [driverAddress, setDriverAddress] = useState(DEMO_DRIVER_CREDENTIALS.address);
  const [driverEmail, setDriverEmail] = useState(DEMO_DRIVER_CREDENTIALS.email);
  const [driverVehicleId, setDriverVehicleId] = useState(MOCK_VEHICLES[0].id);
  const [driverOtp, setDriverOtp] = useState('123456');

  // Host Credentials State (from Master Document)
  const [hostName, setHostName] = useState(DEMO_HOST_CREDENTIALS.name);
  const [hostPhone, setHostPhone] = useState(DEMO_HOST_CREDENTIALS.phone);
  const [hostEmail, setHostEmail] = useState(DEMO_HOST_CREDENTIALS.email);
  const [hostAreaLabel, setHostAreaLabel] = useState(DEMO_HOST_CREDENTIALS.areaLabel);
  const [hostAddressText, setHostAddressText] = useState(DEMO_HOST_CREDENTIALS.addressText);
  const [bisCertified, setBisCertified] = useState(true);
  const [sitePermission, setSitePermission] = useState(true);
  const [evMetered, setEvMetered] = useState(true);
  const [hostOtp, setHostOtp] = useState('123456');

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = MOCK_VEHICLES.find((v) => v.id === driverVehicleId) || MOCK_VEHICLES[0];
    loginAsDriver({
      name: driverName,
      phone: driverPhone,
      address: driverAddress,
      email: driverEmail,
      vehicle: veh,
    });
    navigate('/home');
  };

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsHost({
      name: hostName,
      phone: hostPhone,
      email: hostEmail,
      areaLabel: hostAreaLabel,
      addressText: hostAddressText,
      bisCertified,
      sitePermission,
      evMetered,
    });
    navigate('/host');
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-primary text-bg flex items-center justify-center shadow-glow-primary mb-3">
          <Zap className="w-8 h-8 fill-current text-bg" />
        </div>
        <h1 className="text-2xl font-black text-ink tracking-tight flex items-center justify-center gap-2">
          <span>ChargeShare Rescue</span>
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Peer-to-Peer Emergency EV Charging · Phase 1
        </p>
      </div>

      {/* Role Picker Segmented Control */}
      <div className="bg-surface rounded-2xl p-1.5 border border-surface-border flex mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('driver')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'driver'
              ? 'bg-primary text-bg shadow-md'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Driver Login</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('host')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'host'
              ? 'bg-primary text-bg shadow-md'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Host Login</span>
        </button>
      </div>

      {/* Driver Credentials Form */}
      {activeTab === 'driver' && (
        <form onSubmit={handleDriverSubmit} className="space-y-3.5 bg-surface p-5 rounded-card border border-surface-border shadow-card">
          <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
            <h2 className="text-sm font-bold text-ink flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" />
              <span>Driver Credentials</span>
            </h2>
            <span className="text-[10px] bg-primary-subtle text-primary font-bold px-2 py-0.5 rounded-full">
              Demo Ready
            </span>
          </div>

          {/* 1. Name */}
          <div>
            <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
              1. Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Driver full name"
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* 2. Phone No. */}
          <div>
            <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
              2. Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="+91 Phone Number"
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* 3. Address */}
          <div>
            <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
              3. Residential Address
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={driverAddress}
                onChange={(e) => setDriverAddress(e.target.value)}
                placeholder="Full address in Mumbai"
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* 4. Email */}
          <div>
            <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
              4. Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={driverEmail}
                onChange={(e) => setDriverEmail(e.target.value)}
                placeholder="driver@demo.test"
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Vehicle Dropdown */}
          <div>
            <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
              Vehicle Model
            </label>
            <select
              value={driverVehicleId}
              onChange={(e) => setDriverVehicleId(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-primary transition"
            >
              {MOCK_VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.model} ({v.batteryKwh} kWh · {v.connector})
                </option>
              ))}
            </select>
          </div>

          {/* Demo OTP */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                SMS OTP Verification
              </label>
              <span className="text-[10px] text-primary font-bold">Demo OTP: 123456</span>
            </div>
            <input
              type="text"
              value={driverOtp}
              onChange={(e) => setDriverOtp(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2 text-xs text-ink font-mono tracking-widest text-center focus:outline-none focus:border-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-bg font-extrabold py-3.5 px-4 rounded-xl shadow-glow-primary transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-4"
          >
            <span>Enter as Driver (SOS Mode)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Host Credentials Form */}
      {activeTab === 'host' && (
        <form onSubmit={handleHostSubmit} className="space-y-3.5 bg-surface p-5 rounded-card border border-surface-border shadow-card">
          <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
            <h2 className="text-sm font-bold text-ink flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary" />
              <span>Host Charger Credentials</span>
            </h2>
            <span className="text-[10px] bg-primary-subtle text-primary font-bold px-2 py-0.5 rounded-full">
              Superhost Demo
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
              Host Full Name
            </label>
            <input
              type="text"
              required
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
                Phone No.
              </label>
              <input
                type="tel"
                required
                value={hostPhone}
                onChange={(e) => setHostPhone(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={hostEmail}
                onChange={(e) => setHostEmail(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
              Public Area Label (Shown on Map)
            </label>
            <input
              type="text"
              required
              value={hostAreaLabel}
              onChange={(e) => setHostAreaLabel(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider mb-1">
              Private Address (Shown Only After Accept)
            </label>
            <input
              type="text"
              required
              value={hostAddressText}
              onChange={(e) => setHostAddressText(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>

          {/* Compliance Checklist per Section 10/13 */}
          <div className="bg-surface-card p-3 rounded-xl border border-surface-border space-y-2 text-[11px]">
            <span className="font-bold text-ink block text-xs">Compliance Guarantees:</span>
            <label className="flex items-center gap-2 cursor-pointer text-ink-muted">
              <input
                type="checkbox"
                checked={bisCertified}
                onChange={(e) => setBisCertified(e.target.checked)}
                className="accent-primary"
              />
              <span>BIS IS 17017 Certified Charger & RCCB Earthing</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-ink-muted">
              <input
                type="checkbox"
                checked={sitePermission}
                onChange={(e) => setSitePermission(e.target.checked)}
                className="accent-primary"
              />
              <span>Society/Site Permission for Emergency Rescues</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-ink-muted">
              <input
                type="checkbox"
                checked={evMetered}
                onChange={(e) => setEvMetered(e.target.checked)}
                className="accent-primary"
              />
              <span>Dedicated EV Meter or Sub-metering</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-bg font-extrabold py-3.5 px-4 rounded-xl shadow-glow-primary transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-4"
          >
            <span>Enter Host Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Quick Demo Pre-fill Actions */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            loginAsDriver();
            navigate('/home');
          }}
          className="flex-1 py-2.5 bg-surface border border-surface-border hover:border-primary/50 text-ink-muted hover:text-ink text-[11px] font-bold rounded-xl transition text-center"
        >
          ⚡ Fast Driver Demo
        </button>
        <button
          type="button"
          onClick={() => {
            loginAsHost();
            navigate('/host');
          }}
          className="flex-1 py-2.5 bg-surface border border-surface-border hover:border-primary/50 text-ink-muted hover:text-ink text-[11px] font-bold rounded-xl transition text-center"
        >
          🛡️ Fast Host Demo
        </button>
      </div>
    </div>
  );
};
