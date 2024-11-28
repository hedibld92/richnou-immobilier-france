<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-6">Inscription</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Type de compte -->
        <div>
          <label class="block text-gray-700 mb-2">Type de compte</label>
          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              @click="form.role = 'acheteur'"
              :class="[
                'p-4 rounded-lg border-2 text-center',
                form.role === 'acheteur'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              ]"
            >
              <span class="block font-semibold">Acheteur</span>
              <span class="text-sm text-gray-600">Je cherche un bien</span>
            </button>
            <button
              type="button"
              @click="form.role = 'vendeur'"
              :class="[
                'p-4 rounded-lg border-2 text-center',
                form.role === 'vendeur'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              ]"
            >
              <span class="block font-semibold">Vendeur</span>
              <span class="text-sm text-gray-600">Je vends des biens</span>
            </button>
          </div>
        </div>

        <!-- Informations personnelles -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 mb-2" for="nom">Nom</label>
            <input
              type="text"
              id="nom"
              v-model="form.nom"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
          </div>
          <div>
            <label class="block text-gray-700 mb-2" for="prenom">Prénom</label>
            <input
              type="text"
              id="prenom"
              v-model="form.prenom"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
          </div>
        </div>

        <!-- Email et téléphone -->
        <div>
          <label class="block text-gray-700 mb-2" for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
        </div>

        <div>
          <label class="block text-gray-700 mb-2" for="telephone">Téléphone</label>
          <input
            type="tel"
            id="telephone"
            v-model="form.telephone"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
        </div>

        <!-- Champs spécifiques vendeur -->
        <template v-if="form.role === 'vendeur'">
          <div>
            <label class="block text-gray-700 mb-2" for="societe">Société</label>
            <input
              type="text"
              id="societe"
              v-model="form.societe"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
          </div>
          <div>
            <label class="block text-gray-700 mb-2" for="siret">SIRET</label>
            <input
              type="text"
              id="siret"
              v-model="form.siret"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
          </div>
        </template>

        <!-- Mot de passe -->
        <div>
          <label class="block text-gray-700 mb-2" for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <!-- Bouton de soumission -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="loading"
        >
          <span v-if="loading">Création du compte...</span>
          <span v-else>Créer mon compte</span>
        </button>

        <p class="text-center text-gray-600">
          Déjà inscrit ?
          <router-link to="/login" class="text-blue-600 hover:underline">
            Connectez-vous
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const form = ref({
      email: '',
      password: '',
      nom: '',
      prenom: '',
      role: 'acheteur'
    });
    const error = ref('');
    const loading = ref(false); // Ajoutez cette ligne

    const handleSubmit = async () => {
      loading.value = true; // Ajoutez cette ligne
      try {
        await authService.register(form.value);
        router.push('/dashboard-acheteur');
      } catch (err) {
        error.value = err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription';
      } finally {
        loading.value = false; // Ajoutez cette ligne
      }
    };

    return {
      form,
      error,
      handleSubmit,
      loading // Ajoutez cette ligne
    };
  }
};
</script>