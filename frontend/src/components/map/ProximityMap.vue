<template>
  <div class="proximite-container">
    <div id="map" class="map"></div>
    <div class="points-interet">
      <div class="filters">
        <button 
          v-for="type in types" 
          :key="type"
          :class="{ active: activeFilters.includes(type) }"
          @click="toggleFilter(type)"
        >
          {{ type }}
        </button>
      </div>
      <div class="liste-poi">
        <div v-for="poi in filteredPOI" :key="poi.id" class="poi-item">
          <h4>{{ poi.nom }}</h4>
          <p>{{ poi.type }}</p>
          <p>Distance: {{ Math.round(poi.distance) }}m</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'ProximiteMap',
  props: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const map = ref(null);
    const markers = ref([]);
    const pointsInteret = ref([]);
    const types = ['ecoles', 'commerces', 'transports'];
    const activeFilters = ref([...types]);

    const filteredPOI = computed(() => {
      return pointsInteret.value.filter(poi => 
        activeFilters.value.includes(poi.type)
      );
    });

    const initMap = () => {
      map.value = L.map('map').setView([props.latitude, props.longitude], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
      
      // Marqueur principal
      L.marker([props.latitude, props.longitude])
        .addTo(map.value)
        .bindPopup('Bien immobilier');
    };

    const loadProximiteData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/proximite/${props.latitude}/${props.longitude}`
        );
        
        // Nettoyer les marqueurs existants
        markers.value.forEach(marker => map.value.removeLayer(marker));
        markers.value = [];

        // Traiter et afficher les données
        Object.entries(response.data).forEach(([type, points]) => {
          points.forEach(point => {
            const marker = L.marker([point.coordinates.lat, point.coordinates.lng])
              .addTo(map.value)
              .bindPopup(point.nom);
            markers.value.push(marker);
          });
          pointsInteret.value = [...pointsInteret.value, ...points];
        });
      } catch (error) {
        console.error('Erreur chargement données proximité:', error);
      }
    };

    const toggleFilter = (type) => {
      const index = activeFilters.value.indexOf(type);
      if (index > -1) {
        activeFilters.value.splice(index, 1);
      } else {
        activeFilters.value.push(type);
      }
    };

    onMounted(() => {
      initMap();
      loadProximiteData();
    });

    return {
      types,
      activeFilters,
      filteredPOI,
      toggleFilter
    };
  }
};
</script>

<style scoped>
.proximite-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  height: 600px;
}

.map {
  height: 100%;
  border-radius: 8px;
}

.points-interet {
  overflow-y: auto;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.filters button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #f0f0f0;
}

.filters button.active {
  background: #42b983;
  color: white;
}

.poi-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.poi-item h4 {
  margin: 0 0 5px 0;
}

.poi-item p {
  margin: 0;
  color: #666;
}
</style>