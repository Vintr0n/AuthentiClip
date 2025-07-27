/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#1b4e7e',
        accent: '#00b7ff',
        dark: '#000000',
      },
      boxShadow: {
        login: '0px 0px 70px 25px rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
};
