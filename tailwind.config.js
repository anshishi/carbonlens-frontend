/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f0d",
        surface: "#121a18",
        primary: "#2dd4a7",
        secondary: "#38bdf8",
        "accent-magenta": "#ec4899",
        success: "#2dd4a7",
        warning: "#f0b860",
        danger: "#f0654f",
        border: "rgba(45, 212, 167, 0.15)", // 1px low-opacity teal border
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 15px rgba(45, 212, 167, 0.15)",
        "glow-magenta": "0 0 15px rgba(236, 72, 153, 0.4)",
      }
    },
  },
  plugins: [],
}
