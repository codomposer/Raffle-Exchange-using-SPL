/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      "Lato-Black" : '"Lato-Black"',
      "open-sans" : '"open-sans"'
    },
    screens: {
      sm: { max: "767px", min: "370px" },
      md: "768px" ,
      lg: "1024px" ,
      xl: {min: "1200px"},
    },
  },
  plugins: [],
};
