/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'grey', // Light gray background
        card: '#ffffff', // White cards
        primary: '#3b82f6', // A nice blue for highlights
        'text-primary': '#1e293b', // Dark slate for main text
        'text-secondary': '#64748b', // Lighter slate for secondary text
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

