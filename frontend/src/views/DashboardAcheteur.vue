<template>
  <div class="min-h-screen bg-gray-50">
    <!-- En-tête -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold">Mes recherches</h1>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="container mx-auto px-4 py-8">
      <!-- Recherches sauvegardées -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Recherches sauvegardées</h2>
            <button
              @click="showSearchModal = true"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Nouvelle recherche
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="search in savedSearches" 
              :key="search.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="font-semibold">{{ search.name }}</h3>
                <div class="space-x-2">
                  <button 
                    @click="editSearch(search)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deleteSearch(search.id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div class="space-y-2 text-sm text-gray-600">
                <p v-if="search.ville">
                  <i class="fas fa-map-marker-alt mr-2"></i>
                  {{ search.ville }}
                </p>
                <p v-if="search.budget">
                  <i class="fas fa-euro-sign mr-2"></i>
                  Budget max: {{ formatPrice(search.budget) }} €
                </p>
                <p v-if="search.type">
                  <i class="fas fa-home mr-2"></i>
                  {{ search.type }}
                </p>
              </div>

              <div class="mt-4 pt-4 border-t">
                <p class="text-sm">
                  <span class="font-semibold">{{ search.matchCount }}</span> 
                  biens correspondent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Biens favoris -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-6">Mes favoris</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="favori in favoris" 
              :key="favori._id"
              class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img 
                :src="favori.photos[0]" 
                :alt="favori.titre"
                class="w-full h-48 object-cover"
              >
              
              <div class="p-4">
                <h3 class="font-semibold mb-2">{{ favori.titre }}</h3>
                <p class="text-lg font-bold text-blue-600 mb-2">
                  {{ formatPrice(favori.prix) }} €
                </p>
                <p class="text-sm text-gray-600 mb-4">
                  {{ favori.adresse.ville }}
                </p>

                <div class="flex justify-between items-center">
                  <router-link 
                    :to="`/annonce/${favori._id}`"
                    class="text-blue-600 hover:underline"
                  >
                    Voir le détail
                  </router-link>
                  <button 
                    @click="removeFavori(favori._id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <i class="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de recherche -->
    <SearchModal
      v-if="showSearchModal"
      :search="selectedSearch"
      @close="closeSearchModal"
      @save="saveSearch"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import SearchModal from '../components/SearchModal.vue'
import { searchService } from '../services/search'
import { favorisService } from '../services/favoris';

export default {
  name: 'DashboardAcheteur',
  components: {
    SearchModal
  },
  setup() {
    const savedSearches = ref([])
    const favoris = ref([])
    const showSearchModal = ref(false)
    const selectedSearch = ref(null)

    const loadSavedSearches = async () => {
      try {
        const data = await searchService.getSavedSearches()
        savedSearches.value = data
      } catch (error) {
        console.error('Erreur lors du chargement des recherches:', error)
      }
    }

    const loadFavoris = async () => {
      try {
        const data = await favorisService.getFavoris()
        favoris.value = data
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error)
      }
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    const editSearch = (search) => {
      selectedSearch.value = search
      showSearchModal.value = true
    }

    const closeSearchModal = () => {
      showSearchModal.value = false
      selectedSearch.value = null
    }

    const saveSearch = async (searchData) => {
      try {
        if (selectedSearch.value) {
          await searchService.updateSearch(selectedSearch.value.id, searchData)
        } else {
          await searchService.createSearch(searchData)
        }
        await loadSavedSearches()
        closeSearchModal()
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
      }
    }

    const deleteSearch = async (searchId) => {
      if (confirm('Voulez-vous vraiment supprimer cette recherche ?')) {
        try {
          await searchService.deleteSearch(searchId)
          await loadSavedSearches()
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
        }
      }
    }

    const removeFavori = async (annonceId) => {
      try {
        await favorisService.removeFavori(annonceId)
        await loadFavoris()
      } catch (error) {
        console.error('Erreur lors de la suppression du favori:', error)
      }
    }

    onMounted(() => {
      loadSavedSearches()
      loadFavoris()
    })

    return {
      savedSearches,
      favoris,
      showSearchModal,
      selectedSearch,
      formatPrice,
      editSearch,
      closeSearchModal,
      saveSearch,
      deleteSearch,
      removeFavori
    }
  }
}
</script>