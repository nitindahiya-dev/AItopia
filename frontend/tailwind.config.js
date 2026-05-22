module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        lg: '16px',
      },
      colors: {
        'light-gray': '#F7F7F7',
        'orange': '#FFB22C',
        'brown': '#854836',
        'custom-black': '#000000',
      },
      fontFamily: {
        'aeroport': ['Aeroport', 'sans-serif'],
        'loos-wide': ['Loos Extra Wide', 'sans-serif'],
      },
    },
  },
  plugins: [],
}