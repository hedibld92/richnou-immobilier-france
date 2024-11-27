<template>
  <div class="detail-container" v-if="annonce">
    <h1>{{ annonce.titre }}</h1>
    
    <div class="annonce-content">
      <div class="photos-section">
        <img :src="annonce.photos[0] || '/placeholder.jpg'" :alt="annonce.titre">
      </div>

      <div class="info-section">
        <div class="prix">{{ annonce.prix.toLocaleString() }} €</div>
        <div class="type">{{ annonce.type }}</div>
        <div class="adresse">
          {{ annonce.adresse.ville }}, {{ annonce.adresse.codePostal }}
        </div>
        
        <div class="caracteristiques">
          <h3>Caractéristiques</h3>
          <ul>
            <li v-for="carac in annonce.caracteristiques" :key="carac">
              {{ carac }}
            </li>
          </ul>
        </div>

        <div class="description">
          <h3>Description</h3>
          <p>{{ annonce.description }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Chargement...</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'DetailAnnonce',
  setup() {
    const route = useRoute()
    const annonce = ref(null)

    const fetchAnnonce = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/annonces/${route.params.id}`)
        annonce.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement de l\'annonce:', error)
      }
    }

    onMounted(fetchAnnonce)

    return {
      annonce
    }
  }
}
</script>

<style scoped>
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.annonce-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.photos-section img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.info-section {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.prix {
  font-size: 24px;
  font-weight: bold;
  color: #42b983;
  margin-bottom: 10px;
}

.type {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}

.caracteristiques ul {
  list-style: none;
  padding: 0;
}

.caracteristiques li {
  margin: 5px 0;
}

.description {
  margin-top: 20px;
}
</style>