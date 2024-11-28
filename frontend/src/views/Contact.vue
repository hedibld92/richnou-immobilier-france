<template>
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-8">Contactez-nous</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Informations de contact -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-semibold mb-6">Nos coordonnées</h2>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p>123 Avenue des Champs-Élysées, 75008 Paris</p>
          </div>
          
          <div class="flex items-center">
            <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <p>contact@immobilier-prestige.fr</p>
          </div>
          
          <div class="flex items-center">
            <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <p>+33 1 23 45 67 89</p>
          </div>
        </div>
      </div>

      <!-- Formulaire de contact -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
        
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label class="block text-gray-700 mb-2" for="name">Nom complet</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
          </div>

          <div>
            <label class="block text-gray-700 mb-2" for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
          </div>

          <div>
            <label class="block text-gray-700 mb-2" for="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-gray-700 mb-2" for="message">Message</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="4"
              class="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Contact',
  setup() {
    const form = ref({
      name: '',
      email: '',
      phone: '',
      message: ''
    })

    const submitForm = () => {
      // Simulation d'envoi
      console.log('Form submitted:', form.value)
      alert('Message envoyé ! Nous vous contacterons bientôt.')
      
      // Reset du formulaire
      form.value = {
        name: '',
        email: '',
        phone: '',
        message: ''
      }
    }

    return {
      form,
      submitForm
    }
  }
}
</script>