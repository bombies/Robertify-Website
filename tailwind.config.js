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
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      boxShadow: {
        'glow-primary-md': '0 0px 6px -1px #00D615, 0 2px 4px -2px #00D615)',
        'glow-primary-lg': '0 0px 15px -3px #00D615, 0 4px 6px -4px #00D615'
      },
      dropShadow: {
        'glow-primary-md': '0 4px 3px rgb(0 214 21 / 0.25)',
        'glow-primary-lg': '0 4px 10px rgb(0 214 21 / 0.25)'
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}
