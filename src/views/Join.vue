<template>
<div class="parent">
  <v-container
        class="fill-height"
        fluid
      >
      <v-snackbar
      v-model="snackbar"
      bottom
      color="error"
    >
      This username is already taken
      <v-btn
        color="white"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    label="Your username"
                    v-model="username"
                    :rules="pseudoRules"
                    @keyup.enter="submitUnique"
                    type="text"
                    :maxlength="pseudoLength"
                    :counter="pseudoLength"
                    required
                  />
                  <v-row>
                    <v-col  cols="4">
                      <v-icon class="d-flex justify-center" x-large>{{icon.ic}}</v-icon>
                    </v-col>
                    <v-col>
                      <v-combobox
                        label="Icon"
                        v-model="icon"
                        :item-value="icon.ic"
                        :items="icons"
                        required
                        color="selectEmojiText"
                      >
                        <template slot="item" slot-scope="data">
                          <v-col cols="8" class="selectEmojiText--text black--text">
                            {{data.item.title}}
                          </v-col>
                          <v-col cols="4" >
                            <v-icon color="selectEmoji">{{data.item.ic}}</v-icon>
                          </v-col>
                        </template>
                        <template class="selectEmojiText--text" slot="selection" slot-scope="data">
                            {{data.item.title}}
                        </template>
                      </v-combobox>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                color="primary"
                :disabled="!valid"
                @click="submitUnique">Let's go</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
   <v-icon class="bg-floating-icon d-none d-sm-flex" color="primary" size="400">fa fa-globe-americas</v-icon>
</div>
</template>

<style scoped>
.bg-floating-icon {
      position: absolute;
      left:25%;
      top:35%;
      z-index: -1;
}

.parent {
position: relative;
z-index: 0;
}
</style>

<script>
export default {
  name: 'Join',
  data: () => ({
    el: '#app',
    valid: false,
    username: '',
    logged: false,
    snackbar: false,
    pseudoLength: 20,
    icons: [
      { ic: 'far fa-angry', title: 'Angry' },
      { ic: 'far fa-laugh-beam', title: 'Happy' },
      { ic: 'fas fa-pizza-slice', title: 'Pizza' },
      { ic: 'fas fa-apple-alt', title: 'Apple' }
    ],
    icon: '',
    pseudoRules: [
      (username) => !!username || 'A username is required',
      (username) => username.trim() !== '' || 'A username cannot have only whitespaces'
    ]
  }),

  methods: {
    async submit () {
      this.$store.commit('setUser', { username: this.username.trim(), icon: this.icon.ic })
      this.$router.push({ name: 'Chat' })
    },
    // Ensure that that an user with the same name is not already connected
    async submitUnique () {
      this.$socket.emit('getUserList', { username: this.username, icon: this.icon })
    },
    userConnected: function () {
      if (sessionStorage.getItem('user')) {
        return true
      } else {
        return false
      }
    }
  },
  sockets: {
    async userListReceived (userList) {
      const alreadyConnected = userList.uList.find(u => u.username.toUpperCase() === this.username.toUpperCase())
      if (alreadyConnected !== undefined) {
        this.snackbar = true
      } else {
        if (JSON.parse(userList.allowedUser).username === this.username) {
          this.submit()
        }
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      if (this.userConnected()) {
        this.$socket.emit('userGone', this.$store.getters.user)
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.username = user.username
        this.icon = this.icons.find(el => el.ic === user.icon)
      } else {
      // Choose a random emoticon
        const randomId = Math.floor(Math.random() * Math.floor(this.icons.length))
        this.icon = this.icons[randomId]
      }
    })
  }
}

</script>
