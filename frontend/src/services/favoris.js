import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const favorisService = {
  async getFavoris() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/favoris`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async addFavori(annonceId) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/favoris`, 
      { annonceId },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  },

  async removeFavori(favoriId) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/favoris/${favoriId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default favorisService;