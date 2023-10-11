import { defineNuxtPlugin } from '#app'
import { useI18nStore } from '~/store/i18nStore';

export default defineNuxtPlugin(async (nuxtApp) => {
  const i18nStore = useI18nStore();

  await i18nStore.fetchEnData();
  await i18nStore.fetchPtData();
  await i18nStore.fetchEsData();
})
