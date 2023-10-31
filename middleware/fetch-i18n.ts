import { useI18nStore } from '~/store/i18nStore';

export default async function () {
    console.log('Middleware is running');
  const i18nStore = useI18nStore();
  await i18nStore.fetchYamlData();
}
