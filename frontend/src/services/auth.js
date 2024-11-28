import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

export const authService = {
  async login(credentials) {
    try {
      const response = await axios.post(API_URL + 'login', credentials);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async register(user) {
    try {
      const response = await axios.post(API_URL + 'register', user);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};