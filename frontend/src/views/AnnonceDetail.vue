<template>
  <div class="container mx-auto px-4 py-16">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center text-red-600 py-12">
      {{ error }}
    </div>

    <!-- Annonce details -->
    <div v-else-if="annonce" class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Images gallery -->
      <div class="relative pt-[56.25%]">
        <img 
          :src="getImageUrl(annonce.images?.[currentImage])"
          :alt="annonce.titre"
          class="absolute top-0 left-0 w-full h-full object-cover"
          @error="handleImageError"
        >



        <!-- Image navigation -->
        <div v-if="annonce.images?.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          <button 
            v-for="(_, index) in annonce.images" 
            :key="index"
            @click="currentImage = index"
            :class="[
              'w-3 h-3 rounded-full',
              currentImage === index ? 'bg-white' : 'bg-white/50'
            ]"
          ></button>
        </div>

        <!-- Navigation buttons -->
        <div v-if="annonce.images?.length > 1" class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
          <button 
            @click="previousImage" 
            class="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
          >
            ←
          </button>
          <button 
            @click="nextImage" 
            class="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div class="p-8">
        <!-- En-tête avec titre, ville et prix -->
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ annonce.titre }}</h1>
            <p class="text-gray-600 text-xl">{{ annonce.ville }}</p>
          </div>
          <div class="text-2xl font-bold text-blue-600">
            {{ formatPrice(annonce.prix) }} €
          </div>
        </div>

        <!-- Caractéristiques principales en grille -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg mb-8">
          <div class="text-center">
            <p class="text-gray-600">Surface</p>
            <p class="font-bold text-lg">{{ annonce.surface || 'Non spécifié' }} {{ annonce.surface ? 'm²' : '' }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-600">Pièces</p>
            <p class="font-bold text-lg">{{ annonce.pieces || 'Non spécifié' }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-600">Type</p>
            <p class="font-bold text-lg">{{ formatType(annonce.type) }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-600">Ville</p>
            <p class="font-bold text-lg">{{ annonce.ville }}</p>
          </div>
        </div>

        <!-- Informations détaillées -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- Caractéristiques détaillées -->
            <div>
              <h2 class="text-xl font-semibold mb-4">Caractéristiques détaillées</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b">
                  <span class="text-gray-600">Type de bien</span>
                  <span class="font-medium">{{ formatType(annonce.type) }}</span>
                </div>
                <div v-if="annonce.surface" class="flex items-center justify-between py-2 border-b">
                  <span class="text-gray-600">Surface habitable</span>
                  <span class="font-medium">{{ annonce.surface }} m²</span>
                </div>
                <div v-if="annonce.pieces" class="flex items-center justify-between py-2 border-b">
                  <span class="text-gray-600">Nombre de pièces</span>
                  <span class="font-medium">{{ annonce.pieces }}</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b">
                  <span class="text-gray-600">Localisation</span>
                  <span class="font-medium">{{ annonce.ville }}</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b">
                  <span class="text-gray-600">Prix</span>
                  <span class="font-medium">{{ formatPrice(annonce.prix) }} €</span>
                </div>
              </div>
            </div>

          <!-- Description -->
          <div>
            <h2 class="text-xl font-semibold mb-4">Description</h2>
            <p class="text-gray-600 whitespace-pre-line">{{ annonce.description }}</p>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-between items-center mt-8 border-t pt-6">
          <router-link 
            to="/recherche"
            class="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            ← Retour aux annonces
          </router-link>

          <div class="flex space-x-4">
            <router-link 
              :to="`/modifier-annonce/${annonce._id}`"
              class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Modifier l'annonce
            </router-link>
            <button
              @click="showDeleteModal = true"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Supprimer l'annonce
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete confirmation modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 class="text-xl font-bold mb-4">Confirmer la suppression</h3>
      <p class="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.</p>
      
      <div class="flex justify-end space-x-4">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          @click="deleteAnnonce"
          :disabled="deleteLoading"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {{ deleteLoading ? 'Suppression...' : 'Supprimer' }}
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import annonceService from '../services/annonceService';

export default {
  name: 'AnnonceDetail',
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    const annonce = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const currentImage = ref(0);
    const showDeleteModal = ref(false);
    const deleteLoading = ref(false);
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

    const previousImage = () => {
      if (annonce.value?.images?.length > 1) {
        currentImage.value = (currentImage.value - 1 + annonce.value.images.length) % annonce.value.images.length;
      }
    };

    const nextImage = () => {
      if (annonce.value?.images?.length > 1) {
        currentImage.value = (currentImage.value + 1) % annonce.value.images.length;
      }
    };

  const fetchAnnonce = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await annonceService.getAnnonceById(route.params.id);
      console.log('Données reçues:', response); // Ajout du console.log
      annonce.value = response;
    } catch (err) {
      console.error('Erreur lors du chargement de l\'annonce:', err);
      error.value = "Impossible de charger les détails de l'annonce";
    } finally {
      loading.value = false;
    }
  };

    const formatNumber = (number) => {
      return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : '';
    };

    const deleteAnnonce = async () => {
      try {
        deleteLoading.value = true;
        await annonceService.deleteAnnonce(route.params.id);
        router.push('/recherche');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        error.value = "Impossible de supprimer l'annonce";
      } finally {
        deleteLoading.value = false;
        showDeleteModal.value = false;
      }
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

    onMounted(fetchAnnonce);

    return {
      annonce,
      loading,
      error,
      currentImage,
      showDeleteModal,
      deleteLoading,
      getImageUrl,
      handleImageError,
      previousImage,
      nextImage,
      formatPrice,
      formatType,
      formatNumber,
      deleteAnnonce
        };
  }
};
</script>