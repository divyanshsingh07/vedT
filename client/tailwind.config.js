/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#0F172A', light: '#1E293B' },
        accent:  { DEFAULT: '#6366F1', hover: '#4F46E5', soft: '#EEF2FF' },
        surface: '#FFFFFF',
        page:    '#F8FAFC',
        heading: '#0B1120',
        muted:   '#64748B',
        border:  '#E2E8F0',
      },
    },
  },
  plugins: [],
}
