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
        sans: ['"TH Sarabun New"', '"Angsana New"', 'Sarabun', 'sans-serif'],
      },
      fontSize: {
        '3xs': ['12px', '16px'],
        '2xs': ['13px', '17px'],
        'xs':  ['14px', '19px'],
        'sm':  ['15px', '21px'],
        'base':['17px', '23px'],
        'lg':  ['19px', '25px'],
        'xl':  ['22px', '28px'],
        '2xl': ['25px', '32px'],
        '3xl': ['28px', '36px'],
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
