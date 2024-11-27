<template>
  <div class="gestion-container">
    <h1>Gestion des Annonces</h1>
    
    <button @click="showForm = true" class="add-btn">
      Ajouter une annonce
    </button>

    <div v-if="showForm" class="form-container">
      <h2>{{ editingAnnonce ? 'Modifier' : 'Ajouter' }} une annonce</h2>
      <form @submit.prevent="saveAnnonce">
        <div class="form-group">
          <label>Titre</label>
          <input v-model="formData.titre" required>
        </div>

        <div class="form-group">
          <label>Type de bien</label>
          <select v-model="formData.type" required>
            <option value="chateau">Château</option>
            <option value="loft">Loft</option>
            <option value="manoir">Manoir</option>
            <option value="hotel-particulier">Hôtel Particulier</option>
          </select>
        </div>

        <div class="form-group">
          <label>Prix</label>
          <input type="number" v-model="formData.prix" required>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="formData.description" required></textarea>
        </div>

        <div class="form-actions">
          <button type="submit">{{ editingAnnonce ? 'Modifier' : 'Ajouter' }}</button>
          <button type="button" @click="cancelForm">Annuler</button>
        </div>
      </form>
    </div>

    <div class="annonces-list">
      <div v-for="annonce in annonces" :key="annonce._id" class="annonce-item">
        <h3>{{ annonce.titre }}</h3>
        <p>{{ annonce.prix.toLocaleString() }} €</p>
        <p>{{ annonce.type }}</p>
        <div class="actions">
          <button @click="editAnnonce(annonce)">Modifier</button>
          <button @click="toggleStatus(annonce)" :class="annonce.statut">
            {{ annonce.statut === 'active' ? 'Désactiver' : 'Activer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import axios from 'axios'

export default {
  name: 'GestionAnnonces',
  setup() {
    const annonces = ref([])
    const showForm = ref(false)
    const editingAnnonce = ref(null)
    const formData = reactive({
      titre: '',
      type: '',
      prix: '',
      description: ''
    })

    const fetchAnnonces = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/annonces')
        annonces.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error)
      }
    }

    const saveAnnonce = async () => {
      try {
        if (editingAnnonce.value) {
          await axios.put(`http://localhost:3000/api/annonces/${editingAnnonce.value._id}`, formData)
        } else {
          await axios.post('http://localhost:3000/api/annonces', formData)
        }
        await fetchAnnonces()
        cancelForm()
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
      }
    }

    const editAnnonce = (annonce) => {
      editingAnnonce.value = annonce
      Object.assign(formData, annonce)
      showForm.value = true
    }

    const toggleStatus = async (annonce) => {
      try {
        await axios.put(`http://localhost:3000/api/annonces/${annonce._id}/status`, {
          statut: annonce.statut === 'active' ? 'inactive' : 'active'
        })
        await fetchAnnonces()
      } catch (error) {
        console.error('Erreur lors du changement de statut:', error)
      }
    }

    const cancelForm = () => {
      showForm.value = false
      editingAnnonce.value = null
      Object.keys(formData).forEach(key => formData[key] = '')
    }

    fetchAnnonces()

    return {
      annonces,
      showForm,
      formData,
      editingAnnonce,
      saveAnnonce,
      editAnnonce,
      toggleStatus,
      cancelForm
    }
  }
}
</script>

<style scoped>
.gestion-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.add-btn {
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-container {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.annonces-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.annonce-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.active {
  background: #dc3545;
}

.inactive {
  background: #28a745;
}
</style>