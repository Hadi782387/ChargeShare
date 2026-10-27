import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, Activity, User, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { activeRequest, currentRole, messages } = useApp();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Smart auto-hiding scroll listener with debounce & hysteresis
  useEffect(() => {
    const handleScroll = () => {
      // Find scroll position either on window or on the nearest scrollable element
      const currentScrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      const delta = currentScrollY - lastScrollY.current;

      // Always show when near the top
      if (currentScrollY < 30) {
        setIsVisible(true);
      } else if (delta > 8 && currentScrollY > 60) {
        // Scrolling DOWN -> smoothly hide
        setIsVisible(false);
      } else if (delta < -8) {
        // Scrolling UP -> reveal navigation
        setIsVisible(true);
      }

      lastScrollY.current = Math.max(0, currentScrollY);

      // If user stops scrolling for a short while, keep accessible if touched
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        // Keeps state steady without flickering
      }, 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also attach to any main scroll container
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Whenever the route changes, ensure the nav bar is visible
  useEffect(() => {
    setIsVisible(true);
  }, [location.pathname]);

  const driverTabs = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/map', label: 'Chargers', icon: Map },
    { to: '/status', label: 'Requests', icon: Activity, badge: activeRequest ? '1' : undefined },
    { to: '/chat', label: 'Messages', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const hostTabs = [
    { to: '/host', label: 'Dashboard', icon: Home },
    { to: '/status', label: 'Requests', icon: Activity, badge: activeRequest ? '1' : undefined },
    { to: '/chat', label: 'Messages', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const navItems = currentRole === 'host' ? hostTabs : driverTabs;

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-label="Mobile Navigation"
    >
      <div className="mx-3 mb-2 bg-surface/95 backdrop-blur-lg border border-surface-border rounded-sheet shadow-elevated px-2 py-1.5 flex items-center justify-around safe-area-pb">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl relative transition-all duration-200 select-none ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-ink-muted hover:text-ink font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-9 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? 'bg-primary-subtle text-primary shadow-soft' : ''
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-sos ring-2 ring-white animate-pulse" />
                  )}
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
