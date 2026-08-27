/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8eef8',
          100: '#c5d3ee',
          200: '#9db5e3',
          300: '#7497d7',
          400: '#5680cf',
          500: '#3869c7',
          600: '#2d5bb8',
          700: '#1e3a6e',
          800: '#1a3260',
          900: '#0f1f3d',
        },
        secondary: {
          50:  '#fce4f3',
          100: '#f7b9e0',
          200: '#f28dcc',
          300: '#ec60b8',
          400: '#e83da8',
          500: '#e41a98',
          600: '#d4178a',
          700: '#b8126f',
          800: '#9c0e57',
          900: '#6e0939',
        },
        neutral: {
          50:  '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        latin:  ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'ticker':     'ticker 30s linear infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:   { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        ticker:    { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
      },
    },
  },
  plugins: [],
};
