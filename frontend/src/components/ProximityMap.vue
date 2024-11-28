<template>
  <div class="relative">
    <div id="map" class="h-[600px] w-full rounded-lg"></div>
    <div class="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <div class="space-y-2">
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="filters.schools">
          <span>Écoles</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="filters.transports">
          <span>Transports</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="filters.shops">
          <span>Commerces</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="filters.parks">
          <span>Espaces verts</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'ProximityMap',
  props: {
    services: {
      type: Object,
      required: true
    },
    center: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    let map = null
    let markers = []
    const filters = ref({
      schools: true,
      transports: true,
      shops: true,
      parks: true
    })

    const initMap = () => {
      map = L.map('map').setView([props.center.lat, props.center.lng], 14)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      
      // Marqueur principal (bien immobilier)
      L.marker([props.center.lat, props.center.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: '<div class="marker-pin bg-blue-600"></div>',
          iconSize: [30, 42],
          iconAnchor: [15, 42]
        })
      }).addTo(map)
    }

    const updateMarkers = () => {
      // Supprimer les marqueurs existants
      markers.forEach(marker => marker.remove())
      markers = []

      // Ajouter les nouveaux marqueurs selon les filtres
      if (filters.value.schools) {
        props.services.schools.forEach(school => {
          const marker = L.marker([school.coordinates.lat, school.coordinates.lng], {
            icon: createCustomIcon('school', 'bg-red-500')
          })
          .bindPopup(`
            <strong>${school.name}</strong><br>
            Distance: ${school.distance}m<br>
            ${school.address}
          `)
          .addTo(map)
          markers.push(marker)
        })
      }

      if (filters.value.transports) {
        props.services.transports.forEach(transport => {
          const marker = L.marker([transport.coordinates.lat, transport.coordinates.lng], {
            icon: createCustomIcon('transport', 'bg-green-500')
          })
          .bindPopup(`
            <strong>${transport.name}</strong><br>
            Distance: ${transport.distance}m<br>
            ${transport.address}
          `)
          .addTo(map)
          markers.push(marker)
        })
      }

      // ... Similaire pour shops et parks
    }

    const createCustomIcon = (type, colorClass) => {
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin ${colorClass}"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      })
    }

    watch(filters, () => {
      updateMarkers()
    }, { deep: true })

    onMounted(() => {
      initMap()
      updateMarkers()
    })

    return {
      filters
    }
  }
}
</script>

<style scoped>
.marker-pin {
  width: 30px;
  height: 42px;
  border-radius: 50% 50% 50% 0;
  position: relative;
  transform: rotate(-45deg);
  margin: -20px -15px;
}

.marker-pin::after {
  content: '';
  width: 24px;
  height: 24px;
  margin: 3px 0 0 3px;
  background: #fff;
  position: absolute;
  border-radius: 50%;
}
</style>