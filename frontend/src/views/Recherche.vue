<template>
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-8">Recherche avancée</h1>
    
    <!-- Filtres de recherche -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-gray-700 mb-2">Ville</label>
          <input
            v-model="filters.ville"
            type="text"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Entrez une ville"
          >
        </div>

        <div>
          <label class="block text-gray-700 mb-2">Type de bien</label>
          <select
            v-model="filters.type"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Tous les types</option>
            <option value="chateau">Château</option>
            <option value="manoir">Manoir</option>
            <option value="villa">Villa</option>
            <option value="hotel-particulier">Hôtel Particulier</option>
            <option value="loft">Loft</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 mb-2">Budget maximum</label>
          <input
            v-model.number="filters.prixMax"
            type="number"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Budget max"
          >
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-4">
        <button
          @click="resetFilters"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Réinitialiser
        </button>
        <button
          @click="searchAnnonces"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Rechercher
        </button>
      </div>
    </div>

    <!-- Résultats -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600 py-12">
      {{ error }}
    </div>

    <div v-else-if="annonces.length === 0" class="text-center py-12">
      <p class="text-gray-600 text-xl">Aucun bien ne correspond à vos critères</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Cartes des annonces -->
      <div v-for="annonce in annonces" :key="annonce._id" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="relative h-64">
          <img 
            :src="annonce.photos?.[0] || '/images/property-placeholder.jpg'" 
            :alt="annonce.titre"
            class="w-full h-full object-cover"
          >
          <div class="absolute bottom-4 right-4 bg-black/75 text-white px-4 py-2 rounded">
            {{ formatPrice(annonce.prix) }} €
          </div>
        </div>
        
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">{{ annonce.titre }}</h3>
          <p class="text-gray-600 mb-4">{{ annonce.adresse.ville }}</p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="(carac, index) in annonce.caracteristiques?.slice(0,3)" 
                  :key="index"
                  class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {{ carac }}
            </span>
          </div>

          <router-link 
            :to="'/annonce/' + annonce._id"
            class="block w-full text-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir le détail
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { annonceService } from '../services/api'


export default {
  name: 'Recherche',
  setup() {
    const annonces = ref([])
    const loading = ref(false)
    const error = ref(null)
    const filters = ref({
      ville: '',
      type: '',
      prixMax: null
    })

    const searchAnnonces = async () => {
      try {
        loading.value = true
        error.value = null
        const data = await annonceService.searchAnnonces(filters.value)
        annonces.value = data
      } catch (err) {
        error.value = "Erreur lors de la recherche"
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const resetFilters = () => {
      filters.value = {
        ville: '',
        type: '',
        prixMax: null
      }
      searchAnnonces()
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    // Charger les annonces au montage
    searchAnnonces()

    return {
      annonces,
      loading,
      error,
      filters,
      searchAnnonces,
      resetFilters,
      formatPrice
    }
  }
}
</script>