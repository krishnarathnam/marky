/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1a1a1a',
        'darker-blue': '#2d2d2d',
        'note-primary': '#333333',
        'note-secondary': '#666666',
        'note-teriary': '#999999',
        'border': '#e5e5e5',
        'notebar': '#f5f5f5',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
