/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08080a',
          900: '#0d0d10',
          850: '#121216',
          800: '#17171c',
          750: '#1d1d23',
          700: '#25252c',
          600: '#34343d',
          500: '#4a4a55',
          400: '#6e6e7a',
          300: '#9a9aa5',
          200: '#c6c6ce',
          100: '#ececef',
        },
        paper: '#f3eee4',
        stamp: {
          DEFAULT: '#ff4d2e',
          400: '#ff6a4f',
          600: '#e63a1c',
          700: '#b82c13',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        poster: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
        glow: '0 0 0 1px rgba(255,77,46,0.4), 0 8px 30px -6px rgba(255,77,46,0.45)',
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -20px rgba(0,0,0,0.6)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
        'grain-shift': {
          '0%,100%': { transform: 'translate(0,0)' },
          '25%': { transform: 'translate(-2%,1%)' },
          '50%': { transform: 'translate(1%,-2%)' },
          '75%': { transform: 'translate(2%,2%)' },
        },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        grain: 'grain-shift 0.6s steps(2) infinite',
      },
    },
  },
  plugins: [],
}
