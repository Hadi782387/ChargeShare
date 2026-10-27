import React from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Map,
  Activity,
  MessageSquare,
  User,
  Zap,
  LogOut,
  Shield,
  Car,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    currentRole,
    driverProfile,
    hostProfile,
    logout,
    activeRequest,
  } = useApp();

  // If unauthenticated or on welcome/auth screens, do not show any navigation shell
  const isAuthPage =
    location.pathname === '/welcome' ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/splash' ||
    !isAuthenticated;

  const profile = currentRole === 'host' ? hostProfile : driverProfile;

  const driverNav = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/map', label: 'Find Chargers', icon: Map },
    { to: '/status', label: 'Requests', icon: Activity, badge: activeRequest ? '1' : undefined },
    { to: '/chat', label: 'Messages', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const hostNav = [
    { to: '/host', label: 'Dashboard', icon: Home },
    { to: '/status', label: 'Requests', icon: Activity, badge: activeRequest ? '1' : undefined },
    { to: '/chat', label: 'Messages', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const navItems = currentRole === 'host' ? hostNav : driverNav;

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center font-sans antialiased">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col md:flex-row font-sans antialiased">
      {/* Desktop Minimal Sidebar (Visible on md and larger screens) */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-surface border-r border-surface-border p-5 sticky top-0 h-screen select-none shrink-0 shadow-soft">
        <div className="space-y-6">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-glow-primary">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-ink leading-tight">
                ChargeShare
              </h1>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                <span>{currentRole === 'host' ? 'Host Panel' : 'Rescue Network'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Desktop Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-soft shadow-primary/20'
                        : 'text-ink-muted hover:text-ink hover:bg-surface-light'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-ink-muted'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white text-primary' : 'bg-sos text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout at Bottom of Sidebar */}
        <div className="pt-4 border-t border-surface-border space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary border border-primary-border flex items-center justify-center font-bold text-xs shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-ink truncate">{profile.name}</p>
              <p className="text-[10px] text-ink-muted truncate capitalize">
                {currentRole === 'host' ? 'Host Account' : 'Driver Account'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-surface-border hover:border-sos/30 text-ink-muted hover:text-sos hover:bg-sos-light/40 font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-y-auto min-h-screen">
        <div className="flex-1 w-full max-w-5xl mx-auto pb-20 md:pb-8">
          <Outlet />
        </div>

        {/* Smart Auto-Hiding Bottom Navigation (Mobile Only) */}
        <BottomNavigation />
      </main>
    </div>
  );
};
