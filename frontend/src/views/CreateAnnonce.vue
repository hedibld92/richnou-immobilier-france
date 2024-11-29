<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Créer une nouvelle annonce</h1>

    <form @submit.prevent="submitAnnonce" class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Titre -->
        <div class="col-span-2">
          <label class="block text-gray-700 mb-2">Titre de l'annonce*</label>
          <input
            v-model="annonce.titre"
            type="text"
            required
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- Type de bien -->
        <div>
          <label class="block text-gray-700 mb-2">Type de bien*</label>
          <select
            v-model="annonce.type"
            required
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un type</option>
            <option value="chateau">Château</option>
            <option value="manoir">Manoir</option>
            <option value="villa">Villa</option>
            <option value="hotel-particulier">Hôtel Particulier</option>
            <option value="loft">Loft</option>
          </select>
        </div>

        <!-- Prix -->
        <div>
          <label class="block text-gray-700 mb-2">Prix*</label>
          <input
            v-model.number="annonce.prix"
            type="number"
            required
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- Surface -->
        <div>
          <label class="block text-gray-700 mb-2">Surface (m²)*</label>
          <input
            v-model.number="annonce.surface"
            type="number"
            required
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- Pièces -->
        <div>
          <label class="block text-gray-700 mb-2">Nombre de pièces*</label>
          <input
            v-model.number="annonce.pieces"
            type="number"
            required
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- Ville -->
        <div class="col-span-2">
          <label class="block text-gray-700 mb-2">Ville*</label>
          <input
            v-model="annonce.ville"
            type="text"
            required
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- Description -->
        <div class="col-span-2">
          <label class="block text-gray-700 mb-2">Description*</label>
          <textarea
            v-model="annonce.description"
            rows="4"
            required
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Images -->
        <div class="col-span-2">
          <label class="block text-gray-700 mb-2">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            @change="handleImageUpload"
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
          <!-- Prévisualisation des images -->
          <div v-if="imageUrls.length" class="mt-4 grid grid-cols-3 gap-4">
            <div v-for="(url, index) in imageUrls" :key="index" class="relative">
              <img :src="url" class="w-full h-32 object-cover rounded">
              <button
                @click="removeImage(index)"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                type="button"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="mt-4 text-red-600">
        {{ error }}
      </div>

      <!-- Boutons -->
      <div class="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          @click="$router.push('/dashboard-vendeur')"
          class="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Publication...' : 'Publier l\'annonce' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'CreateAnnonce',
  
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref('')
    const imageFiles = ref([])
    const imageUrls = ref([])
    
    const annonce = ref({
      titre: '',
      type: '',
      prix: null,
      surface: null,
      pieces: null,
      ville: '',
      description: '',
    })

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files)
      imageFiles.value = files
      
      // Prévisualisation des images
      imageUrls.value = files.map(file => URL.createObjectURL(file))
    }

    const removeImage = (index) => {
      imageFiles.value.splice(index, 1)
      imageUrls.value.splice(index, 1)
    }

    const submitAnnonce = async () => {
      try {
        loading.value = true
        error.value = ''

        const formData = new FormData()
        
        // Ajout des données de l'annonce
        Object.keys(annonce.value).forEach(key => {
          formData.append(key, annonce.value[key])
        })
        
        // Ajout des images
        imageFiles.value.forEach(file => {
          formData.append('images', file)
        })

        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:3000/api/annonces', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log('Annonce créée:', response.data)
        router.push('/dashboard-vendeur')
      } catch (err) {
        console.error('Erreur:', err)
        error.value = err.response?.data?.message || "Une erreur est survenue lors de la création de l'annonce"
      } finally {
        loading.value = false
      }
    }

    return {
      annonce,
      loading,
      error,
      imageUrls,
      handleImageUpload,
      removeImage,
      submitAnnonce
    }
  }
}
</script>