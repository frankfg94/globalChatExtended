<template>
  <v-container>
    <div ref="scrollbar" class="c-chat mb-3 pa-6">
      <p v-if="messages.length === 0">Welcome to Global Chat</p>
      <v-list-item class ="messages" v-for="(item) in messages" :key="item.id">
        <v-list-item-content>
          <v-list-item-subtitle>{{ item.author }}</v-list-item-subtitle>
          <v-list-item-title>{{ item.original }}  <v-icon x-small color=blue @click="item.showTranslation = !item.showTranslation">fas fa-language</v-icon></v-list-item-title>
          <v-list-item-subtitle v-if="item.showTranslation">{{ item.translation }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </div>
    <div class="c-form mx-6 my-2">
      <v-flex xs12>
        <v-text-field label="Your message" outline v-model="message" @keydown.enter="sendMessage"/>
      </v-flex>
    </div>
  </v-container>
</template>

<style>
.c-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.c-chat {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 60px;
  overflow-y: auto;
}
</style>

<script>

export default {
  name: 'Chatpage',

  data: () => ({
    message: '',
    messages: []
  }),

  sockets: {
    connect () {
      console.log('connected to chat server')
    },
    count (val) {
      this.count = val.count
    },
    async translatedmessage (data) { // this function gets triggered once a socket event of `message` is received
      console.log('received')
      this.messages.push({ author: 'auteur', original: data.original, translation: data.translation, showTranslation: false })
    }
  },

  watch: {
    messages () {
      setTimeout(() => {
        this.$refs.scrollbar.scrollTop = this.$refs.scrollbar.scrollHeight
      })
    }
  },

  methods: {
    sendMessage: function () {
      if (this.message.trim()) {
        this.$socket.emit('message', this.message)
        this.message = '' // clear the box
      }
    }
  }

}
</script>
