import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          DEFAULT: "#EE4D2D",
          light: "#F57224",
          dark: "#D0011B",
          bg: "#F5F5F5",
        },
        card: "#FFFFFF",
        "text-primary": "#222222",
        "text-secondary": "#757575",
        border: "#E0E0E0",
        "admin-dark": "#0A0F1C",
        "admin-side": "#111827",
        "admin-accent": "#3B82F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
