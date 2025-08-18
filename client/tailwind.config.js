/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
      colors: {
        royalpurple: '#6A0DAD', // Royal Purple color
        black: '#000000',
        white: '#FFFFFF',
      },

    },
  },
  plugins: [],
};
