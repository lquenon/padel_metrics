/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#a640f5',
        'secondary-neon': '#00f0ff',
        'background-light': '#f7f5f8',
        'background-dark': '#1a1022',
        'surface-dark': '#2a2133',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'neon-primary': '0 0 15px rgba(166, 64, 245, 0.4)',
        'neon-secondary': '0 0 15px rgba(0, 240, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
