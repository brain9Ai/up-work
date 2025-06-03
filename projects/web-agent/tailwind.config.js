/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['var(--font-rajdhani)', 'Rajdhani', 'sans-serif'],
        display: ['var(--font-orbitron)', 'Orbitron', 'Rajdhani', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'wave': 'wave 1.5s infinite',
        'wave-slow': 'wave 1.5s infinite 0.2s',
        'spin-slow': 'spin 8s linear infinite',
        'reverse-spin-slow': 'reverse-spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 7s ease-in-out infinite 1s',
        'float-slow': 'float 10s ease-in-out infinite 2s',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        wave: {
          '0%, 100%': { height: '2px' },
          '50%': { height: '10px' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { opacity: 0.5, boxShadow: '0 0 5px rgba(56, 189, 248, 0.3), 0 0 10px rgba(56, 189, 248, 0.2)' },
          '100%': { opacity: 1, boxShadow: '0 0 20px rgba(56, 189, 248, 0.6), 0 0 30px rgba(56, 189, 248, 0.4)' }
        },
        'reverse-spin': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' }
        }
      },
      backgroundImage: {
        'circuit-pattern': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10h10v10H20zM40 10h10v10H40zM60 10h10v10H60zM80 10h10v10H80zM10 30h10v10H10zM30 30h10v10H30zM50 30h10v10H50zM70 30h10v10H70zM90 30h10v10H90zM0 50h10v10H0zM20 50h10v10H20zM40 50h10v10H40zM60 50h10v10H60zM80 50h10v10H80zM10 70h10v10H10zM30 70h10v10H30zM50 70h10v10H50zM70 70h10v10H70zM90 70h10v10H90zM0 90h10v10H0zM20 90h10v10H20zM40 90h10v10H40zM60 90h10v10H60zM80 90h10v10H80z' fill='%23ffffff' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        'grid-pattern': "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
} 