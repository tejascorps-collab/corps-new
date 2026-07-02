/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces (dark luxury navy/black)
        ink: {
          950: '#070a11', // page background
          900: '#0a0e17', // deep panel
          850: '#0d121d',
          800: '#111827', // card
          750: '#151d2b',
          700: '#1b2536', // card hover / raised
          600: '#243044',
          500: '#334155',
        },
        // Gold / brand accent
        gold: {
          50: '#fbf6e9',
          100: '#f5ead0',
          200: '#ecd6a1',
          300: '#e0c06b',
          400: '#d4af37', // primary brand gold
          500: '#c69b2f',
          600: '#a67c26',
          700: '#7d5c1c',
        },
        // Semantic chart / status palette
        brand: {
          teal: '#2ec4b6',
          blue: '#3b82f6',
          sky: '#38bdf8',
          purple: '#8b5cf6',
          violet: '#a855f7',
          orange: '#f59e0b',
          green: '#22c55e',
          red: '#ef4444',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(212,175,55,0.25), 0 8px 30px -8px rgba(212,175,55,0.25)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e0c06b 0%, #d4af37 45%, #a67c26 100%)',
        'panel-gradient': 'linear-gradient(160deg, #131a28 0%, #0c111c 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
      },
    },
  },
  plugins: [],
}
