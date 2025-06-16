import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@nuxt/ui", "@nuxt/image", "@nuxtjs/google-fonts", "@nuxtjs/seo"],
  seo: {
    siteName: 'Fluid',
    siteDescription: 'Fluid is a Perlin noise Visualizer for a dot grid',
    siteUrl: 'https://fluid.stevemartin.dev',
    language: 'en', // Placeholder
    titleSeparator: ' - ',
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon_emerald.svg' }
      ]
    },
    robots: {
      // Initially disallow all to see if it overrides the public/robots.txt
      // We can refine this later.
      disallow: ['/'],
    },
    sitemap: true, // Enable sitemap generation
  },
  googleFonts: {
    families: {
      "Source Code Pro": [400, 500, 600, 700],
    },
    display: 'swap'
  }
});