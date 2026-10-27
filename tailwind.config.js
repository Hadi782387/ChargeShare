/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clean, modern EV Emergency Rescue palette
        bg: '#F8F9FE', // light lavender / neutral off-white
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          light: '#F8FAFC',
          border: '#E2E8F0',
        },
        primary: {
          DEFAULT: '#4F46E5', // deep indigo
          hover: '#4338CA',
          light: '#6366F1',
          subtle: '#EEF2FF',
          border: '#C7D2FE',
        },
        mint: {
          DEFAULT: '#10B981', // emerald / mint green for available & success
          hover: '#059669',
          light: '#ECFDF5',
          border: '#A7F3D0',
        },
        warning: {
          DEFAULT: '#F59E0B', // warm amber for tight ranges
          hover: '#D97706',
          light: '#FEF3C7',
          border: '#FDE68A',
        },
        sos: {
          DEFAULT: '#EF4444', // accessible red for emergency & SOS
          hover: '#DC2626',
          light: '#FEE2E2',
          border: '#FECACA',
        },
        ink: {
          DEFAULT: '#0F172A', // deep navy text
          muted: '#64748B',  // muted slate secondary text
          subtle: '#94A3B8', // subtle slate border & placeholder
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'sheet': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'elevated': '0 12px 32px -4px rgba(79, 70, 229, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
        'glow-primary': '0 0 20px rgba(79, 70, 229, 0.25)',
        'glow-sos': '0 0 25px rgba(239, 68, 68, 0.3)',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
}
