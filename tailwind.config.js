/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          blue: '#3E74FE',
          dark: '#2d54b8',
          green: '#1d9f83',
        },
        text: {
          primary: '#092540',
          secondary: '#3a5166',
          tertiary: '#6b7c8c',
          placeholder: '#b6bec6',
        },
        background: {
          primary: '#ffffff',
          secondary: '#f7f7f8',
        },
        border: {
          default: '#e6e9ec',
        }
      }
    },
  },
  plugins: [],
} 