module.exports = {
  mode: 'jit',
  content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    screens: {
      laptop: {'max': '1280px'},
      tablet: {'max': '1025px'},
      phone: {'max': '615px'}
    },
    extend: {
        'animation': {
            'text':'text 3s ease infinite',
            'button': 'text 5s ease infinite'
        },
        'keyframes': {
            'text': {
                '0%, 100%': {
                    'background-size':'200% 200%',
                    'background-position': 'left center'
                },
                '50%': {
                    'background-size':'200% 200%',
                    'background-position': 'right center'
                }
            },
        }
    },
  },
  plugins: [
      require('@tailwindcss/typography'),
      require('flowbite/plugin')
  ],
}
