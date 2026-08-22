/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FDFBF7',
          100: '#FBF9F5',
          200: '#F5EFE6',
          300: '#EBE3D5',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(245, 158, 11, 0.12)',
        'card': '0 2px 12px -1px rgba(15, 23, 42, 0.06)',
        'float': '0 12px 35px -4px rgba(15, 23, 42, 0.12)',
      }
    },
  },
  plugins: [],
}
