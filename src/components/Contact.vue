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
      <v-list-item class ="messages" v-for="(item) in $store.getters.userList" :key="item.username">
          <v-list-item-avatar color=primary>
            <v-icon style="color: white" medium class="mx-5">{{item.icon}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="mx-2">{{item.username}}</v-list-item-title>
            <v-divider class="mt-2"></v-divider>
          </v-list-item-content>
        </v-list-item>
        <h1 class="accent--text">Groups</h1>
        <v-list-item bottom class ="messages" v-for="(g) in groups" :key="g.title">
          <v-list-item-avatar color=primary>
            <v-icon style="color: white" medium class="mx-5">{{g.icon}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="mx-2">{{g.title}}</v-list-item-title>
            <v-list-item-subtitle>{{getGroupText(g)}}
              <v-icon x-small v-if="g.password">{{lockedGroupIcon}}</v-icon>
            </v-list-item-subtitle>
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
    lockedGroupIcon: 'fas fa-lock',
    groups: [
      {
        title: 'Groupe de Test 1',
        users: ['François', 'Bob'],
        icon: 'fas fa-globe-americas',
        creationDate: '',
        password: ''
      },
      {
        title: 'Groupe Matrix',
        users: ['François'],
        icon: 'fas fa-globe-americas',
        creationDate: '',
        password: 'matrix'
      }
    ]
  }),
  methods: {
    getGroupText (groupObject) {
      if (groupObject.users) {
        if (groupObject.users.length === 1) {
          return '1 user'
        } else {
          return groupObject.users.length + ' users'
        }
      }
    }
  }
}
</script>
