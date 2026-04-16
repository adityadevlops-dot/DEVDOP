/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a0a0a",
        surface: "#1a1a1a",
        elevated: "#2d2d2d",
        border: "#3a3a3a",
        "text-primary": "#ffffff",
        "text-muted": "#a0a0a0",
        "text-hint": "#707070",
        "accent-red": "#ff2c2c",
        "accent-red-dark": "#cc0000",
        "accent-red-light": "#ff5252",
        "accent-gold": "#ffd700",
        "accent-green": "#00d652",
        "accent-purple": "#d946ef",
        "accent-orange": "#ff8c00",
        "accent-teal": "#00d9ff",
      },
      fontFamily: {
        mono: ["'Fira Code'", "monospace"],
        sans: ["'Poppins'", "sans-serif"],
        display: ["'Orbitron'", "sans-serif"],
      },
      fontSize: {
        code: "13px",
      },
      borderRadius: {
        button: "6px",
        card: "8px",
        modal: "12px",
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(255, 44, 44, 0.3)',
        'glow-red-lg': '0 0 30px rgba(255, 44, 44, 0.4)',
      },
    },
  },
  plugins: [],
}
