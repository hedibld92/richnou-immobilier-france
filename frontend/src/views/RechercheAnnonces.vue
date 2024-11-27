<template>
  <div class="recherche-container">
    <h1>Recherche de biens d'exception</h1>
    
    <div class="filtres">
      <div class="filtre">
        <label>Type de bien</label>
        <select v-model="filtres.type">
          <option value="">Tous les types</option>
          <option value="chateau">Château</option>
          <option value="loft">Loft</option>
          <option value="manoir">Manoir</option>
          <option value="hotel-particulier">Hôtel Particulier</option>
        </select>
      </div>

      <div class="filtre">
        <label>Ville</label>
        <input type="text" v-model="filtres.ville" placeholder="Entrez une ville">
      </div>

      <div class="filtre">
        <label>Prix</label>
        <input type="number" v-model="filtres.prixMin" placeholder="Prix minimum">
        <input type="number" v-model="filtres.prixMax" placeholder="Prix maximum">
      </div>

      <button @click="rechercher">Rechercher</button>
    </div>

    <div class="resultats" v-if="annonces.length">
      <div v-for="annonce in annonces" :key="annonce._id" class="annonce-card">
        <img :src="annonce.photos[0] || '/placeholder.jpg'" :alt="annonce.titre">
        <div class="annonce-info">
          <h3>{{ annonce.titre }}</h3>
          <p class="type">{{ annonce.type }}</p>
          <p class="prix">{{ annonce.prix.toLocaleString() }} €</p>
          <p class="ville">{{ annonce.adresse.ville }}</p>
          <router-link :to="'/annonce/' + annonce._id" class="voir-detail">
            Voir le détail
          </router-link>
        </div>
      </div>
    </div>
    <p v-else>Aucune annonce trouvée</p>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import axios from 'axios'

export default {
  name: 'RechercheAnnonces',
  setup() {
    const annonces = ref([])
    const filtres = reactive({
      type: '',
      ville: '',
      prixMin: '',
      prixMax: ''
    })

    const rechercher = async () => {
      try {
        const params = {}
        if (filtres.type) params.type = filtres.type
        if (filtres.ville) params.ville = filtres.ville
        if (filtres.prixMin) params.prix_min = filtres.prixMin
        if (filtres.prixMax) params.prix_max = filtres.prixMax

        const response = await axios.get('http://localhost:3000/api/annonces/search', { params })
        annonces.value = response.data
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
      }
    }

    return {
      annonces,
      filtres,
      rechercher
    }
  }
}
</script>

<style scoped>
.recherche-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filtres {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.filtre {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filtre label {
  font-weight: bold;
}

.filtre input, .filtre select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.resultats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.annonce-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.annonce-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.annonce-info {
  padding: 15px;
}

.voir-detail {
  display: inline-block;
  padding: 8px 16px;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 10px;
}
</style>