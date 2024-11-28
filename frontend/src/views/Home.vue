<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative h-[80vh]">
      <div class="absolute inset-0">
        <div class="w-full h-full bg-gradient-to-r from-blue-900 to-gray-900">
          <div class="absolute inset-0 bg-black opacity-50"></div>
        </div>
      </div>
      <div class="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 text-center">
          Immobilier de Prestige
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-center">
          Découvrez nos biens d'exception
        </p>
        <!-- Barre de recherche -->
        <div class="w-full max-w-4xl bg-white/95 p-6 rounded-lg shadow-lg">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              v-model="searchFilters.ville"
              type="text" 
              placeholder="Ville"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            >
            <select 
              v-model="searchFilters.type"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
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
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            >
            <button 
              @click="searchAnnonces"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Rechercher
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Annonces -->
    <div class="container mx-auto px-4 py-16">
      <div class="flex justify-between items-center mb-12">
        <h2 class="text-3xl font-bold">Nos Biens d'Exception</h2>
        <button 
          v-if="isFiltered"
          @click="resetSearch" 
          class="text-blue-600 hover:text-blue-800"
        >
          Réinitialiser la recherche
        </button>
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
        <!-- ... reste du code des cartes ... -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { annonceService } from '../services/api'
import PropertyImage from '../components/PropertyImage.vue'


export default {
  name: 'Home',
    components: {
    PropertyImage
},
  setup() {
    const annonces = ref([])
    const loading = ref(true)
    const error = ref(null)
    const searchFilters = ref({
      ville: '',
      type: '',
      prixMax: null
    })

    const isFiltered = computed(() => {
      return searchFilters.value.ville !== '' || 
             searchFilters.value.type !== '' || 
             searchFilters.value.prixMax !== null
    })

    const loadAnnonces = async () => {
      try {
        loading.value = true
        error.value = null
        const data = await annonceService.getAllAnnonces()
        annonces.value = data
      } catch (err) {
        error.value = "Erreur lors du chargement des annonces"
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const searchAnnonces = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Nettoyage des filtres vides
        const filters = Object.entries(searchFilters.value).reduce((acc, [key, value]) => {
          if (value !== '' && value !== null) {
            acc[key] = value
          }
          return acc
        }, {})

        const data = await annonceService.searchAnnonces(filters)
        annonces.value = data
      } catch (err) {
        error.value = "Erreur lors de la recherche"
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const resetSearch = () => {
      searchFilters.value = {
        ville: '',
        type: '',
        prixMax: null
      }
      loadAnnonces()
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    onMounted(loadAnnonces)

    return {
      annonces,
      loading,
      error,
      searchFilters,
      isFiltered,
      searchAnnonces,
      resetSearch,
      formatPrice
    }
  }
}
</script>