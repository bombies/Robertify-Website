/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/app/**/*.{js,ts,jsx,tsx}",
    "src/pages/**/*.{js,ts,jsx,tsx}",
    "src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
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
}
