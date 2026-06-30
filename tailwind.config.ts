import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18211f",
        moss: "#315a4f",
        sage: "#8aa99b",
        linen: "#f7f3ea",
        porcelain: "#fffdf8",
        clay: "#c56f43",
        mist: "#e7eee9"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 33, 31, 0.10)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      }
    }
  },
  plugins: []
};

export default config;
