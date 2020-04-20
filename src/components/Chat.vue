<template>
  <v-container>
    <div ref="scrollbar" class="c-chat mb-3 pa-6">
      <h1>Conversation : {{roomName}}</h1>
      <h1 v-if="$store.getters.messages.length === 0">Welcome to Global Chat</h1>
      <v-list-item  @click="changeRoom(this.user.username + '-' + idx)" class="users" v-for="(user) in users" :key="user.username">
         <v-list-item-content style="padding:0">
          <v-row>
            <v-col>
              <v-list-item-title font-weight-bold class="mx-10">
                 Registered : {{ user.username }}
              </v-list-item-title>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class ="messages" v-for="(item,idx) in $store.getters.messages" :key="item.date">
        <v-list-item-content style="padding:0">
          <v-row>
            <v-col cols="11">
              <v-list-item-subtitle><v-icon class="mx-2">{{item.author.icon}}</v-icon>{{ item.author.username }}</v-list-item-subtitle>
              <v-list-item-title class="mx-10">
                  {{ item.original }}
              </v-list-item-title>
              <v-list-item-subtitle class="mx-10" v-if="item.showTranslation">{{ item.translation[0] }}</v-list-item-subtitle>
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
    roomName: 'Général',
    message: '',
    user: {
      username: 'anonyme',
      icon: 'fas fa-hand-middle-finger'
    },
    users: []
  }),
  sockets: {
    connect (val) {
      console.log('connected to chat server')
    },
    count (val) {
      this.count = val.count
    },
    userListObtained (val) {
      this.users = val
    },
    async newMessage (data) { // this function gets triggered once a socket event of `message` is received
      console.log(data.author)
      this.$store.commit('addMessage', {
        date: data.date,
        author: {
          username: data.author.username,
          icon: data.author.icon
        },
        original: data.original,
        showTranslation: false
      })
    }
  },
  watch: {
    name (newName) {
      this.name = localStorage.name
    }
  },
  methods: {
    ScrollEnd () {
      this.$refs.scrollbar.scrollTop = this.$refs.scrollbar.scrollHeight
    },
    sendMessage: function () {
      if (this.message.trim()) {
        const msg = { date: Date.now(), original: this.message, author: this.$store.getters.user }
        this.$socket.emit('message', msg)
        this.message = '' // clear the box
      }
    },
    changeRoom () {
      this.$socket.emit('changeRoom', 'abc')
      this.messages = []
      this.users = []
    },
    async getTranslation (idx) {
      if (!this.$store.getters.messages[idx].showTranslation) {
        await this.$store.dispatch('translateMessage', idx)
      }
      this.$store.commit('changeVisibility', idx)
    },
    assignUserList: function () {
      this.$socket.emit('userList', this.$store.getters.user)
    }
  },
  mounted: function () {
    if (sessionStorage.getItem('user') !== null) {
      this.$store.commit('setUser', JSON.parse(sessionStorage.getItem('user')))
    }
    if (sessionStorage.getItem('messages') !== null) {
      this.$store.commit('setMessages', JSON.parse(sessionStorage.getItem('messages')))
    }
  },
  updated () {
    this.ScrollEnd()
  }
}
</script>
