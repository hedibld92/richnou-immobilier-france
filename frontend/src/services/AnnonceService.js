import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const annonceService = {
  getAllAnnonces: async () => {
    try {
      const response = await axios.get(`${API_URL}/annonces`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
      throw error;
    }
  },

  getAnnonceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/annonces/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'annonce:', error);
      throw error;
    }
  },

  searchAnnonces: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/annonces/search`, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche des annonces:', error);
      throw error;
    }
  },

  deleteAnnonce: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/annonces/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce:', error);
      throw error;
    }
  },  

  createAnnonce: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/annonces`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      throw error;
    }
  },  // Ajout de la virgule ici

  updateAnnonce: async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/annonces/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification de l\'annonce:', error);
      throw error;
    }
  }
};

export default annonceService;