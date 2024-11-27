import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RechercheAnnonces from '../views/RechercheAnnonces.vue'
import DetailAnnonce from '../views/DetailAnnonce.vue'
import GestionAnnonces from '../views/GestionAnnonces.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recherche',
    name: 'Recherche',
    component: RechercheAnnonces
  },
  {
    path: '/annonce/:id',
    name: 'DetailAnnonce',
    component: DetailAnnonce
  },
  {
    path: '/gestion',
    name: 'GestionAnnonces',
    component: GestionAnnonces
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router