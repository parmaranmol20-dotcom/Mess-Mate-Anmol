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
        brand: {
          primary: "#174F38",
          secondary: "#286C4D",
          cream: "#F8F7F1",
          creamSoft: "#F3F1E8",
          warmWhite: "#FFFFFF",
          accent: "#F2A65A",
          accentDark: "#E08F3F",
          dark: "#1C2921",
          muted: "#788078",
          border: "#E5E3D8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(23, 79, 56, 0.06), 0 2px 6px -1px rgba(23, 79, 56, 0.04)",
        cardHover: "0 12px 30px -4px rgba(23, 79, 56, 0.12), 0 4px 12px -2px rgba(23, 79, 56, 0.06)",
        float: "0 20px 40px -6px rgba(23, 79, 56, 0.15)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;

