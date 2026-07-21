/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        neon: {
          purple: '#a855f7',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          green: '#10b981',
          pink: '#ec4899',
        },
        dark: {
          50: '#f8fafc',
          100: '#0f0f1a',
          200: '#0a0a14',
          300: '#06060e',
          400: '#141422',
          500: '#1a1a2e',
          600: '#16213e',
          700: '#0f3460',
          800: '#533483',
          900: '#e94560',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        'neon-gradient': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'typewriter': 'typewriter 3.5s steps(40, end)',
        'blink': 'blink 0.75s step-end infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px #6366f1, 0 0 20px #6366f1, 0 0 30px #6366f1' },
          to: { boxShadow: '0 0 20px #a855f7, 0 0 40px #a855f7, 0 0 60px #a855f7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        typewriter: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blink: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#6366f1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon-sm': '0 0 5px rgba(99, 102, 241, 0.5)',
        'neon': '0 0 10px rgba(99, 102, 241, 0.7), 0 0 20px rgba(99, 102, 241, 0.4)',
        'neon-lg': '0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(99, 102, 241, 0.5)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'card': '0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
