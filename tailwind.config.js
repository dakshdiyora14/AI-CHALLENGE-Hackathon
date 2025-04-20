/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2A7F62', // Green
          light: '#3B9F7A',
          dark: '#1A6A4E',
        },
        secondary: {
          DEFAULT: '#576CA8', // Soft blue
          light: '#6B80C0',
          dark: '#445990',
        },
        accent: {
          DEFAULT: '#D4A373', // Earth tone
          light: '#E5BB91',
          dark: '#C38A57',
        },
        background: {
          DEFAULT: '#FDFCF7', // Off-white
        },
        textcolor: {
          DEFAULT: '#3C3C3B', // Dark gray
        },
        warning: {
          DEFAULT: '#B86F52', // Terracotta
        },
        success: {
          DEFAULT: '#4F772D', // Olive green
        },
      },
    },
  },
  plugins: [],
} 