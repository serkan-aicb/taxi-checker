import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        taxi: {
          yellow: "#FFC107",
          "yellow-dark": "#E6AC00",
          "yellow-light": "#FFD54F",
          blue: "#0D1B2A",
          "blue-light": "#162438",
          "blue-muted": "#1E2F44",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
