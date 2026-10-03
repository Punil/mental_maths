/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        math: {
          blue: '#3b82f6',
          green: '#10b981',
          purple: '#8b5cf6',
          yellow: '#f59e0b',
          pink: '#ec4899',
          orange: '#f97316'
        }
      }
    },
  },
  plugins: [],
}
