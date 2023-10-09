//import { useI18nStore } from '~/store/i18nStore';
const i18nStore = useI18nStore();

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        welcome: 'Welcome',
        section1_title: i18nStore.enData?.section1_title || '',
        section1_text: i18nStore.enData?.section1_text || '',
      },
      pt: {
        welcome: 'Bem vindo',
        section1_title: i18nStore.ptData?.section1_title || '',
        section1_text: i18nStore.ptData?.section1_text || '',
      },
      es: {
        welcome: 'Bienvenidos',
        section1_title: i18nStore.esData?.section1_title || '',
        section1_text: i18nStore.esData?.section1_text || '',
      }
    }
}));
