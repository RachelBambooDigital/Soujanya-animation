/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
  xs: "375px", // Small phones like iPhone SE
  sm: "425px", // Most smartphones in portrait mode
  md: "768px", // Tablets in portrait mode
  lg: "1024px", // Tablets in landscape and smaller laptops
  xl: "1280px", // Standard laptops
  "2xl": "1440px", // Larger desktops
  "3xl": "1920px", // Full HD and larger monitors
},
    colors: {
      navyBlue: "#262D31",
      white: "#FFFFFF",
      black: "#000000",
      red: "#DC3E37",
      blue: "#019ACC",
      lightBlue: "#74BCD3",
      pink: "#BF278C",
      green: "#B0CD1A",
      lightOrange: "#E4A16A",
      darkOrange: "#EA5C50",
      violet: "#595FB3",
      lightViolet: "#948EE8",
      purple: "#C0268C",
    },
    fontFamily: {
      heading: ["p22-mackinac-pro"],
      subHeading: ["Heebo"],
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
    },
  },
};
