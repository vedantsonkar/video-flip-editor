/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightgrey: "#45474E",
        darkgrey: "#37393F",
        brandpurple: "#7C36D6",
      },
    },
  },
  plugins: [],
};
