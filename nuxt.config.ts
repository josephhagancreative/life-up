export default defineNuxtConfig({
  app: {
    head: {
      title: "LifeUp",
    },
  },
  modules: [
    "@nuxtjs/ionic",
    "@nuxtjs/supabase",
    "@nuxtjs/google-fonts",
    "@nuxt/icon",
    "@nuxt/image",
  ],
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  supabase: {
    types: "./database.types.ts",
    redirect: false,
  },
  css: ["./assets/styles/main.css"],
  runtimeConfig: {
    public: {
      baseUrl: "",
    },
  },
  icon: {
    customCollections: [{ prefix: "i", dir: "./assets/svgs" }],
    mode: "svg",
  },
  googleFonts: {
    families: {
      Roboto: true,
    },
    download: true,
  },
  imports: {
    dirs: ["constants"],
  },
  routeRules: {
    "/": { appMiddleware: ["auth"] },
    "/tabs/**": { appMiddleware: ["auth"] },
  },
})
