/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html, js, jsx, ts, tsx}","./src/**/*"],
  theme: {
    extend: {
      backdropContrast: {
        20: ".20",
      },
      colors: {
        backtable: "#0f0f0f",
      },
    },
  },
  plugins: [],
};
