    <template>
    <v-container>
    <div ref="scrollbar" class="c-chat mb-3 pa-6">
        <v-scroll>
      <p v-if="messages.length === 0">Welcome to Global Chat</p>
        <v-list-item class ="messages" v-for="(item) in messages" :key="item.id">
          <v-list-item-content>
          <v-list-item-subtitle>{{ item.author }}</v-list-item-subtitle>
           <v-list-item-title>{{ item.content }}</v-list-item-title>
         </v-list-item-content>
        </v-list-item>
        </v-scroll>
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
    message (data) { // this function gets triggered once a socket event of `message` is received
      console.log('received')
      this.messages.push({ author: 'auteur', content: data })
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
      if (this.message) {
        this.$socket.emit('message', this.message)
        this.message = '' // clear the box
      }
    }
  }

}
</script>
