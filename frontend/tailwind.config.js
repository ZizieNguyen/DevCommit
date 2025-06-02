import { colors, categorias } from './src/styles/base/_variables.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': colors.primary,
        'primary-dark': colors.primaryDark,
        'secondary': colors.secondary,
        'secondary-dark': colors.secondaryDark,
        'negro': colors.negro,
        'gris': colors.gris,
        'gris-claro': colors.grisClaro,
        // Categorías de eventos
        'categoria-frontend': categorias.frontend,
        'categoria-backend': categorias.backend,
        'categoria-javascript': categorias.javascript,
        'categoria-php': categorias.php,
        'categoria-ux': categorias.ux,
        'categoria-wordpress': categorias.wordpress,
        'categoria-react': categorias.react,
        'categoria-vue': categorias.vue,
        'categoria-devops': categorias.devops
      },
      fontFamily: {
        'sans': ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'header': "url('/img/grafico.svg'), url('/img/grafico.svg'), linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0.5)), url('/img/header.jpg')",
      },
      minHeight: {
        '60r': '60rem'
      }
    },
  },
  plugins: [],
  safelist: [
    // Colores primarios
    'text-primary', 'bg-primary', 'border-primary', 
    'hover:bg-primary-dark', 'hover:text-primary',
    
    // Colores de categorías
    'bg-categoria-frontend', 'text-categoria-frontend', 'border-categoria-frontend',
    'bg-categoria-backend', 'text-categoria-backend', 'border-categoria-backend', 
    'bg-categoria-javascript', 'text-categoria-javascript', 'border-categoria-javascript',
    'bg-categoria-php', 'text-categoria-php', 'border-categoria-php',
    'bg-categoria-ux', 'text-categoria-ux', 'border-categoria-ux',
    'bg-categoria-wordpress', 'text-categoria-wordpress', 'border-categoria-wordpress',
    'bg-categoria-react', 'text-categoria-react', 'border-categoria-react',
    'bg-categoria-vue', 'text-categoria-vue', 'border-categoria-vue',
    'bg-categoria-devops', 'text-categoria-devops', 'border-categoria-devops',
  ]
};