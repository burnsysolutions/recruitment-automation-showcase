/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arch: ['"Archivo Variable"', "Archivo", "system-ui", "sans-serif"],
        glo: ['"Poppins"', "ui-sans-serif", "system-ui", "sans-serif"],
        gloserif: ['"Instrument Serif"', "Georgia", "serif"],
        hand: ['"Caveat"', "cursive"],
      },
      colors: {
        // The fictional demo agency
        signal: "#E8590C",
        ink: "#0A0A0A",
        concrete: "#E4E5E3",
        steel: "#5B6066",
        // Glo, taken from globusinesssolution.com styles.css
        navy: "#1b2a41",
        action: "#002149",
        "action-hover": "#01305f",
        "action-tint": "#eef2f7",
        midnight: "#0b0f1a",
        gbg: "#f7f8fa",
        gfg: "#20242c",
        gmuted: "#5f666e",
        gborder: "#e4e7eb",
        gsecondary: "#f1f3f5",
        gsuccess: "#17804a",
        gwarning: "#8a5a00",
        gdanger: "#b3261e",
      },
    },
  },
  plugins: [],
};
