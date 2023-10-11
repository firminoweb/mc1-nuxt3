import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
    const limitText = (text, limit = 100) => {
        return text.length > limit ? text.slice(0, limit) + '...' : text;
    };
      
    nuxtApp.provide('limitText', limitText)
})