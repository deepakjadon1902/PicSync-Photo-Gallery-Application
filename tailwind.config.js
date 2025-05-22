/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fc',
          300: '#66abfa',
          400: '#338ff9',
          500: '#0073f7',
          600: '#005cc6',
          700: '#004594',
          800: '#002e63',
          900: '#001731',
        },
        secondary: {
          50: '#eafcf7',
          100: '#d5f9ef',
          200: '#abf3df',
          300: '#82eecf',
          400: '#58e8bf',
          500: '#2ee3af',
          600: '#25b68c',
          700: '#1c8869',
          800: '#125b46',
          900: '#092d23',
        },
        accent: {
          50: '#fff2e6',
          100: '#ffe5cc',
          200: '#ffcb99',
          300: '#ffb266',
          400: '#ff9833',
          500: '#ff7e00',
          600: '#cc6500',
          700: '#994c00',
          800: '#663200',
          900: '#331900',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          700: '#b91c1c',
        },
        surface: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(30, 30, 34, 0.7)',
        },
        background: {
          light: '#f5f7fa',
          dark: '#121214',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        pulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: 1,
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: 0.9,
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        pulse: 'pulse 2s infinite',
      }
    },
  },
  plugins: [],
};