const axios = require('axios');

class ProximityService {
  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.hereApiKey = process.env.HERE_API_KEY;
  }

  async getCoordinates(address) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.googleMapsApiKey}`
      );
      
      if (response.data.results.length > 0) {
        return response.data.results[0].geometry.location;
      }
      throw new Error('Adresse non trouvée');
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      throw error;
    }
  }

  async getSchools(coordinates) {
    try {
      const response = await axios.get(
        `https://places.ls.hereapi.com/places/v1/browse?apiKey=${this.hereApiKey}&at=${coordinates.lat},${coordinates.lng}&cat=education&size=20`
      );
      return response.data.results.items.map(item => ({
        name: item.title,
        type: item.category.title,
        distance: item.distance,
        address: item.vicinity,
        coordinates: {
          lat: item.position[0],
          lng: item.position[1]
        }
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche des écoles:', error);
      throw error;
    }
  }

  async getTransports(coordinates) {
    try {
      const response = await axios.get(
        `https://places.ls.hereapi.com/places/v1/browse?apiKey=${this.hereApiKey}&at=${coordinates.lat},${coordinates.lng}&cat=transport&size=20`
      );
      return response.data.results.items.map(item => ({
        name: item.title,
        type: item.category.title,
        distance: item.distance,
        address: item.vicinity,
        coordinates: {
          lat: item.position[0],
          lng: item.position[1]
        }
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche des transports:', error);
      throw error;
    }
  }

  async getShops(coordinates) {
    try {
      const response = await axios.get(
        `https://places.ls.hereapi.com/places/v1/browse?apiKey=${this.hereApiKey}&at=${coordinates.lat},${coordinates.lng}&cat=shopping&size=20`
      );
      return response.data.results.items.map(item => ({
        name: item.title,
        type: item.category.title,
        distance: item.distance,
        address: item.vicinity,
        coordinates: {
          lat: item.position[0],
          lng: item.position[1]
        }
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche des commerces:', error);
      throw error;
    }
  }

  async getParks(coordinates) {
    try {
      const response = await axios.get(
        `https://places.ls.hereapi.com/places/v1/browse?apiKey=${this.hereApiKey}&at=${coordinates.lat},${coordinates.lng}&cat=leisure-outdoor&size=20`
      );
      return response.data.results.items.map(item => ({
        name: item.title,
        type: item.category.title,
        distance: item.distance,
        address: item.vicinity,
        coordinates: {
          lat: item.position[0],
          lng: item.position[1]
        }
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche des espaces verts:', error);
      throw error;
    }
  }

  async getAllProximityServices(address) {
    try {
      const coordinates = await this.getCoordinates(address);
      const [schools, transports, shops, parks] = await Promise.all([
        this.getSchools(coordinates),
        this.getTransports(coordinates),
        this.getShops(coordinates),
        this.getParks(coordinates)
      ]);

      return {
        coordinates,
        services: {
          schools,
          transports,
          shops,
          parks
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des services de proximité:', error);
      throw error;
    }
  }
}

module.exports = new ProximityService();