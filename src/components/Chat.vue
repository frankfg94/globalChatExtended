<template>
  <v-container>
    <div ref="scrollbar" class="c-chat mb-3 pa-6">
      <p v-if="messages.length === 0">Welcome to Global Chat</p>
      <v-list-item class ="messages" v-for="(item) in messages" :key="item.id">
        <v-list-item-content v-if="item.author && item.original">
          <v-list-item-subtitle><v-icon class="mx-2">{{item.icon}}</v-icon>{{ item.author }}</v-list-item-subtitle>
          <v-list-item-title>{{ item.original }}  <v-icon x-small color=blue @click="item.showTranslation = !item.showTranslation">fas fa-language</v-icon></v-list-item-title>
          <v-list-item-subtitle v-if="item.showTranslation">{{ item.translation }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content v-if="!item.original && item.username != null && item.mode ==='enter' ">
            <v-list-item-title class="font-weight-bold">
              <v-icon class="mx-2">{{item.icon}}</v-icon>
              {{ item.username }} a rejoint la conversation
            </v-list-item-title>
        </v-list-item-content>
          <v-list-item-content v-if="!item.original && item.username != null && item.mode ==='quit'">
            <v-list-item-title class="font-weight-bold">
              <v-icon class="mx-2">{{exitIcon}}</v-icon>
              Un utilisateur a quitté la conversation
            </v-list-item-title>
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
    user: {
      username: 'auteur',
      icon: 'fas fa-hand-middle-finger'
    },
    exitIcon: 'fas fa-sign-out-alt'
  }),

  sockets: {
    connect () {
      console.log('connected to chat server')
    },
    count (val) {
      this.count = val.count
    },
    async translatedmessage (data) { // this function gets triggered once a socket event of `message` is received
      console.log('received' + JSON.stringify(data))
      this.messages.push({ author: data.author, original: data.original, translation: data.translation, showTranslation: false, icon: data.icon })
    },
    async userConnected (user) {
      user.mode = 'enter'
      this.messages.push(user)
      console.log(user.username + ' is connected')
    },
    async userDisconnectedNotify (user) {
      user.mode = 'quit'
      this.messages.push(user)
      console.log(user.username + ' is disconnected')
    },
    async userDisconnectedGetData (user) {
      this.$socket.emit('userDisconnectedNotify', this.user)
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
        this.$socket.emit('message', { text: this.message, username: this.user.username, icon: this.user.icon })
        this.message = '' // clear the box
      }
    }
  },
  mounted: function () {
    console.log('mounted:' + JSON.stringify(this.$route.params))
    if (this.$route.params.username !== null && this.$route.params.username !== undefined) {
      this.user = this.$route.params
      this.$socket.emit('userConnected', this.user)
    }
  }

}
</script>
