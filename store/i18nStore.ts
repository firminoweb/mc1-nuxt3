import axios from 'axios';
import yaml from 'js-yaml';

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
        const response = await axios.get('http://localhost:3000/lang/enUS.yaml');
        const parsedData = yaml.load(response.data);

        this.enData = parsedData;
      } catch (error) {
        console.error("Erro ao carregar a base de tradução: ", error);
      }
    },
    async fetchPtData() {
      try {
        const response = await axios.get('http://localhost:3000/lang/ptBR.yaml');
        const parsedData = yaml.load(response.data);

        this.ptData = parsedData;
      } catch (error) {
        console.error("Erro ao carregar a base de tradução: ", error);
      }
    },
    async fetchEsData() {
      try {
        const response = await axios.get('http://localhost:3000/lang/es.yaml');
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
