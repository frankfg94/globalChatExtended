<template>
  <v-container>
    <div ref="scrollbar" class="c-chat mb-3 pa-6">
      <h2>Group : {{roomName}}</h2>
      <v-list>
        <v-slide-y-reverse-transition
          group
          tag="v-list"
        >
        <template class="messages" v-for="(item) in $store.getters.messages">
          <v-list-item :key="item.date" :value="item">
            <template>
              <v-list-item-content>
                <v-list-item-subtitle>
                  <v-icon class="mx-2">{{item.author.icon}}</v-icon>
                  {{ item.author.username }}
                </v-list-item-subtitle>
                <v-list-item-title
                  v-for="(line, index) in item.original.split('\n')"
                  :key="index"
                  class="mx-10 wrap-text"
                >{{ line}}</v-list-item-title>
                <v-list-item-subtitle class="wrap-text mx-10 mt-2" v-if="item.showTranslation">
                  <div
                    v-for="(line, index) in item.translation[0].split('\n')"
                    :key="index"
                  >{{ line }}</div>
                </v-list-item-subtitle>
                <v-divider class="mt-2"></v-divider>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon
                  v-if="!$store.getters.alwaysTranslate"
                  medium
                  color="blue"
                  @click="getTranslation(item)"
                >fas fa-language</v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>
        </template>
        </v-slide-y-reverse-transition>
      </v-list>
    </div>
    <div class="c-form">
      <v-footer>
        <v-textarea
          no-resize
          label="Your message"
          rows="1"
          outline
          v-model="message"
          @keydown="inputHandler"
        />
      </v-footer>
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
  bottom: 80px;
  overflow-y: auto;
}
.wrap-text {
  -webkit-line-clamp: unset !important;
  white-space: normal;
  overflow-wrap: break-word;
}
</style>

<script>
export default {
  name: 'Chatpage',
  data: () => ({
    roomName: 'General',
    message: '',
    users: []
  }),

  beforeMount () {
    window.addEventListener('beforeunload', this.beforeLeaving)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('beforeunload', this.beforeLeaving)
    })
  },

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
    async newMessage (data) {
      console.log(data.author)
      await this.$store.dispatch('addMessage', {
        date: data.date,
        author: {
          username: data.author.username,
          icon: data.author.icon
        },
        original: data.original,
        showTranslation: this.$store.getters.alwaysTranslate
      })
    },
    userListChanged (data) {
      this.$store.commit('usersChanged', data)
    }
  },
  methods: {
    inputHandler (e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    },
    sendMessage: function () {
      if (this.message.trim()) {
        const msg = {
          date: Date.now(),
          original: this.message,
          author: this.$store.getters.user
        }
        this.$socket.emit('message', msg)
        this.message = ''
      }
    },
    async getTranslation (msg) {
      if (!msg.showTranslation) {
        msg = await this.$store.dispatch('translateMessage', msg)
      }
      this.$store.commit('changeVisibility', msg)
    },
    assignUserList: function () {
      this.$socket.emit('userList', this.$store.getters.user)
    },
    beforeLeaving: function (event) {
      this.$socket.emit('refresh', this.$store.getters.user)
      return 'ok'
    }
  },
  mounted: function () {
    if (sessionStorage.getItem('user') !== null) {
      this.$store.commit('setUser', JSON.parse(sessionStorage.getItem('user')))
    }
    this.$socket.emit('userRegistered', this.$store.getters.user)
    if (sessionStorage.getItem('messages') !== null) {
      this.$store.commit(
        'setMessages',
        JSON.parse(sessionStorage.getItem('messages'))
      )
    }
    this.$refs.scrollbar.scrollTop = this.$refs.scrollbar.scrollHeight
  },
  computed: {
    messageCounter () {
      return this.$store.getters.messages.length
    }
  },
  watch: {
    messageCounter () {
      setTimeout(() => {
        this.$refs.scrollbar.scrollTop = this.$refs.scrollbar.scrollHeight
      })
    }
  }
}
</script>
