<template>
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click="$emit('close')"
  >
    <div 
      class="bg-white rounded-lg w-full max-w-4xl h-[80vh] relative"
      @click.stop
    >
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 z-10 bg-white rounded-full p-2 hover:bg-gray-100 shadow-md"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div 
        ref="mapContainer" 
        class="w-full h-full rounded-lg"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
});

const mapContainer = ref(null);
let map = null;

onMounted(() => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWx1a2FjaCIsImEiOiJ3US1JLXJnIn0.xrpBHCwvzsX76YlO-08kjg';

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [props.longitude, props.latitude],
    zoom: 15,
    bearing: 0,
    pitch: 30
  });

  new mapboxgl.Marker()
    .setLngLat([props.longitude, props.latitude])
    .addTo(map);

  map.flyTo({
    center: [props.longitude, props.latitude],
    zoom: 17,
    bearing: 0,
    pitch: 0,
    duration: 2000,
    essential: true
  });
});

onUnmounted(() => {
  if (map) map.remove();
});
</script>