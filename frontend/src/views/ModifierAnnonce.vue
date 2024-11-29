<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6">Modifier l'annonce</h2>
    
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <form v-else @submit.prevent="submitForm" class="max-w-2xl mx-auto">
      <!-- Titre -->
      <div class="mb-4">
        <label for="titre" class="block text-gray-700 font-bold mb-2">Titre de l'annonce</label>
        <input
          type="text"
          id="titre"
          v-model="formData.titre"
          class="w-full px-3 py-2 border rounded-lg"
          required
        >
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="w-full px-3 py-2 border rounded-lg"
          rows="4"
          required
        ></textarea>
      </div>

      <!-- Prix -->
      <div class="mb-4">
        <label for="prix" class="block text-gray-700 font-bold mb-2">Prix (€)</label>
        <input
          type="number"
          id="prix"
          v-model="formData.prix"
          class="w-full px-3 py-2 border rounded-lg"
          required
        >
      </div>

      <!-- Ville -->
      <div class="mb-4">
        <label for="ville" class="block text-gray-700 font-bold mb-2">Ville</label>
        <input
          type="text"
          id="ville"
          v-model="formData.ville"
          class="w-full px-3 py-2 border rounded-lg"
          required
        >
      </div>

      <!-- Type -->
      <div class="mb-4">
        <label for="type" class="block text-gray-700 font-bold mb-2">Type de bien</label>
        <select
          id="type"
          v-model="formData.type"
          class="w-full px-3 py-2 border rounded-lg"
          required
        >
          <option value="">Sélectionnez un type</option>
          <option value="chateau">Château</option>
          <option value="manoir">Manoir</option>
          <option value="villa">Villa</option>
          <option value="hotel-particulier">Hôtel Particulier</option>
          <option value="loft">Loft</option>
        </select>
      </div>

      <!-- Images -->
      <div class="mb-6">
        <label for="images" class="block text-gray-700 font-bold mb-2">Images</label>
        <input
          type="file"
          id="images"
          @change="handleImageUpload"
          multiple
          accept="image/*"
          class="w-full px-3 py-2 border rounded-lg"
        >
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="mb-4 text-red-500">
        {{ error }}
      </div>

      <!-- Boutons -->
      <div class="flex space-x-4">
        <button
          type="button"
          @click="$router.push('/recherche')"
          class="w-1/2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="w-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          :disabled="loading"
        >
          {{ loading ? 'Modification en cours...' : 'Enregistrer les modifications' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import annonceService from '../services/annonceService';

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const error = ref('');
const formData = ref({
  titre: '',
  description: '',
  prix: '',
  ville: '',
  type: '',
  images: []
});

const loadAnnonce = async () => {
  try {
    const annonce = await annonceService.getAnnonceById(route.params.id);
    Object.keys(formData.value).forEach(key => {
      formData.value[key] = annonce[key];
    });
  } catch (err) {
    error.value = "Erreur lors du chargement de l'annonce";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleImageUpload = (event) => {
  formData.value.images = Array.from(event.target.files);
};

const submitForm = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const formDataToSend = new FormData();
    
    Object.keys(formData.value).forEach(key => {
      if (key === 'images') {
        formData.value.images.forEach(image => {
          formDataToSend.append('images', image);
        });
      } else {
        formDataToSend.append(key, formData.value[key]);
      }
    });

    await annonceService.updateAnnonce(route.params.id, formDataToSend);
    router.push('/recherche');
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de la modification de l'annonce";
    console.error('Erreur:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadAnnonce);
</script>