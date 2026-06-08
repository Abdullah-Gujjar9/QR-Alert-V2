import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d",
        },
        danger: {
          50:  "#fff1f1",
          100: "#ffe1e1",
          500: "#f83b3b",
          600: "#e51919",
          700: "#c11111",
        },
        amber: {
          50:  "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        ink: {
          50:  "#f5f5f5",
          100: "#e8e8e8",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6c6c6c",
          600: "#4f4f4f",
          700: "#3a3a3a",
          800: "#242424",
          900: "#111111",
          950: "#080808",
        },
      },
      animation: {
        "fade-up":   "fade-up 0.45s ease-out",
        "scale-in":  "scale-in 0.3s ease-out",
        "pulse-red": "pulse-red 2s ease-in-out infinite",
        "wa-bounce": "wa-bounce 1.4s ease-in-out infinite",
      },
      keyframes: {
        "fade-up":  { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "pulse-red": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(225,25,25,0.45)" },
          "50%":     { boxShadow: "0 0 0 14px rgba(225,25,25,0)" },
        },
        "wa-bounce": {
          "0%,100%": { transform: "scale(1)" },
          "50%":     { transform: "scale(1.06)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
