<template>
  <v-container fluid grid-list-sm fill-height>
    <v-layout column justify-center justify-space-between wrap>
    <v-card height="100%">
      <v-card-text>
        <p v-if="messages.length === 0">Welcome to Global Chat</p>
        <v-list-item class ="messages" v-for="(item) in messages" :key="item.id">
          <v-list-item-content>{{item.message}}
          <!--<v-list-item-title>{{ item.author }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.content }}</v-list-item-subtitle>-->
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
    <v-card fixed>
        <v-text-field
          v-model="message"
          label="your message"
          single-line>
        </v-text-field>
        <div class="my-3">
          <v-btn color="primary" height="40"
            @click="sendMessage()">Send</v-btn>
        </div>
    </v-card>
    </v-layout>
  </v-container>
</template>

<style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: 0.5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
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
      this.messages.push({ message: data }) // append each new message to the textarea and add a line break
    }
  },

  methods: {
    sendMessage: function () {
      this.$socket.emit('message', this.message)
      this.message = '' // clear the box
    }
  }

}
</script>
