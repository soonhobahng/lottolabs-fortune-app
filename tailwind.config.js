/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          light: '#2E5A8F',
          dark: '#0E2A4F',
        },
        secondary: {
          DEFAULT: '#FFD700',
          light: '#FFE44D',
          dark: '#CCB000',
        },
        accent: {
          DEFAULT: '#FF6B6B',
          light: '#FF8E8E',
          dark: '#E64545',
        },
      },
    },
  },
  plugins: [],
}

