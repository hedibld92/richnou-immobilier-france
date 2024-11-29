<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <!-- En-tête avec bouton Ajouter -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Rechercher un bien</h1>
        <router-link 
          to="/ajouter-annonce"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter une annonce
        </router-link>
      </div>

      <!-- Filtres de recherche -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            v-model="searchFilters.ville"
            type="text" 
            placeholder="Ville"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
          <select 
            v-model="searchFilters.type"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Type de bien</option>
            <option value="chateau">Château</option>
            <option value="manoir">Manoir</option>
            <option value="villa">Villa</option>
            <option value="hotel-particulier">Hôtel Particulier</option>
            <option value="loft">Loft</option>
          </select>
          <input 
            v-model.number="searchFilters.prixMax"
            type="number" 
            placeholder="Budget max"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
          <button 
            @click="searchAnnonces"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>

      <!-- Résultats -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Résultats de la recherche</h2>
          <div class="flex items-center space-x-4">
            <button 
              v-if="isFiltered"
              @click="resetSearch"
              class="text-blue-600 hover:text-blue-800"
            >
              Réinitialiser la recherche
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center text-red-600 py-12">
          {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="annonces.length === 0" class="text-center py-12">
          <p class="text-gray-600 text-xl">Aucun bien ne correspond à vos critères</p>
        </div>

        <!-- Annonces Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnnonceCard 
            v-for="annonce in annonces" 
            :key="annonce._id" 
            :annonce="annonce"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import annonceService from '../services/annonceService';
import AnnonceCard from '../components/AnnonceCard.vue';

export default {
  name: 'Recherche',
  components: {
    AnnonceCard
  },
  setup() {
    const annonces = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const searchFilters = ref({
      ville: '',
      type: '',
      prixMax: null
    });

    const isFiltered = computed(() => {
      return searchFilters.value.ville !== '' || 
             searchFilters.value.type !== '' || 
             searchFilters.value.prixMax !== null;
    });

    const loadAnnonces = async () => {
      try {
        loading.value = true;
        error.value = null;
        const data = await annonceService.getAllAnnonces();
        annonces.value = data;
      } catch (err) {
        error.value = "Erreur lors du chargement des annonces";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const searchAnnonces = async () => {
      try {
        loading.value = true;
        error.value = null;
        const filters = Object.entries(searchFilters.value).reduce((acc, [key, value]) => {
          if (value !== '' && value !== null) {
            acc[key] = value;
          }
          return acc;
        }, {});
        const data = await annonceService.searchAnnonces(filters);
        annonces.value = data;
      } catch (err) {
        error.value = "Erreur lors de la recherche";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const resetSearch = () => {
      searchFilters.value = {
        ville: '',
        type: '',
        prixMax: null
      };
      loadAnnonces();
    };

    onMounted(loadAnnonces);

    return {
      annonces,
      loading,
      error,
      searchFilters,
      isFiltered,
      searchAnnonces,
      resetSearch
    };
  }
};
</script>