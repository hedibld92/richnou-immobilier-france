import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const annonceService = {
    async getAllAnnonces() {
        try {
            const response = await axios.get(`${API_URL}/annonces`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des annonces:', error);
            throw error;
        }
    },

    async getAnnonceById(id) {
        try {
            const response = await axios.get(`${API_URL}/annonces/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'annonce:', error);
            throw error;
        }
    },

    async searchAnnonces(filters) {
        try {
            const response = await axios.get(`${API_URL}/annonces/search`, { params: filters });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la recherche d\'annonces:', error);
            throw error;
        }
    },

    async createAnnonce(annonceData) {
        try {
            const response = await axios.post(`${API_URL}/annonces`, annonceData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de l\'annonce:', error);
            throw error;
        }
    },

    async updateAnnonce(id, annonceData) {
        try {
            const response = await axios.put(`${API_URL}/annonces/${id}`, annonceData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'annonce:', error);
            throw error;
        }
    },

    async deleteAnnonce(id) {
        try {
            const response = await axios.delete(`${API_URL}/annonces/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'annonce:', error);
            throw error;
        }
    }
};