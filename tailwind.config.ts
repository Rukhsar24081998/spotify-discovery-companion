import type { Config } from "tailwindcss";

/**
 * Theme tokens follow docs/ui-guidelines.md -> Visual Style:
 * dark mode only, near-black background, dark-gray surfaces, Spotify-green accent.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#181818",
        "surface-hover": "#282828",
        accent: {
          DEFAULT: "#1db954",
          hover: "#1ed760",
        },
      },
      maxWidth: {
        content: "900px",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
