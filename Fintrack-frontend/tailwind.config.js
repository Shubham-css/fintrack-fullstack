/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        primaryHover: '#059669',
        background: '#F8FAFC',
        card: '#FFFFFF',
        textMain: '#111827',
        textMuted: '#6B7280',
        accent: '#34D399',
        borderLine: '#E5E7EB'
      }
    },
  },
  plugins: [],
}