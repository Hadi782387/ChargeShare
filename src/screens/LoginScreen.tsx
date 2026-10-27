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
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate clean authentication request
    setTimeout(() => {
      setIsLoading(false);
      const isHost = identifier.toLowerCase().includes('host');
      loginUser(identifier, password, isHost ? 'host' : 'driver');
      navigate(isHost ? '/host' : '/home');
    }, 600);
  };

  // Demo auto-fill helpers for reviewers
  const handleDemoFill = (role: 'driver' | 'host') => {
    if (role === 'driver') {
      setIdentifier('driver@demo.test');
      setPassword('Rescue123!');
    } else {
      setIdentifier('host@demo.test');
      setPassword('HostRescue123!');
    }
    setErrorMessage('');
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
          Welcome back to ChargeShare
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Sign in to access your EV rescue dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-surface rounded-card p-6 border border-surface-border shadow-card space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-sos-light border border-sos/30 text-sos text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Phone Input */}
          <div>
            <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1.5">
              Email or Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="driver@demo.test or +91 98201 54932"
                className="w-full bg-surface-light border border-surface-border rounded-xl px-4 py-3 text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password Input with show/hide */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-ink uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-surface-light border border-surface-border rounded-xl px-4 py-3 text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me option */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-ink-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl shadow-glow-primary transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Buttons for Testing */}
        <div className="pt-3 border-t border-surface-border">
          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wider text-center mb-2">
            Simulated Demo Credentials (Click to fill)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('driver')}
              className="p-2 rounded-xl bg-surface-light hover:bg-primary-subtle border border-surface-border hover:border-primary text-xs font-semibold text-ink transition text-center"
            >
              🚗 Demo Driver
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('host')}
              className="p-2 rounded-xl bg-surface-light hover:bg-primary-subtle border border-surface-border hover:border-primary text-xs font-semibold text-ink transition text-center"
            >
              🛡️ Demo Host
            </button>
          </div>
        </div>
      </div>

      {/* Link to Sign Up */}
      <div className="text-center mt-5 text-xs text-ink-muted">
        Don't have an account yet?{' '}
        <Link to="/signup" className="text-primary font-bold hover:underline">
          Sign Up
        </Link>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setForgotSent(false);
        }}
        title="Reset Password"
      >
        <div className="space-y-4 py-1 text-xs">
          {forgotSent ? (
            <div className="text-center py-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-mint-light text-mint flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-ink text-sm">Simulated Link Dispatched</h4>
              <p className="text-ink-muted">
                A password reset instruction link was simulated for <strong>{forgotEmail || 'your email'}</strong>.
              </p>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="mt-3 px-4 py-2 bg-primary text-white font-bold rounded-xl"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-ink-muted">
                Enter your registered email address or phone number to receive a simulated password recovery token.
              </p>
              <input
                type="text"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter email or phone"
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => {
                  if (!forgotEmail) {
                    alert('Please enter an email or phone.');
                    return;
                  }
                  setForgotSent(true);
                }}
                className="w-full bg-primary text-white font-bold py-2.5 rounded-xl text-xs uppercase"
              >
                Send Password Reset Link
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
