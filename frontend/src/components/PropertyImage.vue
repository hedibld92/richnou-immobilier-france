<template>
  <div class="relative h-64">
    <img 
      :src="currentSrc"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="handleError"
    >
    <slot></slot>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PropertyImage',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      required: true
    }
  },
  setup() {
    const defaultImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    const currentSrc = ref('')

    // Initialiser avec l'image source ou l'image par défaut
    currentSrc.value = defaultImage

    const handleError = () => {
      currentSrc.value = defaultImage
    }

    return {
      currentSrc,
      handleError
    }
  }
}
</script>