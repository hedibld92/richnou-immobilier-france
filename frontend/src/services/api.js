import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const searchAnnonces = async (searchParams) => {
  try {
    const response = await api.get('/annonces/search', { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw error;
  }
};

export const createAnnonce = async (annonceData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/annonces', annonceData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      throw error;
    }
  };

// Autres fonctions d'API si nécessaire
export const annonceService = {
  searchAnnonces,
  // ... autres méthodes
};