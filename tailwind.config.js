/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.php",
    "./app/**/*.php",
    "./resources/**/*.php",
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#EEE3FF',
          600: '#8054C7',
          700: '#5A3696',
        },
        secondary: {
          600: '#63D838',
        },
        gray: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          500: '#6B7280',
          900: '#111827',
        },
        indigo: {
          600: '#4C4DC3',
        },
      },
      fontFamily: {
        sans: ['Greycliff CF', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '38': '152px',
      },
      borderRadius: {
        'lg': '8px',
        'md': '6px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'dropdown': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}
