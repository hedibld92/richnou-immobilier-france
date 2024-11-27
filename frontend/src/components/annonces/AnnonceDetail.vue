<template>
  <!-- ... reste du template ... -->
  <ProximiteMap 
    v-if="annonce"
    :latitude="annonce.adresse.coordinates.lat"
    :longitude="annonce.adresse.coordinates.lng"
  />
</template>

<script>
import ProximiteMap from '../components/ProximiteMap.vue'

export default {
  components: {
    ProximiteMap
  },
  // ... reste du script ...
}
</script>