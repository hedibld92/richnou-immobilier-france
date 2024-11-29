<template>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden h-full">
      <!-- Image container avec ratio fixe -->
      <div class="relative pt-[56.25%]"> <!-- Ratio 16:9 -->
        <img 
          :src="getImageUrl(annonce.images?.[0])"
          :alt="annonce.titre"
          class="absolute top-0 left-0 w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>
      
      <!-- Contenu de la carte -->
      <div class="p-4">
        <h3 class="text-xl font-semibold mb-2 line-clamp-2">{{ annonce.titre }}</h3>
        <div class="text-gray-600 mb-2">{{ formatType(annonce.type) }}</div>
        <div class="flex justify-between items-center">
          <div class="text-lg font-bold text-blue-600">{{ formatPrice(annonce.prix) }} €</div>
          <router-link 
            :to="{ name: 'AnnonceDetail', params: { id: annonce._id }}"
            class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Voir les détails
          </router-link>
        </div>
      </div>
    </div>


    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- ... reste du code ... -->
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">{{ annonce.titre }}</h3>
          <p class="text-gray-600 mb-2">{{ annonce.ville }}</p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-blue-600">{{ formatPrice(annonce.prix) }} €</span>
            <div class="flex space-x-2">
              <router-link 
                :to="`/modifier-annonce/${annonce._id}`"
                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
              >
                Modifier
              </router-link>
              <router-link 
                :to="`/annonce/${annonce._id}`"
                class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Voir détails
              </router-link>
            </div>
          </div>
        </div>
        
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'AnnonceCard',
    props: {
      annonce: {
        type: Object,
        required: true
      }
    },
    setup() {
      const imageError = ref(false);
  
      const getImageUrl = (imagePath) => {
        if (!imagePath || imageError.value) {
          return '/images/property-placeholder.jpg';
        }
        return `http://localhost:3000${imagePath}`;
      };
  
      const handleImageError = () => {
        imageError.value = true;
      };
  
      const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price);
      };
  
      const formatType = (type) => {
        const types = {
          'chateau': 'Château',
          'manoir': 'Manoir',
          'villa': 'Villa',
          'hotel-particulier': 'Hôtel Particulier',
          'loft': 'Loft'
        };
        return types[type] || type;
      };
  
      return {
        getImageUrl,
        handleImageError,
        formatPrice,
        formatType
      };
    }
  };
  </script>