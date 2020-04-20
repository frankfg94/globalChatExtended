<template>
  <v-form
  v-model="valid" ref="form"
>
  <v-container
        class="fill-height"
        fluid
      >
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
                    label="Ton pseudo"
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
                        label="Icone"
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
                @click="submit">C'est parti</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  </v-form>
</template>

<script>
import { store } from '../store/store.js'
export default {
  name: 'Join',
  data: () => ({
    el: '#app',
    valid: false,
    username: '',
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
      store.commit('setUser', { username: this.username.trim(), icon: this.icon.ic })
      console.log(this.icon.ic)
      this.$router.push({ name: 'Chat' })
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Choix d'un émoticone aléatoire
      const randomId = Math.floor(Math.random() * Math.floor(this.icons.length))
      this.icon = this.icons[randomId]
    })
  }
}
</script>
