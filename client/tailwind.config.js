/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: {
          50: "#f5f4f0",
          100: "#e8e6df",
          200: "#ccc9be",
          300: "#b0ac9d",
          400: "#8f8b7a",
          500: "#6e6a59",
          600: "#524f41",
          700: "#3a382d",
          800: "#252318",
          900: "#141309",
        },
        sage: {
          50: "#f2f5f0",
          100: "#dde6d9",
          200: "#b8ccb0",
          300: "#8faf84",
          400: "#678f5a",
          500: "#4a7040",
          600: "#365430",
          700: "#253b21",
          800: "#162416",
          900: "#0a130a",
        },
        clay: {
          50: "#faf3ee",
          100: "#f2dece",
          200: "#e5bc9c",
          300: "#d49566",
          400: "#bc6e38",
          500: "#9a5120",
          600: "#733b16",
          700: "#502810",
          800: "#30180a",
          900: "#180c05",
        },
        cream: "#faf8f3",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in": "slideIn 0.35s ease forwards",
        "count-up": "countUp 0.6s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-12px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
