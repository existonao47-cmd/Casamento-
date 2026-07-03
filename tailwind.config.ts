import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F7F1E4",
          dark: "#EFE6D2",
        },
        ink: {
          DEFAULT: "#3B2A22",
          light: "#5C4A3D",
        },
        wine: {
          DEFAULT: "#6E1F2B",
          light: "#8C2E3B",
        },
        navy: {
          DEFAULT: "#2E3A55",
        },
        sunflower: {
          DEFAULT: "#D6A227",
          light: "#E8C468",
        },
        sage: {
          DEFAULT: "#7C8A6B",
          light: "#A3AF95",
        },
      },
      fontFamily: {
        display: ["'Alex Brush'", "cursive"],
        serif: ["'EB Garamond'", "Georgia", "serif"],
        caption: ["'Cormorant Garamond'", "serif"],
      },
      backgroundImage: {
        "paper-texture": "url('/assets/paper-texture.png')",
      },
      keyframes: {
        petalFall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(360deg)", opacity: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        petal: "petalFall 12s linear infinite",
        "fade-up": "fadeUp 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
