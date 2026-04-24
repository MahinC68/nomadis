module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#FF6B6B',
          dark: '#e85555',
          light: '#FFF0F0',
        },
        ocean: {
          DEFAULT: '#4ECDC4',
          dark: '#38B3AB',
          light: '#E0F7F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
