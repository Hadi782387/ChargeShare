import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bell, Shield, ChevronDown, CheckCircle2, AlertTriangle, X, User, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC<{ showBack?: boolean; title?: string }> = ({ showBack = false, title }) => {
  const navigate = useNavigate();
  const {
    userLocation,
    notifications,
    markNotificationAsRead,
    driverProfile,
    hostProfile,
    currentRole,
    setCurrentRole,
  } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeUser = currentRole === 'driver' ? driverProfile : hostProfile;

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md px-4 py-3 border-b border-surface-border transition-all">
        <div className="flex items-center justify-between">
          {showBack ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center text-ink hover:border-primary active:scale-95 transition"
                aria-label="Back"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
              <h1 className="text-sm font-extrabold text-ink tracking-tight">{title || 'ChargeShare Rescue'}</h1>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Rescue Beacon</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </div>
                <div className="text-xs font-bold text-ink truncate max-w-[170px] sm:max-w-xs">
                  {userLocation.address}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Quick role toggle */}
            <button
              onClick={() => {
                const next = currentRole === 'driver' ? 'host' : 'driver';
                setCurrentRole(next);
                navigate(next === 'host' ? '/host' : '/home');
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-xl border border-surface-border bg-surface-card hover:border-primary text-ink transition flex items-center gap-1.5"
              title="Switch between Driver and Host panel"
            >
              {currentRole === 'driver' ? <User className="w-3.5 h-3.5 text-primary" /> : <Shield className="w-3.5 h-3.5 text-primary" />}
              <span className="capitalize">{currentRole}</span>
            </button>

            {/* Notification bell */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative w-8 h-8 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center text-ink hover:border-primary active:scale-95 transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-ink" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sos text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Credentials / Profile icon */}
            <button
              onClick={() => navigate('/auth')}
              className="w-8 h-8 rounded-xl bg-surface-card border border-surface-border hover:border-primary flex items-center justify-center text-ink-muted hover:text-primary transition"
              title="View & Edit Credentials (Name, Phone, Address, Email)"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm mt-12 bg-surface rounded-card border border-surface-border shadow-card overflow-hidden animate-slide-up">
            <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between bg-surface-card">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-ink text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-primary-subtle text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-6 h-6 rounded-lg text-ink-muted hover:text-ink flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[340px] overflow-y-auto divide-y divide-surface-border">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.actionUrl) {
                      navigate(notif.actionUrl);
                      setShowNotifications(false);
                    }
                  }}
                  className={`p-3.5 hover:bg-surface-light cursor-pointer transition flex items-start gap-3 ${
                    !notif.read ? 'bg-primary-subtle/30' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center shrink-0 mt-0.5">
                    {notif.type === 'emergency' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-sos" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-ink truncate">{notif.title}</p>
                      <span className="text-[10px] text-ink-muted shrink-0 ml-1">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-ink-muted mt-0.5 leading-snug">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-surface-card border-t border-surface-border text-center">
              <button
                onClick={() => {
                  notifications.forEach((n) => markNotificationAsRead(n.id));
                }}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
