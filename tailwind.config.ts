import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        summit: {
          ink: "#17211d",
          pine: "#14513f",
          teal: "#0f766e",
          gold: "#c58a1a",
          cloud: "#f5f7f6",
          line: "#dce4df"
        }
      },
      boxShadow: {
        panel: "0 8px 24px rgba(23, 33, 29, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
