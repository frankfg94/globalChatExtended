<template>
  <v-navigation-drawer app>
    <v-list rounded>
      <v-list-item-group>
        <v-list-item @click='changeGroup(groups[0])'>
          <v-list-item-avatar color="primary">
            <v-icon style="color: white" medium class="mx-5">{{groups[0].icon}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title  class="mx-2">{{groups[0].title}}</v-list-item-title>
            <v-divider class="mt-2"></v-divider>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          class="messages"
          v-for="(item) in $store.getters.userList"
          :key="item.username"
        >
          <v-list-item-avatar color="primary">
            <v-icon style="color: white" medium class="mx-5">{{item.icon}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="mx-2">{{item.username}}</v-list-item-title>
            <v-divider class="mt-2"></v-divider>
          </v-list-item-content>
        </v-list-item>
        <h1 class="accent--text">Groups</h1>
        <div v-for="(g) in groups" :key="g.creationDate.toString()">
          <div  v-if="!g.pinned">
          <v-badge
            bottom
            :content="getUnreadMsgCount(g.title)"
            :value="getUnreadMsgCount(g.title)"
            left
            bordered
            color="selectEmoji"
            offset-y="35"
            offset-x="30">
            <v-list-item  @click='changeGroup(g)' bottom class="messages">
              <v-list-item-avatar color="primary">
                <v-icon style="color: white" medium class="mx-5">{{g.icon}}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="mx-2">{{g.title}}</v-list-item-title>
                <v-list-item-subtitle>
                  {{getGroupText(g)}}
                  <v-icon x-small v-if="g.password">{{lockedGroupIcon}}</v-icon>
                </v-list-item-subtitle>
                <v-divider class="mt-2"></v-divider>
              </v-list-item-content>
            </v-list-item>
          </v-badge>
          </div>
        </div>
      </v-list-item-group>
    </v-list>
    <v-dialog v-model="dialogCreateGroup" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" rounded class="mx-10">
          <v-icon class="px-2 py-2">fas fa-users</v-icon>
          <v-label>New group</v-label>
        </v-btn>
      </template>
      <!-- The dialog of the group to create -->
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Let's create a group</v-card-title>
        <v-card-text>Create a group called {{createGroupName}}</v-card-text>
        <v-text-field
          label="Title"
          :counter="groupTitleLength"
          :maxLength="groupTitleLength"
          v-model="createGroupName"
          required
          class="mx-10"
        >{{createGroupName}}</v-text-field>
        <v-text-field v-model="craeteGroupPassword" label="password (optional)" class="mx-10"></v-text-field>
        <v-combobox v-model="comboboxIcon" class="mx-10" label="icon" :items="icons">
          <template  slot="item" slot-scope="data">
            <v-col cols="8" class="selectEmojiText--text black--text">{{data.item.title}}</v-col>
            <v-col cols="4">
              <v-icon   color="selectEmoji">{{data.item.ic}}</v-icon>
            </v-col>
          </template>
          <template
            class="selectEmojiText--text"
            slot="selection"
            slot-scope="data"
          >{{data.item.title}}</template>
        </v-combobox>
        <template>
          <v-combobox
            class="mx-10"
            v-model="createGroupUsers"
            :items="$store.getters.userList"
            createGroupUsers
            flat
            clearable
            label="Add some users to this group"
            multiple
            prepend-icon="fas fa-filter"
            solo
          >
            <template class="mx-10" v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                @click="select"
                @click:close="remove(item)"
              >
                <span>
                  <v-icon color="selectEmoji" class="pr-2">{{item.icon}}</v-icon>
                </span>
                <strong class="selectEmojiText--text">{{ item.username }}</strong>&nbsp;
              </v-chip>
            </template>
            <!-- General display of the contact list (view the list of data)-->
            <template slot="item" slot-scope="data">
              <v-col cols="8" class="selectEmojiText--text">{{data.item.username}}</v-col>
              <v-col cols="4">
                <v-icon color="selectEmoji">{{data.item.icon}}</v-icon>
              </v-col>
            </template>
          </v-combobox>
        </template>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogCreateGroup = false">Cancel</v-btn>
          <v-btn color="primary" text @click="createGroup()">Create the group</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Join',
  data: () => ({
    lockedGroupIcon: 'fas fa-lock',
    items: ['Streaming', 'Eating'],
    dialogCreateGroup: false,
    groupTitleLength: 20,
    icons: [
      { ic: 'far fa-angry', title: 'Angry' },
      { ic: 'far fa-laugh-beam', title: 'Happy' },
      { ic: 'fas fa-pizza-slice', title: 'Pizza' },
      { ic: 'fas fa-apple-alt', title: 'Apple' },
      { ic: 'fas fa-globe-americas', title: 'Globe' }
    ],
    createGroupName: '',
    createGroupUsers: '',
    createGroupIcon: '',
    craeteGroupPassword: '',
    groups: [
      {
        // The default group
        title: 'General',
        icon: 'fas fa-users',
        creationDate: 0,
        pinned: true
      },
      {
        title: 'Groupe de Test 1',
        users: ['François', 'Bob'],
        icon: 'fas fa-globe-americas',
        creationDate: new Date(),
        password: ''
      },
      {
        title: 'Groupe Matrix',
        users: ['François'],
        icon: 'fas fa-globe-americas',
        creationDate: new Date('2011-10-10'),
        password: 'matrix'
      }
    ],
    comboboxIcon: '',
    unreadGroups: []
  }),
  sockets: {
    onGroupCreated (createdGroup) {
      console.log('Group created !')
      if (this.getUsernames(createdGroup.users).find(x => x.username === this.$store.getters.user.username)) {
        this.groups.push(createdGroup)
      }
    }
  },
  methods: {
    getGroupText (groupObject) {
      if (groupObject.users) {
        if (groupObject.users.length === 1) {
          return '1 user'
        } else {
          return groupObject.users.length + ' users'
        }
      }
    },
    getUsernames: function (users) {
      const names = []
      for (const k in users) {
        names.push(users[k])
      }
      return names
    },
    // Remove items from the user combobox
    remove (item) {
      this.createGroupUsers.splice(this.createGroupUsers.indexOf(item), 1)
      this.createGroupUsers = [...this.createGroupUsers]
    },
    // Create & send a group to the server
    createGroup () {
      const grp = {
        title: this.createGroupName,
        users: this.getUsernames(this.createGroupUsers),
        icon: this.comboboxIcon.ic,
        creationDate: new Date(),
        password: this.craeteGroupPassword
      }
      console.log('Users : ' + JSON.stringify(this.createGroupUsers))
      this.$socket.emit('createGroup', grp)
      this.dialogCreateGroup = false
    },
    // TODO : implement password verification
    changeGroup (groupObject) {
      // We don't want to reload the group we're currently on
      if (this.$store.getters.currentGroup.title !== groupObject.title) {
        this.$socket.emit('changeGroup', { group: groupObject, user: this.$store.getters.user, oldGroup: this.$store.getters.currentGroup })
        console.log('1) Changing group to : ' + groupObject.title)
        this.$store.commit('changeGroup', groupObject)
        console.log('Group is now : ' + this.$store.getters.currentGroup.title)
        console.log('Msgs for ' + this.$store.getters.user.username + ' :')
        console.table(this.$store.getters.messages)
        // Remove unread messages notifications
        this.$store.commit('clearNotifications', groupObject.title)
      }
    },
    getUnreadMsgCount (groupTitle) {
      return this.$store.getters.unreadGroups.filter(item => item === groupTitle).length
    }
  }
}
</script>
