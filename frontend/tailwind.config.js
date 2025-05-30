import formsPlugin from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal
        'primary': '#3b82f6', // Azul más similar a WebDevCamp
        'primary-dark': '#2563eb',
        'secondary': '#84cc16', // Verde más similar a WebDevCamp
        'secondary-dark': '#65a30d',
        'accent': '#f97316', // Naranja más similar
        'accent-dark': '#ea580c',
        
        // Fondos oscuros
        'gray-dark': '#111827',
        'gray-darker': '#030712',
        
        // Colores para categorías (similar a WebDevCamp)
        'categoria-1': '#3b82f6', // Frontend - azul
        'categoria-2': '#84cc16', // Backend - verde
        'categoria-3': '#f97316', // JavaScript - naranja
        'categoria-4': '#8b5cf6', // PHP - morado
        'categoria-5': '#ec4899', // UX/UI - rosa
      },
      fontFamily: {
        'sans': ['Outfit', 'ui-sans-serif', 'system-ui'],
        'heading': ['Outfit', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/bg-hero.jpg')",
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'header': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
      }
    }
  },
  plugins: [formsPlugin],
}