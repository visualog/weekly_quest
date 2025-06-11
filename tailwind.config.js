/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./offline.html",
    "./js/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          50: '#FFF0F0',
          100: '#FFE1E1',
          200: '#FFC4C4',
          300: '#FFA6A6',
          400: '#FF8989',
          500: '#FF6B6B',
          600: '#FF3D3D',
          700: '#FF0F0F',
          800: '#E00000',
          900: '#B20000',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          50: '#E4F7F6',
          100: '#D0F2EF',
          200: '#A7E8E2',
          300: '#7EDFD6',
          400: '#55D6CA',
          500: '#4ECDC4',
          600: '#33B3AA',
          700: '#278A83',
          800: '#1C615C',
          900: '#113B38',
        },
        dark: {
          DEFAULT: '#2C3E50',
          50: '#8FA8C1',
          100: '#7E9BB8',
          200: '#5C81A6',
          300: '#496784',
          400: '#374F63',
          500: '#2C3E50',
          600: '#1E2A36',
          700: '#10161D',
          800: '#020304',
          900: '#000000',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-out': 'fadeOut 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out': 'slideOut 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-in': 'toastIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-out': 'toastOut 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
        toastIn: {
          '0%': { transform: 'translateX(calc(100% + 16px))', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        toastOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(calc(100% + 16px))', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
