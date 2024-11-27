<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-2xl font-bold text-primary">
            Immobilier de Prestige
          </router-link>
          
          <div class="hidden md:flex space-x-8">
            <router-link 
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path"
              class="text-gray-700 hover:text-primary transition-colors"
            >
              {{ item.name }}
            </router-link>
          </div>

          <!-- Mobile menu button -->
          <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>

    <main class="flex-grow">
      <router-view/>
    </main>

    <footer class="bg-secondary text-white py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">À propos</h3>
            <p class="text-gray-300">
              Spécialiste de l'immobilier de prestige en France
            </p>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Contact</h3>
            <p class="text-gray-300">
              Email: contact@immobilier-prestige.fr<br>
              Tél: +33 1 23 45 67 89
            </p>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Suivez-nous</h3>
            <div class="flex space-x-4">
              <!-- Add social media icons here -->
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; 2024 Immobilier de Prestige. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const mobileMenuOpen = ref(false)
    const menuItems = [
      { name: 'Accueil', path: '/' },
      { name: 'Recherche', path: '/recherche' },
      { name: 'Contact', path: '/contact' }
    ]

    return {
      mobileMenuOpen,
      menuItems
    }
  }
}
</script>