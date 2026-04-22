import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf9",
          100: "#ccfbef",
          200: "#99f6de",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0f766e",
          700: "#115e59",
          800: "#134e4a"
        },
        accent: {
          50: "#fff9ed",
          100: "#ffefc8",
          200: "#ffdba3",
          300: "#ffbe6d",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c"
        },
        surface: {
          50: "#fffef8",
          100: "#fffaf0",
          200: "#f6f2e8",
          300: "#ece3d3"
        }
      },
      boxShadow: {
        soft: "0 12px 32px rgba(15, 118, 110, 0.08)",
        float: "0 24px 70px rgba(56, 189, 248, 0.18)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "ui-sans-serif",
          "system-ui"
        ],
        display: [
          "var(--font-space)",
          "ui-sans-serif",
          "system-ui"
        ]
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at top left, rgba(20,184,166,0.24), transparent 55%), radial-gradient(circle at top right, rgba(251,146,60,0.16), transparent 35%)",
        "soft-grid": "linear-gradient(rgba(15,118,110,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
