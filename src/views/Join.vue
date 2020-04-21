<template>
  <v-form
  v-model="valid" ref="form"
>
  <v-container
        class="fill-height"
        fluid
      >
      <v-snackbar
      v-model="snackbar"
      top
      color="error"
    >
      Ce pseudo existe déjà
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
                <v-form>
                  <v-text-field
                    label="Your username"
                    v-model="username"
                    :rules="pseudoRules"
                    type="text"
                    maxlength="12"
                    counter="12"
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
                      >
                        <template slot="item" slot-scope="data">
                          <v-col cols="8">
                            {{data.item.title}}
                          </v-col>
                          <v-col cols="4">
                            <v-icon>{{data.item.ic}}</v-icon>
                          </v-col>
                        </template>
                        <template slot="selection" slot-scope="data">
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
                :disabled="!username"
                @click="submitUnique">Let's go</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'Join',
  data: () => ({
    el: '#app',
    valid: false,
    username: '',
    logged: false,
    snackbar: false,
    icons: [
      { ic: 'far fa-angry', title: 'En colère' },
      { ic: 'far fa-laugh-beam', title: 'Content' },
      { ic: 'fas fa-pizza-slice', title: 'Pizza' },
      { ic: 'fas fa-apple-alt', title: 'Apple' }
    ],
    icon: '',
    pseudoRules: [
      (username) => !!username || 'Un pseudo est requis',
      (username) => /^(?!\s*$).+/.test(username) || "Le pseudo ne doit pas être constitué d'espaces vides"
    ]
  }),

  methods: {
    async submit () {
      console.log('submit')
      this.$store.commit('setUser', { username: this.username.trim(), icon: this.icon.ic })
      this.$router.push({ name: 'Chat' })
    },
    // Ensure that that an user with the same name is not already connected
    async submitUnique () {
      this.$socket.emit('getUserList', this.$store.getters.user)
    },
    userConnected: function () {
      console.log('log user : ' + sessionStorage.getItem('user'))
      if (sessionStorage.getItem('user')) {
        return true
      } else {
        return false
      }
    }
  },
  sockets: {
    async userListReceived (userList) {
      console.log('User List : ' + JSON.stringify(userList))
      const temp = JSON.parse(JSON.stringify(userList))
      const userFound = temp.find(u => u.username.toUpperCase() === this.username.toUpperCase())
      console.log('user   ' + userFound)
      if (userFound !== undefined) {
        this.snackbar = true
      } else {
        this.submit()
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      if (this.userConnected()) {
        this.$socket.emit('userGone', this.$store.getters.user)
        const user = JSON.parse(sessionStorage.getItem('user'))
        console.log('Loading previous user' + JSON.stringify(user))
        this.username = user.username
        this.icon = this.icons.find(el => el.ic === user.icon)
      } else {
      // Choix d'un émoticone aléatoire
        console.log('else')
        const randomId = Math.floor(Math.random() * Math.floor(this.icons.length))
        this.icon = this.icons[randomId]
      }
    })
  }
}

</script>
