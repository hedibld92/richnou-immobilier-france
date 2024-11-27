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
              type="text" 
              placeholder="Ville"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
            <select class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">Type de bien</option>
              <option value="chateau">Château</option>
              <option value="manoir">Manoir</option>
              <option value="villa">Villa</option>
            </select>
            <input 
              type="number" 
              placeholder="Budget max"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
            <button class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Rechercher
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Annonces -->
    <div class="container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold text-center mb-12">Nos Biens d'Exception</h2>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-600 py-12">
        {{ error }}
      </div>

      <!-- Annonces Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="annonce in annonces" :key="annonce._id" 
             class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="relative h-64 bg-gray-200">
            <div class="absolute bottom-4 right-4 bg-black/75 text-white px-4 py-2 rounded">
              {{ formatPrice(annonce.prix) }} €
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">{{ annonce.titre }}</h3>
            <div class="flex items-center text-gray-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              {{ annonce.adresse?.ville }}
            </div>
            
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { annonceService } from '../services/api'

export default {
  name: 'Home',
  setup() {
    const annonces = ref([])
    const loading = ref(true)
    const error = ref(null)

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

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    onMounted(loadAnnonces)

    return {
      annonces,
      loading,
      error,
      formatPrice
    }
  }
}
</script>