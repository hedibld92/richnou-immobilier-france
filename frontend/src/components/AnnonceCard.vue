<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="relative pt-[56.25%]">
      <img 
        :src="getImageUrl(annonce.images?.[0])"
        :alt="annonce.titre"
        class="absolute top-0 left-0 w-full h-full object-cover"
        @error="handleImageError"
      />
    </div>
    
    <div class="p-4">
      <h3 class="text-xl font-semibold mb-2">{{ annonce.titre }}</h3>
      <p class="text-gray-600 mb-2">{{ annonce.ville }}</p>
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold text-blue-600">{{ formatPrice(annonce.prix) }} €</span>
        <div class="flex space-x-2">
          <router-link 
            :to="`/modifier-annonce/${annonce._id}`"
            class="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Modifier
          </router-link>
          <router-link 
            :to="`/annonce/${annonce._id}`"
            class="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Voir détails
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnnonceCard',
  props: {
    annonce: {
      type: Object,
      required: true
    }
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) {
        return '/images/default-property.jpg';
      }
      return `http://localhost:3000${imagePath}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat('fr-FR').format(price);
    },
    handleImageError(e) {
      e.target.src = '/images/default-property.jpg';
    }
  }
}
</script>