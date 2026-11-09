/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          bg: '#09090b',
          card: '#111114',
          border: '#222227',
          main: '#f4f4f6',
          muted: '#71717a',
          accent: '#f5d087',
          'cell-empty': '#18181c',
          'cell-missed': '#1f1f24',
          'cell-done': '#2e291e',
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"Segoe UI"',
          "sans-serif"
        ]
      }
    },
  },
  plugins: [],
}

