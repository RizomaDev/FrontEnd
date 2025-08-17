/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      caramellatte: {
        "primary": "oklch(0.6789 0.1477 35.23)",
        "secondary": "oklch(0.7036 0.0814 186.26)",
        "accent": "oklch(0.7036 0.0814 186.26)",
        "neutral": "oklch(0.4607 0.0611 264.88)",
        "base-100": "oklch(98% 0.003 247.858)",
        "base-200": "oklch(0.9632 0.0152 83.05)",
        "base-300": "oklch(0.709 0.084 176.7 / 0.5)",
        "base-content": "oklch(21% 0.006 285.885)",
        "info": "oklch(68% 0.169 237.323)",
        "success": "oklch(0.7036 0.0814 186.26)",
        "warning": "oklch(0.8663 0.1867 99.58)",
        "error": "oklch(59% 0.249 0.584)"
      }
    }]
  }
}
