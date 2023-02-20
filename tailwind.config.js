/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      roboto: ["Roboto"],
      inter: ["Inter", "sans-serif"],
      termina: ["Termina"],
      rigidSquare: ["RigidSquare"],
      M42: ["M42"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
