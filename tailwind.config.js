/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Angsana New"', '"TH Sarabun New"', 'AngsanaUPC', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['14px', '18px'],
        'xs':  ['16px', '22px'],
        'sm':  ['18px', '24px'],
        'base':['20px', '26px'],
        'lg':  ['22px', '28px'],
        'xl':  ['25px', '32px'],
        '2xl': ['28px', '36px'],
        '3xl': ['32px', '40px'],
      },
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#1d4ed8',
          600: '#1e40af',
          700: '#1d3557',
        }
      }
    },
  },
  plugins: [],
}
