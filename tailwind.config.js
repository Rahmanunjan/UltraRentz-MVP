/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryLight: "#7c3aed", // violet-600
        primaryDark: "#4c1d95",  // violet-900
        secondaryLight: "#f43f5e", // rose-500
        secondaryDark: "#9f1239", // rose-900
        accent: "#3b82f6", // blue-500
        backgroundStart: "#eef2ff", // indigo-100
        backgroundEnd: "#fdf4ff",   // pink-50
        success: "#22c55e", // green-500
        error: "#ef4444",   // red-500
        mutedText: "#6b7280", // gray-500
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        'custom': '0 8px 24px rgba(124, 58, 237, 0.2)',
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
};
