/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        accent: '#E84B2E',
        'accent-light': '#FF6B50',
        ink: '#0F0F0F',
        paper: '#F5F2EC',
        'paper-dark': '#EDE9E1',
        muted: '#8A8680',
      },
    },
  },
  plugins: [],
}
