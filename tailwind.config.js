/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      boxShadow: {
        "neo-sm": "2px 2px 0px 0px #0f172a",
        "neo": "3.5px 3.5px 0px 0px #0f172a",
        "neo-md": "5px 5px 0px 0px #0f172a",
        "neo-lg": "7px 7px 0px 0px #0f172a",
        "neo-dark-sm": "2px 2px 0px 0px #334155",
        "neo-dark": "3.5px 3.5px 0px 0px #334155",
        "neo-dark-md": "5px 5px 0px 0px #334155",
        "neo-dark-lg": "7px 7px 0px 0px #334155",
        "neo-primary": "3.5px 3.5px 0px 0px #4f46e5",
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};