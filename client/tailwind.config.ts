import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#19A84D",
          dark: "#158F42",
          light: "#2FC962",
          lightest: "#EEFCF3",
        },
        ink: {
          DEFAULT: "#111827",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
        surface: "#FFFFFF",
        subtle: "#F9FAFB",
        line: "#E5E7EB",
      },
    },
  },
  plugins: [],
};

export default config;