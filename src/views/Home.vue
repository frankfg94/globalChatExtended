<template>
  <div>
     <v-container class="grey lighten-5">
      <v-row>
        <v-col cols="2">
          <Contact></Contact>
        </v-col>
        <v-col cols="10">
          <Chat></Chat>
        </v-col>
      </v-row>
    </v-container>
    <!--<img alt="Vue logo" src="../assets/logo.png">-->
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
