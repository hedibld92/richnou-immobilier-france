<template>
  <div class="container mx-auto px-4 py-16">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600 py-12">
      {{ error }}
    </div>

    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="relative h-[60vh]">
        <img 
          :src="annonce.photos?.[0] || '/images/property-placeholder.jpg'" 
          :alt="annonce.titre"
          class="w-full h-full object-cover"
        >
      </div>

      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <h1 class="text-4xl font-bold">{{ annonce.titre }}</h1>
          <div class="text-3xl font-bold text-blue-600">
            {{ formatPrice(annonce.prix) }} €
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 class="text-2xl font-semibold mb-4">Description</h2>
            <p class="text-gray-600">{{ annonce.description }}</p>

            <h2 class="text-2xl font-semibold mt-8 mb-4">Caractéristiques</h2>
            <div class="flex flex-wrap gap-3">
              <span 
                v-for="(carac, index) in annonce.caracteristiques" 
                :key="index"
                class="bg-gray-100 text-gray-700 px-4 py-2 rounded-full"
              >
                {{ carac }}
              </span>
            </div>
          </div>

          <div>
            <h2 class="text-2xl font-semibold mb-4">Localisation</h2>
            <div class="bg-gray-100 p-6 rounded-lg">
              <p class="mb-2"><strong>Ville:</strong> {{ annonce.adresse.ville }}</p>
              <p class="mb-2"><strong>Code postal:</strong> {{ annonce.adresse.codePostal }}</p>
              <p v-if="annonce.adresse.rue"><strong>Rue:</strong> {{ annonce.adresse.rue }}</p>
            </div>

            <div class="mt-8">
              <h2 class="text-2xl font-semibold mb-4">Contact</h2>
              <button
                @click="contactAgent"
                class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contacter l'agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { annonceService } from '../services/api'

export default {
  name: 'AnnonceDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const annonce = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const loadAnnonce = async () => {
      try {
        loading.value = true
        error.value = null
        const data = await annonceService.getAnnonceById(route.params.id)
        annonce.value = data
      } catch (err) {
        error.value = "Erreur lors du chargement de l'annonce"
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const contactAgent = () => {
      router.push('/contact')
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR').format(price)
    }

    onMounted(loadAnnonce)

    return {
      annonce,
      loading,
      error,
      contactAgent,
      formatPrice
    }
  }
}
</script>