import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const searchService = {
  async getSavedSearches() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/searches`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async saveSearch(searchCriteria) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/searches`, 
      { criteres: searchCriteria },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  },

  async deleteSearch(searchId) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/searches/${searchId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default searchService;