<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <form @submit.prevent="handleSearch" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Ville -->
        <div>
          <label class="block text-gray-700 mb-2">Ville</label>
          <input
            v-model="searchParams.ville"
            type="text"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Entrez une ville"
          >
        </div>

        <!-- Type de bien -->
        <div>
          <label class="block text-gray-700 mb-2">Type de bien</label>
          <select
            v-model="searchParams.type"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Tous les types</option>
            <option value="chateau">Château</option>
            <option value="manoir">Manoir</option>
            <option value="hotel-particulier">Hôtel Particulier</option>
            <option value="villa">Villa</option>
            <option value="loft">Loft</option>
          </select>
        </div>

        <!-- Budget -->
        <div>
          <label class="block text-gray-700 mb-2">Budget maximum</label>
          <input
            v-model.number="searchParams.prixMax"
            type="number"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Budget max"
          >
        </div>

        <!-- Surface -->
        <div>
          <label class="block text-gray-700 mb-2">Surface minimum (m²)</label>
          <input
            v-model.number="searchParams.surfaceMin"
            type="number"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Surface min"
          >
        </div>
      </div>

      <!-- Critères supplémentaires -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold mb-4">Critères supplémentaires</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="searchParams.proximiteEcole"
              class="rounded text-blue-600"
            >
            <span>Proche des écoles</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="searchParams.proximiteTransport"
              class="rounded text-blue-600"
            >
            <span>Proche des transports</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="searchParams.proximiteCommerce"
              class="rounded text-blue-600"
            >
            <span>Proche des commerces</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="searchParams.espaceVert"
              class="rounded text-blue-600"
            >
            <span>Espaces verts</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center pt-6 border-t">
        <button
          type="button"
          @click="resetSearch"
          class="text-gray-600 hover:text-gray-800"
        >
          Réinitialiser
        </button>
        <div class="space-x-4">
          <button
            type="button"
            @click="saveSearch"
            class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            Sauvegarder la recherche
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Rechercher
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { searchService } from '../services/search'

export default {
  name: 'AdvancedSearch',
  emits: ['search'],
  setup(props, { emit }) {
    const searchParams = ref({
      ville: '',
      type: '',
      prixMax: null,
      surfaceMin: null,
      proximiteEcole: false,
      proximiteTransport: false,
      proximiteCommerce: false,
      espaceVert: false
    })

    const handleSearch = () => {
      emit('search', searchParams.value)
    }

    const resetSearch = () => {
      searchParams.value = {
        ville: '',
        type: '',
        prixMax: null,
        surfaceMin: null,
        proximiteEcole: false,
        proximiteTransport: false,
        proximiteCommerce: false,
        espaceVert: false
      }
    }

    const saveSearch = async () => {
      try {
        await searchService.createSearch({
          ...searchParams.value,
          name: `Recherche ${new Date().toLocaleDateString()}`
        })
        alert('Recherche sauvegardée avec succès')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
        alert('Erreur lors de la sauvegarde de la recherche')
      }
    }

    return {
      searchParams,
      handleSearch,
      resetSearch,
      saveSearch
    }
  }
}
</script>