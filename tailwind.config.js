/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#F1F1F1",// font1
          "secondary": "#272727",//bg2 
          "accent": "#AAAAAA",// -font2
          "neutral": "#121212", //search bg
          "base-100": "#0F0F0F",//bg1
        },
      },
    ],
  },
  
}

