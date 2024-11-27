import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        annonces: [],
        selectedAnnonce: null,
        user: null
    },
    mutations: {
        SET_ANNONCES(state, annonces) {
            state.annonces = annonces;
        },
        SET_SELECTED_ANNONCE(state, annonce) {
            state.selectedAnnonce = annonce;
        },
        SET_USER(state, user) {
            state.user = user;
        }
    },
    actions: {
        async fetchAnnonces({ commit }) {
            try {
                const response = await axios.get('http://localhost:3000/api/annonces');
                commit('SET_ANNONCES', response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des annonces:', error);
            }
        },
        async searchAnnonces({ commit }, criteria) {
            try {
                const response = await axios.get('http://localhost:3000/api/annonces/search', {
                    params: criteria
                });
                commit('SET_ANNONCES', response.data);
            } catch (error) {
                console.error('Erreur lors de la recherche:', error);
            }
        }
    }
});