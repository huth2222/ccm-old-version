/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      blue: "#6C63FF",
      darkblue: "#1F3D7C",
      green: "#5ae4a7",
      white: "#FFFFFF",
      red: "red",
      black: "black",
      lightGray: "lightgray",
      gray: "gray",
      red: "red",
      orange500: "rgb(249 115 22)",
    },
    screens: {
      xs: "360px",
      ...defaultTheme.screens,
    }
  },
  plugins: [],
};
