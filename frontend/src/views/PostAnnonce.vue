<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6">Poster une annonce</h2>
    
    <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto">
      <!-- Titre -->
      <div class="mb-4">
        <label for="titre" class="block text-gray-700 font-bold mb-2">Titre de l'annonce</label>
        <input
          type="text"
          id="titre"
          v-model="form.titre"
          class="w-full px-3 py-2 border rounded-lg"
          required
        >
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
        <textarea
          id="description"
          v-model="form.description"
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
          v-model="form.prix"
          class="w-full px-3 py-2 border rounded-lg"
          required
        >
      </div>

      <!-- Localisation -->
      <div class="mb-4">
        <label for="localisation" class="block text-gray-700 font-bold mb-2">Localisation</label>
        <input
          type="text"
          id="localisation"
          v-model="form.localisation"
          class="w-full px-3 py-2 border rounded-lg"
          required
        >
      </div>

      <!-- Surface -->
      <div class="mb-4">
        <label for="surface" class="block text-gray-700 font-bold mb-2">Surface (m²)</label>
        <input
          type="number"
          id="surface"
          v-model="form.surface"
          class="w-full px-3 py-2 border rounded-lg"
          required
        >
      </div>

      <!-- Nombre de pièces -->
      <div class="mb-4">
        <label for="pieces" class="block text-gray-700 font-bold mb-2">Nombre de pièces</label>
        <input
          type="number"
          id="pieces"
          v-model="form.pieces"
          class="w-full px-3 py-2 border rounded-lg"
          required
        >
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

      <!-- Bouton de soumission -->
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        :disabled="loading"
      >
        {{ loading ? 'Publication en cours...' : 'Publier l\'annonce' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'PostAnnonce',
  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = ref(false);
    const error = ref('');
    const form = ref({
      titre: '',
      description: '',
      prix: '',
      localisation: '',
      surface: '',
      pieces: '',
      images: []
    });

    const handleImageUpload = (event) => {
      const files = event.target.files;
      form.value.images = Array.from(files);
    };

    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';

      try {
        const formData = new FormData();
        Object.keys(form.value).forEach(key => {
          if (key === 'images') {
            form.value.images.forEach(image => {
              formData.append('images', image);
            });
          } else {
            formData.append(key, form.value[key]);
          }
        });

        await store.dispatch('postAnnonce', formData);
        router.push('/mes-annonces'); // Redirige vers la liste des annonces du vendeur
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de la publication de l\'annonce';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      error,
      handleSubmit,
      handleImageUpload
    };
  }
};
</script>