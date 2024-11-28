<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <!-- Message d'erreur -->
        <div v-if="error" class="text-red-500 text-center">
          {{ error }}
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <!-- Bouton de connexion -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </div>
      </form>

      <!-- Lien vers l'inscription -->
      <div class="text-center">
        <router-link to="/register" class="text-indigo-600 hover:text-indigo-500">
          Pas encore de compte ? S'inscrire
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { authService } from '../services/auth';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const store = useStore();
    const loading = ref(false);
    const error = ref('');
    const form = ref({
      email: '',
      password: ''
    });

    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';

      try {
        const response = await authService.login(form.value);
        
        // Stockage des informations de l'utilisateur
        store.commit('setUser', response.user);
        store.commit('setToken', response.token);

        // Redirection en fonction du rôle
        if (response.user.role === 'vendeur') {
          router.push('/dashboard-vendeur');
        } else {
          router.push('/dashboard-acheteur');
        }
      } catch (err) {
        console.error('Erreur de connexion:', err);
        error.value = err.response?.data?.message || 'Erreur lors de la connexion';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      error,
      handleSubmit
    };
  }
};
</script>