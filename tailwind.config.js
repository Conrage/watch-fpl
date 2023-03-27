/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'play': ['Play', 'sans-serif'],
      'red-hat': ['Red Hat Display', 'sans-serif'],
      'jost': ['Jost', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [require('daisyui')],
}
