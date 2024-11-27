/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#42b983',
        'secondary': '#2c3e50',
      },
      height: {
        'screen-80': '80vh',
      }
    },
  },
  plugins: [],
}