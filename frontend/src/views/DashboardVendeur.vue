<template>
  <div class="min-h-screen bg-gray-50">
    <!-- En-tête -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold">Tableau de bord Vendeur</h1>
          <button
            @click="showNewAnnonceModal = true"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nouvelle annonce
          </button>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="container mx-auto px-4 py-8">
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-600 mb-2">Annonces actives</h3>
          <p class="text-3xl font-bold">{{ stats.activeListings }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-600 mb-2">Vues totales</h3>
          <p class="text-3xl font-bold">{{ stats.totalViews }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-600 mb-2">Contacts reçus</h3>
          <p class="text-3xl font-bold">{{ stats.totalContacts }}</p>
        </div>
      </div>

      <!-- Liste des annonces -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">Mes annonces</h2>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left border-b">
                  <th class="pb-4">Titre</th>
                  <th class="pb-4">Prix</th>
                  <th class="pb-4">Statut</th>
                  <th class="pb-4">Vues</th>
                  <th class="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="annonce in annonces" :key="annonce._id" class="border-b">
                  <td class="py-4">{{ annonce.titre }}</td>
                  <td>{{ formatPrice(annonce.prix) }} €</td>
                  <td>
                    <span 
                      :class="{
                        'px-3 py-1 rounded-full text-sm': true,
                        'bg-green-100 text-green-800': annonce.statut === 'disponible',
                        'bg-yellow-100 text-yellow-800': annonce.statut === 'option',
                        'bg-gray-100 text-gray-800': annonce.statut === 'vendu'
                      }"
                    >
                      {{ annonce.statut }}
                    </span>
                  </td>
                  <td>{{ annonce.vues || 0 }}</td>
                  <td class="space-x-2">
                    <button
                      @click="editAnnonce(annonce)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      Modifier
                    </button>
                    <button
                      @click="toggleAnnonceStatus(annonce)"
                      class="text-red-600 hover:text-red-800"
                    >
                      {{ annonce.statut === 'disponible' ? 'Désactiver' : 'Activer' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal nouvelle annonce -->
    <AnnonceModal
      v-if="showNewAnnonceModal"
      :annonce="selectedAnnonce"
      @close="closeModal"
      @save="saveAnnonce"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const savedSearches = ref([]);
    const favoris = ref([]);
    const error = ref('');

    const loadSavedSearches = async () => {
      try {
        const response = await axios.get('/api/searches', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        savedSearches.value = response.data;
      } catch (err) {
        console.error('Erreur lors du chargement des recherches:', err);
        error.value = 'Impossible de charger les recherches sauvegardées';
      }
    };

    const loadFavoris = async () => {
      try {
        const response = await axios.get('/api/favoris', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        favoris.value = response.data;
      } catch (err) {
        console.error('Erreur lors du chargement des favoris:', err);
        error.value = 'Impossible de charger les favoris';
      }
    };

    onMounted(() => {
      loadSavedSearches();
      loadFavoris();
    });

    return {
      savedSearches,
      favoris,
      error
    };
  }
};
</script>