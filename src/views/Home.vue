<template>
  <div>
    <Contact></Contact>
    <Chat></Chat>
  </div>
</template>

<script>

import Chat from '@/components/Chat.vue'
import Contact from '@/components/Contact.vue'

export default {
  name: 'Home',
  components: {
    Chat,
    Contact
  }
}
</script>
