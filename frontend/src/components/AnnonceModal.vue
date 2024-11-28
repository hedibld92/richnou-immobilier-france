<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">
            {{ annonce ? 'Modifier l\'annonce' : 'Nouvelle annonce' }}
          </h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Informations principales -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 mb-2">Titre</label>
              <input
                v-model="form.titre"
                type="text"
                class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
            </div>

            <div>
              <label class="block text-gray-700 mb-2">Type de bien</label>
              <select
                v-model="form.type"
                class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="chateau">Château</option>
                <option value="manoir">Manoir</option>
                <option value="hotel-particulier">Hôtel Particulier</option>
                <option value="villa">Villa</option>
                <option value="loft">Loft</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 mb-2">Prix</label>
              <input
                v-model.number="form.prix"
                type="number"
                class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
            </div>

            <div>
              <label class="block text-gray-700 mb-2">Surface (m²)</label>
              <input
                v-model.number="form.surface"
                type="number"
                class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
            </div>
          </div>

          <!-- Adresse -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Adresse</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="block text-gray-700 mb-2">Rue</label>
                <input
                  v-model="form.adresse.rue"
                  type="text"
                  class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
              </div>
              <div>
                <label class="block text-gray-700 mb-2">Code postal</label>
                <input
                  v-model="form.adresse.codePostal"
                  type="text"
                  class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
              </div>
              <div class="md:col-span-3">
                <label class="block text-gray-700 mb-2">Ville</label>
                <input
                  v-model="form.adresse.ville"
                  type="text"
                  class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-gray-700 mb-2">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            ></textarea>
          </div>

          <!-- Caractéristiques -->
          <div>
            <label class="block text-gray-700 mb-2">Caractéristiques</label>
            <div class="space-y-2">
              <div v-for="(carac, index) in form.caracteristiques" :key="index" class="flex gap-2">
                <input
                  v-model="form.caracteristiques[index]"
                  type="text"
                  class="flex-1 px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                <button 
                  type="button"
                  @click="removeCaracteristique(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <button
                type="button"
                @click="addCaracteristique"
                class="text-blue-600 hover:text-blue-800"
              >
                + Ajouter une caractéristique
              </button>
            </div>
          </div>

          <!-- Photos -->
          <div>
            <label class="block text-gray-700 mb-2">Photos</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(photo, index) in form.photos"
                :key="index"
                class="relative aspect-square"
              >
                <img
                  :src="photo"
                  class="w-full h-full object-cover rounded"
                >
                <button
                  type="button"
                  @click="removePhoto(index)"
                  class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div
                class="border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500"
                @click="triggerFileInput"
              >
                <i class="fas fa-plus text-gray-400"></i>
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  accept="image/*"
                  multiple
                  @change="handleFileUpload"
                >
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'AnnonceModal',
  props: {
    annonce: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const form = ref({
      titre: '',
      type: 'chateau',
      prix: null,
      surface: null,
      adresse: {
        rue: '',
        codePostal: '',
        ville: ''
      },
      description: '',
      caracteristiques: [],
      photos: []
    })
    const loading = ref(false)
    const fileInput = ref(null)

    onMounted(() => {
      if (props.annonce) {
        form.value = { ...props.annonce }
      }
    })

    const addCaracteristique = () => {
      form.value.caracteristiques.push('')
    }

    const removeCaracteristique = (index) => {
      form.value.caracteristiques.splice(index, 1)
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileUpload = async (event) => {
      const files = Array.from(event.target.files)
      for (const file of files) {
        try {
          const formData = new FormData()
          formData.append('image', file)
          // Ici, vous devrez implémenter le service d'upload d'images
          const response = await uploadImage(formData)
          form.value.photos.push(response.url)
        } catch (error) {
          console.error('Erreur lors de l\'upload:', error)
        }
      }
    }

    const removePhoto = (index) => {
      form.value.photos.splice(index, 1)
    }

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
      fileInput,
      addCaracteristique,
      removeCaracteristique,
      triggerFileInput,
      handleFileUpload,
      removePhoto,
      handleSubmit
    }
  }
}
</script>