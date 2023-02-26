/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/app/**/*.{js,ts,jsx,tsx}",
    "src/pages/**/*.{js,ts,jsx,tsx}",
    "src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      laptop: {'max': '1280px'},
      tablet: {'max': '1025px'},
      phone: {'max': '615px'},
      'laptop-min': {'min': '1280px'},
      'tablet-min': {'min': '1025px'},
      'phone-min': {'min': '615px'},
    },
    extend: {
      colors: {
        primary: "#00D615",
        secondary: "#007d0d",
        danger: "#ff2c2c",
        warning: "#ffa700",
        "secondary-text": "rgb(115,115,115)",
      },
      animation: {
        'wave-normal': 'wave 2s linear infinite'
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(-10deg)' },
          '25%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '75%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-10deg)' },
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}
