import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Car,
  CheckCircle2,
  AlertCircle,
  User,
} from 'lucide-react';
import { UserRole } from '../types';

export const SignUpScreen: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useApp();

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('driver');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please acknowledge the terms of service and privacy policy.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      registerUser({
        name,
        email: identifier,
        phone: phone || '+91 98201 54932',
        role,
      });
      navigate(role === 'host' ? '/host' : '/home');
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-bg flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link to="/welcome" className="inline-flex items-center gap-2 mb-3 group">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition">
            <Zap className="w-7 h-7 fill-current" />
          </div>
        </Link>
        <h1 className="text-2xl font-black text-ink tracking-tight">
          Create your ChargeShare Account
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Join the community emergency EV charging network
        </p>
      </div>

      {/* Registration Card */}
      <div className="bg-surface rounded-card p-6 border border-surface-border shadow-card space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-sos-light border border-sos/30 text-sos text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Role Selection */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1.5">
              I want to use ChargeShare as:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('driver')}
                className={`py-3 px-3 rounded-xl border flex flex-col items-center gap-1 transition ${
                  role === 'driver'
                    ? 'border-primary bg-primary-subtle text-primary font-bold shadow-soft'
                    : 'border-surface-border bg-surface-light text-ink-muted hover:text-ink'
                }`}
              >
                <Car className="w-5 h-5" />
                <span className="text-xs">EV Driver</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('host')}
                className={`py-3 px-3 rounded-xl border flex flex-col items-center gap-1 transition ${
                  role === 'host'
                    ? 'border-primary bg-primary-subtle text-primary font-bold shadow-soft'
                    : 'border-surface-border bg-surface-light text-ink-muted hover:text-ink'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="text-xs">Charger Host</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Soumya Mukherjee"
              className="w-full bg-surface-light border border-surface-border rounded-xl px-4 py-2.5 text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. soumya@example.com"
              className="w-full bg-surface-light border border-surface-border rounded-xl px-4 py-2.5 text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98201 54932"
              className="w-full bg-surface-light border border-surface-border rounded-xl px-4 py-2.5 text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1">
                Confirm
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password Toggle */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-ink-muted hover:text-ink text-[11px] flex items-center gap-1"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? 'Hide password' : 'Show password'}</span>
            </button>
          </div>

          {/* Terms & Privacy Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-ink-muted">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer mt-0.5"
              />
              <span>
                I agree to the ChargeShare Community Code of Conduct and acknowledge that emergency top-ups are strictly limited to 10 kWh.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl shadow-glow-primary transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Link to Login */}
      <div className="text-center mt-5 text-xs text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
};
