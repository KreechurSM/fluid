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
    siteDescription: 'Fluid is a dynamic Perlin Noise Visualizer and Playground. Create stunning, interactive noise patterns and dive into a world of smooth, organic visuals. Perfect for artists, developers and enthusiasts.',
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