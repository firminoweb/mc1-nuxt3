import { resolve } from "path";

export default defineNuxtConfig({
    alias: {
        "@": resolve(__dirname, "/")
    },
    imports: {
        dirs: ['store'],
    },
    app: {
        head: {
            meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
            title: "MC1 - Win the Market",
            script: []
        }
    },
    css: [
      "~/assets/css/vendors/bootstrap.min.css",
      "~/assets/css/vendors/flaticon.css",
      "~/assets/css/vendors/menu.css",
      "~/assets/css/vendors/fade-down.css",
      "~/assets/css/vendors/magnific-popup.css",
      "~/assets/css/vendors/animate.css",
      "~/assets/css/main.scss",
      "~/assets/css/responsive.scss"
    ],
    build: {
        transpile: ['swiper'],
        
    },
    modules: [
        [
            '@pinia/nuxt',
            {
              autoImports: ['defineStore', 'acceptHMRUpdate'],
            },
        ],
        [
            "@nuxtjs/google-fonts",
            {
                families: {
                    Roboto: {
                        wght: [300, 400, 500, 600, 700]
                    },
                    download: true,
                    inject: true
                }
            }
        ],
        "nuxt-swiper",
        "@nuxtjs/i18n",
        "@nuxt/ui",
    ],
    plugins: [
        '~/plugins/load-i18n.js'
    ],
    i18n: {
        locales: [
            'en',
            'es',
            'pt'
        ],
        defaultLocale: 'en',
        vueI18n: './i18n.config.ts',
        detectBrowserLanguage: false
    },
    nitro: {
        storage: {
          data: { driver: 'vercelKV' }
        }
    }
});
