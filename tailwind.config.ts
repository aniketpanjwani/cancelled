import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        xl: "2.5rem",
      },
      boxShadow: {
        card: "0 30px 120px rgba(0,0,0,0.35)",
      },
      colors: {
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        accent: "var(--color-accent)",
        "accent-bright": "var(--color-accent-bright)",
        text: "var(--color-text)",
        "text-invert": "var(--color-text-invert)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
    },
  },
  plugins: [],
};

export default config;
