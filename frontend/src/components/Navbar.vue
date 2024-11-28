<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="text-xl font-bold text-blue-600">
          Immobilier Prestige
        </router-link>

        <!-- Navigation Links -->
        <div class="hidden md:flex space-x-8">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-blue-600"
          >
            Accueil
          </router-link>
          <router-link 
            to="/recherche" 
            class="text-gray-700 hover:text-blue-600"
          >
            Recherche
          </router-link>
          <router-link 
            to="/contact" 
            class="text-gray-700 hover:text-blue-600"
          >
            Contact
          </router-link>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <router-link 
            to="/login" 
            class="px-4 py-2 text-gray-700 hover:text-blue-600"
          >
            Connexion
          </router-link>
          <router-link 
            to="/register" 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Inscription
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>