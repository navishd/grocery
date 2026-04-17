/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16a34a', // green-600
        secondary: '#22c55e', // green-500
        dark: '#1e293b', // slate-800
        light: '#f8fafc', // slate-50
      }
    },
  },
  plugins: [],
}
