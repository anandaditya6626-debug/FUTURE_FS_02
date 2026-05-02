/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        velora: {
          50:  '#f0eeff',
          100: '#e4e0ff',
          200: '#ccc5ff',
          300: '#a99bff',
          400: '#8366ff',
          500: '#6640ff',
          600: '#5a1ef7',
          700: '#4c10e3',
          800: '#3f0ebf',
          900: '#350d9c',
          950: '#1e0669',
        },
        neon: {
          purple: '#8b5cf6',
          blue:   '#3b82f6',
          cyan:   '#06b6d4',
          pink:   '#ec4899',
          green:  '#10b981',
        },
        dark: {
          50:  '#f8f8ff',
          100: '#e8e8f0',
          200: '#c4c4d4',
          300: '#9898b4',
          400: '#6c6c94',
          500: '#484874',
          600: '#2e2e54',
          700: '#1a1a3e',
          800: '#11112e',
          900: '#0a0a1e',
          950: '#050510',
        },
      },
      backgroundImage: {
        'velora-gradient': 'linear-gradient(135deg, #0a0a1e 0%, #11112e 40%, #1a1a3e 70%, #0d0d2b 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'neon-gradient': 'linear-gradient(135deg, #6640ff 0%, #3b82f6 50%, #06b6d4 100%)',
        'purple-gradient': 'linear-gradient(135deg, #6640ff 0%, #8b5cf6 100%)',
        'blue-gradient': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        'green-gradient': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        'pink-gradient': 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-sm': '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        'neon-purple': '0 0 20px rgba(102,64,255,0.4), 0 0 60px rgba(102,64,255,0.1)',
        'neon-blue': '0 0 20px rgba(59,130,246,0.4), 0 0 60px rgba(59,130,246,0.1)',
        'neon-cyan': '0 0 20px rgba(6,182,212,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(102,64,255,0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(102,64,255,0.8), 0 0 60px rgba(102,64,255,0.3)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
