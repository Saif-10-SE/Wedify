/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f7',
          100: '#fbe8f1',
          200: '#f7d0e3',
          300: '#efabc9',
          400: '#df78a7',
          500: '#c54c79',
          600: '#af3f6a',
          700: '#933458',
          800: '#C54C79',
          900: '#67293f',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        burgundy: {
          50: '#fdf2f7',
          100: '#fbe8f1',
          200: '#f7d0e3',
          300: '#efabc9',
          400: '#df78a7',
          500: '#c54c79',
          600: '#af3f6a',
          700: '#933458',
          800: '#C54C79',
          900: '#67293f',
        }
      },
      fontFamily: {
        serif: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
