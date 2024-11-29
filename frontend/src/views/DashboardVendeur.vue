<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Tableau de bord Vendeur</h1>

    <!-- Bouton Créer une annonce -->
    <div class="mb-8">
      <router-link 
        to="/creer-annonce"
        class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Créer une nouvelle annonce
      </router-link>
    </div>

    <!-- Liste des annonces -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="annonce in annonces" :key="annonce._id" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="relative h-48">
          <img 
            :src="annonce.images?.[0] || '/placeholder-image.jpg'" 
            :alt="annonce.titre"
            class="w-full h-full object-cover"
          >
          <div class="absolute bottom-4 right-4 bg-black/75 text-white px-4 py-2 rounded">
            {{ formatPrice(annonce.prix) }} €
          </div>
        </div>
        
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">{{ annonce.titre }}</h3>
          <p class="text-gray-600 mb-4">{{ annonce.ville }}</p>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-500">
              {{ annonce.surface }}m² - {{ annonce.pieces }} pièces
            </span>
            
            <div class="flex space-x-2">
              <button 
                @click="editAnnonce(annonce)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                Modifier
              </button>
              <button 
                @click="deleteAnnonce(annonce._id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucune annonce -->
    <div v-if="annonces.length === 0" class="text-center py-12">
      <p class="text-gray-600">Vous n'avez pas encore publié d'annonces</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'DashboardVendeur',
  
  setup() {
    const router = useRouter();
    const annonces = ref([]);
    const loading = ref(false);
    const error = ref('');

    const loadAnnonces = async () => {
      try {
        loading.value = true;
        // Implémentez l'appel API pour charger les annonces du vendeur
        // annonces.value = await getVendeurAnnonces();
      } catch (err) {
        console.error('Erreur lors du chargement des annonces:', err);
        error.value = "Erreur lors du chargement des annonces";
      } finally {
        loading.value = false;
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR').format(price);
    };

    const editAnnonce = (annonce) => {
      router.push(`/modifier-annonce/${annonce._id}`);
    };

    const deleteAnnonce = async (annonceId) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
        try {
          // Implémentez l'appel API pour supprimer l'annonce
          // await deleteAnnonceApi(annonceId);
          annonces.value = annonces.value.filter(a => a._id !== annonceId);
        } catch (err) {
          console.error('Erreur lors de la suppression:', err);
          error.value = "Erreur lors de la suppression de l'annonce";
        }
      }
    };

    onMounted(() => {
      loadAnnonces();
    });

    return {
      annonces,
      loading,
      error,
      formatPrice,
      editAnnonce,
      deleteAnnonce
    };
  }
};
</script>