import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@nuxt/ui", "@nuxt/image", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      "Source Code Pro": [400, 500, 600, 700],
    },
    display: 'swap'
  }
});