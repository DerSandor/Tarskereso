/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fatal': {
          'red': '#DC2626',    // Vörös
          'dark': '#111827',   // Fekete
          'light': '#F9FAFB',  // Fehér
          'gray': '#4B5563',   // Szürke szövegekhez
          'hover': '#B91C1C',  // Sötétebb vörös hover állapothoz
        }
      },
      fontFamily: {
        'fatal': ['Roboto', 'sans-serif'], // Modern betűtípus
      },
      boxShadow: {
        'fatal': '0 4px 6px -1px rgba(220, 38, 38, 0.1), 0 2px 4px -1px rgba(220, 38, 38, 0.06)',
      },
      borderRadius: {
        'fatal': '0.75rem', // Egységes lekerekítés
      }
    },
  },
  plugins: [],
} 