// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/ionic", "@nuxtjs/supabase", "@nuxtjs/google-fonts"],
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  supabase: {
    types: "./database.types.ts",
  },
  css: ["./assets/styles/main.css"],
  runtimeConfig: {
    public: {
      baseUrl: "",
    },
  },
  googleFonts: {
    families: {
      Roboto: true,
    },
    download: true,
  },
})
