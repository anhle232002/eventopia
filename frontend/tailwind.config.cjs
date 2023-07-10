/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#d1410c",

          secondary: "#aefcae",

          accent: "#ef8dbb",

          neutral: "#211721",

          "base-100": "#e8eaed",

          info: "#657ae7",

          success: "#63e996",

          warning: "#fbb337",

          error: "#ea2e5d",
        },
      },
    ],
  },
};
