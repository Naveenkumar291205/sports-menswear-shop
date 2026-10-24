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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          pure: "#000000",
          black: "#0A0A0A",
          dark: "#121214",
          surface: "#18181B",
          card: "#1F1F23",
          border: "#27272A",
          muted: "#71717A",
          light: "#F4F4F5",
          white: "#FFFFFF",
          accent: "#FAFAFA",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-barlow)", "Barlow Condensed", "Impact", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.3em",
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 25px -5px rgba(255, 255, 255, 0.15)',
        'white-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
