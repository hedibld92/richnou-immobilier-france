<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">
          {{ search ? 'Modifier la recherche' : 'Nouvelle recherche' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Nom de la recherche -->
        <div>
          <label class="block text-gray-700 mb-2">Nom de la recherche</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ex: Maison centre-ville"
            required
          >
        </div>

        <!-- Critères de recherche -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 mb-2">Ville</label>
            <input
              v-model="form.ville"
              type="text"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ville recherchée"
            >
          </div>

          <div>
            <label class="block text-gray-700 mb-2">Budget maximum</label>
            <input
              v-model.number="form.budget"
              type="number"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Budget max"
            >
          </div>

          <div>
            <label class="block text-gray-700 mb-2">Type de bien</label>
            <select
              v-model="form.type"
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

          <div>
            <label class="block text-gray-700 mb-2">Surface minimum (m²)</label>
            <input
              v-model.number="form.surfaceMin"
              type="number"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Surface minimale"
            >
          </div>
        </div>

        <!-- Critères supplémentaires -->
        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="form.proximiteEcole"
              class="rounded text-blue-600"
            >
            <span>Proche des écoles</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="form.proximiteTransport"
              class="rounded text-blue-600"
            >
            <span>Proche des transports</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="form.proximiteCommerce"
              class="rounded text-blue-600"
            >
            <span>Proche des commerces</span>
          </label>
        </div>

        <!-- Boutons -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            :disabled="loading"
          >
            {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'SearchModal',
  props: {
    search: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const loading = ref(false)
    const form = ref({
      name: '',
      ville: '',
      budget: null,
      type: '',
      surfaceMin: null,
      proximiteEcole: false,
      proximiteTransport: false,
      proximiteCommerce: false
    })

    onMounted(() => {
      if (props.search) {
        form.value = { ...props.search }
      }
    })

    const handleSubmit = async () => {
      try {
        loading.value = true
        emit('save', form.value)
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleSubmit
    }
  }
}
</script>
