import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import DashboardVendeur from '../views/DashboardVendeur.vue'
import DashboardAcheteur from '../views/DashboardAcheteur.vue'
import Recherche from '../views/Recherche.vue'
import Contact from '../views/Contact.vue'
import AnnonceDetail from '../views/AnnonceDetail.vue'
import PostAnnonce from '../views/PostAnnonce.vue';

const routes = [
    {
    path: '/annonce/:id',
    name: 'AnnonceDetail',
    component: AnnonceDetail,
    props: true
    },
    {
    path: '/poster-annonce',
    name: 'PostAnnonce',
    component: PostAnnonce,
    meta: { requiresAuth: true, vendeurOnly: true }
      },
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
    path: '/dashboard-vendeur',
    name: 'DashboardVendeur',
    component: DashboardVendeur,
    meta: { requiresAuth: true, role: 'vendeur' }
  },
  {
    path: '/dashboard-acheteur',
    name: 'DashboardAcheteur',
    component: DashboardAcheteur,
    meta: { requiresAuth: true, role: 'acheteur' }
  },
  {
    path: '/recherche',
    name: 'Recherche',
    component: Recherche
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  }
]


const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  // Guard de navigation pour vérifier l'authentification et le rôle
  router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token');
    const userRole = JSON.parse(localStorage.getItem('user'))?.role;
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login');
    } else if (to.meta.vendeurOnly && userRole !== 'vendeur') {
      next('/');
    } else {
      next();
    }
  });
  
  export default router;