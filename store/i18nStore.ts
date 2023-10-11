import axios from 'axios';
import yaml from 'js-yaml';

const baseUrl = import.meta.env.VITE_BASE_URL;

console.log('BASE_URL:', import.meta.env.VITE_BASE_URL);
console.log('MODE:', import.meta.env.MODE);

export const useI18nStore = defineStore({
  id: 'i18n',
  state: () => ({
    enData: null,
    ptData: null,
    esData: null,
  }),
  actions: {
    async fetchEnData() {
      try {
        const response = await axios.get(`${baseUrl}/lang/enUS.yaml`);
        const parsedData = yaml.load(response.data);

        this.enData = parsedData;
      } catch (error) {
        console.error("Erro ao carregar a base de tradução: ", error);
      }
    },
    async fetchPtData() {
      try {
        const response = await axios.get(`${baseUrl}/lang/ptBR.yaml`);
        const parsedData = yaml.load(response.data);

        this.ptData = parsedData;
      } catch (error) {
        console.error("Erro ao carregar a base de tradução: ", error);
      }
    },
    async fetchEsData() {
      try {
        const response = await axios.get(`${baseUrl}/lang/es.yaml`);
        const parsedData = yaml.load(response.data);

        this.esData = parsedData;
      } catch (error) {
        console.error("Erro ao carregar a base de tradução: ", error);
      }
    },
  },
});


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useI18nStore, import.meta.hot));
}
