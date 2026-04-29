/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#1a202c',
        'brand-blue': '#4a5568',
        'brand-primary': '#4f46e5',
        'brand-success': '#059669'
      }
    },
  },
  plugins: [],
}
