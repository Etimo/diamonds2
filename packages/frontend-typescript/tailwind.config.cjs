/** @type {import('tailwindcss').Config} */
const defaultConfig = require('tailwindcss/defaultConfig');
const defaultSans = defaultConfig.theme.fontFamily.sans;

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        etimo: '#2c3e50',
      },
    },
    fontFamily: { sans: ['Quattrocento Sans', ...defaultSans] },
    extend: {
      colors: { etimo: '#2c3e50', 'etimo-light': '#375b7d' },
      screens: {
        '3xl': '1700px',
        '4xl': '2300px',
      },
    },
  },
  plugins: [],
};
