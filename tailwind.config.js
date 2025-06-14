module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          ...require('tailwindcss/colors').emerald,
        },
        neutral: {
          ...require('tailwindcss/colors').slate,
        },
      },
    },
  },
  plugins: [],
}