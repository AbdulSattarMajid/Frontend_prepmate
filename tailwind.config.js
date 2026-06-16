/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 🌟 Tells Tailwind to look for the .dark class on the HTML tag
  theme: {
    extend: {
      fontFamily: { 
        sora: ['Sora', 'sans-serif'], 
        dm: ['DM Sans', 'sans-serif'] 
      },
      colors: {
        // 🌟 Mapped your existing names to CSS variables!
        deep: 'var(--color-deep)', 
        card: 'var(--color-card)', 
        card2: 'var(--color-card2)', 
        sidebar: 'var(--color-sidebar)',
        bdr: 'var(--color-bdr)', 
        bdr2: 'var(--color-bdr2)',
        brand: 'var(--color-brand)', 
        'brand-lt': 'var(--color-brand-lt)',
        txt: 'var(--color-txt)', 
        muted: 'var(--color-muted)', 
        ghost: 'var(--color-ghost)',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        blink:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        wavebar: { '0%,100%': { transform: 'scaleY(0.5)' }, '50%': { transform: 'scaleY(1.6)' } },
        spinner: { to: { transform: 'rotate(360deg)' } },
        softPulse:{ '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
      animation: {
        'fade-up': 'fadeUp 0.42s ease forwards',
        blink: 'blink 1s step-end infinite',
        wavebar: 'wavebar 1.1s ease-in-out infinite',
        spinner: 'spinner 0.75s linear infinite',
        softPulse: 'softPulse 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}