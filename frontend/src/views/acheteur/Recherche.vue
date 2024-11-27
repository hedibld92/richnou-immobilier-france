<template>
    <div class="recherche-container">
        <form @submit.prevent="rechercher">
            <div class="form-group">
                <label>Ville</label>
                <input v-model="criteria.ville" type="text" placeholder="Ville">
            </div>
            <div class="form-group">
                <label>Type de bien</label>
                <select v-model="criteria.type">
                    <option value="">Tous</option>
                    <option value="chateau">Château</option>
                    <option value="loft">Loft</option>
                    <option value="manoir">Manoir</option>
                    <option value="hotel-particulier">Hôtel Particulier</option>
                </select>
            </div>
            <div class="form-group">
                <label>Prix</label>
                <input v-model.number="criteria.prix_min" type="number" placeholder="Prix min">
                <input v-model.number="criteria.prix_max" type="number" placeholder="Prix max">
            </div>
            <button type="submit">Rechercher</button>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'RechercheAnnonce',
    setup() {
        const store = useStore();
        const criteria = ref({
            ville: '',
            type: '',
            prix_min: null,
            prix_max: null
        });

        const rechercher = () => {
            store.dispatch('searchAnnonces', criteria.value);
        };

        return {
            criteria,
            rechercher
        };
    }
};
</script>