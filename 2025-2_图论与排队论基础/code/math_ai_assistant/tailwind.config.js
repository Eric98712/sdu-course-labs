/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        math: {
          bg: '#0f1729',
          'bg-light': '#1a1a2e',
          card: 'rgba(30,41,59,0.8)',
          gold: '#f0c060',
          'gold-dark': '#e2b04a',
          blue: '#4a90d9',
          purple: '#7c5ce7',
          text: '#e8e4db',
          'text-muted': '#b0b8c1',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'bounce-math': 'bounceMath 1.4s infinite ease-in-out',
        'bounce-math-1': 'bounceMath 1.4s infinite ease-in-out 0.16s',
        'bounce-math-2': 'bounceMath 1.4s infinite ease-in-out 0.32s',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        bounceMath: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(240, 192, 96, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(240, 192, 96, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
