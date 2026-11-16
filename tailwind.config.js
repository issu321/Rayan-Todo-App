/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030704',
          900: '#050a06',
          850: '#09110a',
          800: '#0e1810',
          700: '#142318',
          600: '#1e3524',
          500: '#2b4d34',
        },
        pitch: '#000000',
        neon: {
          green: '#00ff66',
          emerald: '#10b981',
          lime: '#a3e635',
          mint: '#34d399',
          glow: '#05df72',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 255, 102, 0.15)',
        'glow-md': '0 0 20px rgba(0, 255, 102, 0.25)',
        'glow-lg': '0 0 35px rgba(0, 255, 102, 0.35)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.3)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(6px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      }
    },
  },
  plugins: [],
}

