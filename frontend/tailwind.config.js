/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#dae7ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#5a90ff',
          500: '#2f68ff',
          600: '#1848e6',
          700: '#1439b5',
          800: '#172f8f',
          900: '#192c72',
          950: '#0f1a45'
        }
      },
      boxShadow: {
        card: '0 8px 30px rgba(10, 34, 87, 0.08)'
      }
    }
  },
  plugins: []
};
