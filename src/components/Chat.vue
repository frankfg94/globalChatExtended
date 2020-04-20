<template>
  <v-container>
    <div ref="scrollbar" class="c-chat mb-3 pa-6">
      <p v-if="$store.getters.messages.length === 0">Welcome to Global Chat</p>
      <v-list-item class ="messages" v-for="(item,idx) in $store.getters.messages" :key="item.date">
        <v-list-item-content style="padding:0">
          <v-row>
            <v-col cols="11">
              <v-list-item-subtitle>{{ item.author }}</v-list-item-subtitle>
              <v-list-item-title>
                  {{ item.original }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="item.showTranslation">{{ item.translation[0] }}</v-list-item-subtitle>
            </v-col>
            <v-col cols="1">
              <v-icon medium color=blue @click="getTranslation(idx)">fas fa-language</v-icon>
            </v-col>
          </v-row>
          <v-divider></v-divider>
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
    messages: [],
    targetLanguage: 'en'
  }),

  sockets: {
    connect (val) {
      console.log('connected to chat server')
    },
    count (val) {
      this.count = val.count
    },
    async newMessage (data) { // this function gets triggered once a socket event of `message` is received
      console.log('received')
      this.$store.commit('addMessage', {
        date: Date.now(),
        author: 'auteur',
        original: data.original,
        showTranslation: false
      })
      console.log(this.targetLanguage)
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
        this.targetLanguage = this.$store.getters.targetLang
        console.log(this.targetLanguage)
        this.$socket.emit('message', { text: this.message, ui: this.targetLanguage })
        this.message = '' // clear the box
      }
    },

    async getTranslation (idx) {
      if (!this.$store.getters.messages[idx].showTranslation) {
        await this.$store.dispatch('translateMessage', idx)
      }
      this.$store.commit('changeVisibility', idx)
    }
  }

}
</script>
