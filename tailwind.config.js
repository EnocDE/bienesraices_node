/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.pug", "./src/js/mapaInicio.js"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "20px",
        lg: "80px",
      },
      screens: {
        sm: "375px",
        md: "768px",
        lg: "1200px",
      },
    },
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1200px",
    },
    extend: {
      colors: {
        "charcoal": "#393E41",
        "blackligth": "#222127"
      }
    },
  },
  plugins: [],
}

