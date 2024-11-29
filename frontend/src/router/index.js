import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AnnonceDetail from '../views/AnnonceDetail.vue';
import DashboardAcheteur from '../views/DashboardAcheteur.vue'
import DashboardVendeur from '../views/DashboardVendeur.vue'
import CreateAnnonce from '../views/CreateAnnonce.vue'  // Ajoutez cette ligne
import Recherche from '../views/Recherche.vue'
import Contact from '../views/Contact.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard-acheteur',
    name: 'DashboardAcheteur',
    component: DashboardAcheteur,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard-vendeur',
    name: 'DashboardVendeur',
    component: DashboardVendeur,
    meta: { requiresAuth: true }
  },
  {
    path: '/creer-annonce',
    name: 'CreateAnnonce',
    component: CreateAnnonce,
    meta: { requiresAuth: true, vendeurOnly: true }
  },
  {
    path: '/recherche',
    name: 'Recherche',
    component: Recherche
  },
  {
    path: '/annonce/:id',
    name: 'AnnonceDetail',
    component: () => import('../views/AnnonceDetail.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue') // Créez cette vue
  },
  {
    path: '/ajouter-annonce',  // Nouvelle route
    name: 'PostAnnonce',       // Nom correspondant à votre composant
    component: () => import('../views/PostAnnonce.vue')
  },
  {
    path: '/modifier-annonce/:id',
    name: 'ModifierAnnonce',
    component: () => import('../views/ModifierAnnonce.vue')
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.vendeurOnly && userRole !== 'vendeur') {
    next('/dashboard-acheteur')
  } else {
    next()
  }
})

export default router