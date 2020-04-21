<template>
  <v-navigation-drawer app>
    <v-list rounded>
      <v-list-item-group>
        <v-list-item>
        <v-list-item-avatar color=primary>
            <v-icon style="color: white" medium class="mx-5">fas fa-users</v-icon>
          </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title class="mx-2">General</v-list-item-title>
            <v-divider class="mt-2"></v-divider>
          </v-list-item-content>
        </v-list-item>
      <v-list-item @click="changeRoom(item.username)" class ="messages" v-for="(item) in $store.getters.userList" :key="item.username">
          <v-list-item-avatar color=primary>
            <v-icon style="color: white" medium class="mx-5">{{item.icon}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="mx-2">{{item.username}}</v-list-item-title>
            <v-divider class="mt-2"></v-divider>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Join',
  data: () => ({
  }),

  methods: {
    changeRoom (roomName) {
      this.$socket.emit('changeRoom', 'abc')
      this.messages = []
      this.users = []
    }
  }
}
</script>
