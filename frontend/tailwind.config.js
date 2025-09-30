/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        foreground: '#f8fafc',
        primary: {
          DEFAULT: '#f97316',
          foreground: '#0f172a'
        },
        muted: '#1e293b',
        border: '#1e293b'
      }
    }
  },
  plugins: []
};
