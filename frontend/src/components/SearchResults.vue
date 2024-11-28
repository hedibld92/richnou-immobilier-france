<template>
  <div class="space-y-8">
    <!-- Filtres et tri -->
    <div class="flex justify-between items-center">
      <div class="flex space-x-4">
        <select 
          v-model="sortBy"
          class="px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
          <option value="date-desc">Plus récentes</option>
          <option value="surface-desc">Plus grande surface</option>
        </select>
      </div>
      
      <p class="text-gray-600">
        {{ totalResults }} résultat{{ totalResults > 1 ? 's' : '' }} trouvé{{ totalResults > 1 ? 's' : '' }}
      </p>
    </div>

    <!-- Liste des résultats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="annonce in sortedResults" 
        :key="annonce._id"
        class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      >
        <!-- Image principale -->
        <div class="relative h-64">
          <img 
            :src="annonce.photos[0]"
            :alt="annonce.titre"
            class="w-full h-full object-cover"
          >
          <button 
            @click="toggleFavori(annonce._id)"
            class="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
          >
            <i 
              class="fas fa-heart"
              :class="{ 'text-red-600': isFavori(annonce._id), 'text-gray-400': !isFavori(annonce._id) }"
            ></i>
          </button>
        </div>

        <!-- Informations -->
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">{{ annonce.titre }}</h3>
            <p class="text-2xl font-bold text-blue-600">
              {{ formatPrice(annonce.prix) }} €
            </p>
          </div>

          <div class="space-y-2 mb-4">
            <p class="text-gray-600">
              <i class="fas fa-map-marker-alt mr-2"></i>
              {{ annonce.adresse.ville }}
            </p>
            <p class="text-gray-600">
              <i class="fas fa-ruler-combined mr-2"></i>
              {{ annonce.surface }} m²
            </p>
          </div>

          <!-- Services de proximité -->
          <div class="border-t pt-4 mb-4">
            <div class="flex flex-wrap gap-2">
              <span 
                v-if="annonce.proximite.ecole"
                class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                École à proximité
              </span>
              <span 
                v-if="annonce.proximite.transport"
                class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                Transport en commun
              </span>
              <span 
                v-if="annonce.proximite.commerce"
                class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                Commerces
              </span>
              <span 
                v-if="annonce.proximite.espaceVert"
                class="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
              >
                Espace vert
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center">
            <router-link 
              :to="`/annonce/${annonce._id}`"
              class="text-blue-600 hover:underline"
            >
              Voir le détail
            </router-link>
            <button
              @click="contactAgent(annonce)"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Contacter l'agent
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center space-x-2">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-4 py-2 rounded',
          currentPage === page 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { favorisService } from '../services/favoris'

export default {
  name: 'SearchResults',
  props: {
    results: {
      type: Array,
      required: true
    },
    totalResults: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const sortBy = ref('prix-asc')
    const currentPage = ref(1)
    const itemsPerPage = 9
    const favoris = ref([])

    const loadFavoris = async () => {
      try {
        const data = await favorisService.getFavoris()
        favoris.value = data.map(f => f._id)
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error)
      }
    }

    const sortedResults = computed(() => {
      let sorted = [...props.results]
      switch (sortBy.value) {
        case 'prix-asc':
          sorted.sort((a, b) => a.prix - b.prix)
          break
        case 'prix-desc':
          sorted.sort((a, b) => b.prix - a.prix)
          break
        case 'date-desc':
          sorted.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
          break
        case 'surface-desc':
          sorted.sort((a, b) => b.surface - a.surface)
          break
      }
      return sorted
    })

    const totalPages = computed(() => {
      return Math.ceil(props.totalResults / itemsPerPage)
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    const changePage = (page) => {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const toggleFavori = async (annonceId) => {
      try {
        if (isFavori(annonceId)) {
          await favorisService.removeFavori(annonceId)
          favoris.value = favoris.value.filter(id => id !== annonceId)
        } else {
          await favorisService.addFavori(annonceId)
          favoris.value.push(annonceId)
        }
      } catch (error) {
        console.error('Erreur lors de la gestion des favoris:', error)
      }
    }

    const isFavori = (annonceId) => {
      return favoris.value.includes(annonceId)
    }

    const contactAgent = (annonce) => {
      router.push({
        name: 'Contact',
        query: { 
          ref: annonce._id,
          titre: annonce.titre
        }
      })
    }

    watch(sortBy, () => {
      currentPage.value = 1
    })

    // Charger les favoris au montage
    loadFavoris()

    return {
      sortBy,
      currentPage,
      totalPages,
      sortedResults,
      formatPrice,
      changePage,
      toggleFavori,
      isFavori,
      contactAgent
    }
  }
}
</script>