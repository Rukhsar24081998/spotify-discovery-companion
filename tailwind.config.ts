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
      fontSize: {
        // Typography scale (ui-guidelines.md -> Typography):
        // large heading, medium section titles, small supporting text.
        display: ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        heading: ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        title: ["1.25rem", { lineHeight: "1.3" }],
        body: ["1rem", { lineHeight: "1.6" }],
        support: ["0.875rem", { lineHeight: "1.5" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
