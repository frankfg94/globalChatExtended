<template>
  <v-container>
     <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y >
                         <v-list>
                           <v-list-item-group>
                                <v-list-item @click="deleteMsg(selectedMsg,true)" :disabled="!canDeleteMsg">
                                  <v-list-item-title   >Delete</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="editMsg(selectedMsg)" :disabled="!canEditMsg">
                                    <v-list-item-title  >Edit</v-list-item-title>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-title @click="copyMsg">Copy</v-list-item-title>
                                </v-list-item>
                           </v-list-item-group>
                  </v-list>
     </v-menu>
    <div ref="scrollbar" class="c-chat mb-3 pa-6">
      <h2>Group : {{roomName}}</h2>
      <v-list >
        <v-slide-y-reverse-transition group name="msgitem">
                <template class="messages" v-for="(item,idx) in $store.getters.messages">
          <v-list-item-group :key="idx" >
            <v-list-item @contextmenu="show($event,idx)"  :inactive="true" name="msgitem" :key="item.date" :value="item">
              <template  >
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
                    color="primary"
                    @click="getTranslation(item)"
                  >fas fa-language</v-icon>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list-item-group>
          </template>
        </v-slide-y-reverse-transition>
      </v-list>
    </div>
    <v-card v-show="showEmo" id="iconList" color="emojiBg" class="px-2 py-2">
      <div class="scrollable" v-for="(row,idx) in emojiFormatted" :key="idx">
        <div
          @click="insertEmoji(emoji)"
          class="icons-align-horizontal"
          v-for="(emoji,idx2) in row"
          :key="idx2"
        >{{emoji}}</div>
      </div>
    </v-card>
    <div class="c-form">
      <v-footer>
        <v-textarea
          id="ta"
          no-resize
          label="Your message"
          rows="1"
          outline
          v-model="message"
          @keydown="inputHandler"
        ></v-textarea>
        <button @click="showEmo = !showEmo" class="px-5 py-5">
          <v-icon>far fa-laugh-beam</v-icon>
        </button>
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

#iconList {
  position: absolute;
  bottom: 85px;
  right: 0;
}

.icons-align-horizontal {
  display: inline-block;
  text-align: center;
}
</style>

<script>
export default {
  name: 'Chatpage',
  data: () => ({
    roomName: 'General',
    message: '',
    showEmo: false,
    users: [],
    emojiList: [
      '😂',
      '😇',
      '😉',
      '😫',
      '🤮',
      '😩',
      '🙄',
      '😨',
      '🤔',
      '😳',
      '🙁',
      '🤬',
      '☝',
      '🤝',
      '😢',
      '🧑‍🦱',
      '👺',
      '💩',
      '😥',
      '😞',
      '😟',
      '🤪',
      '👻',
      '🤛',
      '👩‍🦱',
      '👸',
      '🤦',
      '🚶',
      '🤦‍♂️'
    ],
    emojiFormatted: [],
    showMenu: false,
    x: 0,
    y: 0,
    selectedMsg: 0,
    isEditingMsg: false,
    canEditMsg: false,
    canDeleteMsg: false
  }),

  beforeMount () {
    window.addEventListener('beforeunload', this.beforeLeaving)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('beforeunload', this.beforeLeaving)
    })
  },
  // Socket.io event listeners
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
    },
    onMsgEdited (data) {
      this.saveEditedMsg(data.msgOldText, data.msgNewText, false)
    },
    onMsgDeleted (data) {
      this.deleteMsg(data, false)
    }
  },
  methods: {
    inputHandler (e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        if (this.isEditingMsg) {
          if (this.message.trim()) {
            this.saveEditedMsg(this.selectedMsg.original, this.message, true)
          }
        } else {
          this.sendMessage()
        }
      }
    },
    sendMessage () {
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
    // STEP 2 OF 2
    saveEditedMsg (msgOldText, msgNewText, emit) {
      console.log(msgNewText)
      console.log(msgOldText)
      this.$store.commit({ type: 'replaceAllMsg', oldText: msgOldText, newText: msgNewText })
      this.message = ''
      this.isEditingMsg = false
      if (emit) {
        this.$socket.emit('editMsg', { msgOldText: msgOldText, msgNewText: msgNewText })
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
    },
    genEmojiRows: function (emojiList, rowLimit) {
      rowLimit++
      let tabEmoji = []
      let curTab = []
      for (let i = 0; i < emojiList.length; i++) {
        if (i % rowLimit === 0) {
          tabEmoji.push(curTab)
          curTab = []
        } else {
          curTab.push(emojiList[i])
        }
      }
      tabEmoji = tabEmoji.splice(1)
      return tabEmoji
    },
    insertEmoji: function (emoji) {
      const cursorIndex = document.getElementById('ta').selectionEnd
      this.message =
        this.message.substring(0, cursorIndex) +
        emoji +
        this.message.substring(cursorIndex)
    },
    show (e, item) {
      e.preventDefault()
      console.log('Show')
      this.selectedMsg = this.$store.getters.messages[item]
      const userHasAllOptions = this.$store.getters.user.username === this.selectedMsg.author.username
      console.log('userHasAllOptions : ' + userHasAllOptions)
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
        if (userHasAllOptions) {
          this.canEditMsg = true
          this.canDeleteMsg = true
        } else {
          this.canEditMsg = false
          this.canDeleteMsg = false
        }
      })
    },
    // STEP 1 OF 2
    editMsg (msgItem, emit) {
      console.log('trigger')
      this.message = msgItem.original
      this.isEditingMsg = true
    },
    copyMsg () {
      this.message = this.selectedMsg.original
      this.isEditingMsg = false
    },
    deleteMsg (msgItem, emit) {
      if (sessionStorage.getItem('messages') !== null) {
        this.$store.commit(
          'removeMessage',
          this.selectedMsg)
        if (emit) {
          this.$socket.emit('deleteMsg', msgItem)
        }
      }
    }
  },
  mounted: function () {
    if (sessionStorage.getItem('user') !== null) {
      this.$store.commit('setUser', JSON.parse(sessionStorage.getItem('user')))
    }
    this.$socket.emit('userRegistered', this.$store.getters.user)
    if (sessionStorage.getItem('messages') !== null) {
      console.log(JSON.parse(sessionStorage.getItem('messages')))
      this.$store.commit(
        'setMessages',
        JSON.parse(sessionStorage.getItem('messages'))
      )
    }
    this.$refs.scrollbar.scrollTop = this.$refs.scrollbar.scrollHeight
    this.emojiFormatted = this.genEmojiRows(this.emojiList, 5)
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
