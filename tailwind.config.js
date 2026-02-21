/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: '#5b5ef4',
        accent2: '#7c3aed',
        'accent-light': '#eef0ff',
        'landing-glow': '#f97316',
        'landing-blue': '#0ea5e9',
        'landing-slate': '#0f172a',
      }
    },
  },
  plugins: [],
}

