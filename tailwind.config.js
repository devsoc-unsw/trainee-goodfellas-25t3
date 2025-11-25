/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9e9ff',
          200: '#a7ceff',
          300: '#75b3ff',
          400: '#4398ff',
          500: '#1a7fe6',
          600: '#125fb4',
          700: '#0b4082',
          800: '#052050',
          900: '#010820',
        },
        accent: '#f2c94c',
        success: '#34d399',
        warning: '#f97316',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};
