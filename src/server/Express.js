const server = require('server')
const { get, socket } = require('server/router')
const port = process.env.PORT || 3001
let allClients = []
const allGroups = [
  {
    // The default group
    title: 'General',
    icon: 'fas fa-users',
    creationDate: 0,
    pinned: true
  }
]
const defaultGroupName = 'General'
server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', ctx => {
    if (ctx.data.group && ctx.data.group !== defaultGroupName) {
      ctx.io.in(ctx.data.group.title).emit('newMessage', ctx.data)
      console.log('sending msg : ' + JSON.stringify(ctx.data))
    } else {
      ctx.io.emit('newMessage', ctx.data)
    }
  }),
  socket('getUserList', ctx => {
    // We take the request's user to send it only to him
    const senderUser = ctx.data
    if (senderUser == null) {
      throw new Error('User is null')
    }
    ctx.io.emit('userListReceived', { uList: allClients, allowedUser: JSON.stringify(senderUser) })
  }),

  socket('userRegistered', ctx => {
    const user = ctx.data
    if (!allClients.find(x => x.username === user.username)) {
      allClients.push(ctx.data)

      // Everyone will arrive in the default group when connected
      ctx.socket.join(defaultGroupName)
    }
    ctx.io.emit('userListChanged', allClients)
  }),
  // To refresh the user list
  socket('refresh', ctx => {
    allClients = allClients.filter(u => u.username !== ctx.data.username)
    ctx.io.emit('userListChanged', allClients)
  }),
  socket('userGone', ctx => {
    allClients = allClients.filter(u => u.username !== ctx.data.username)
    ctx.io.emit('userListChanged', allClients)
  }),
  socket('deleteMsg', ctx => {
    ctx.io.in(ctx.data.groupName).emit('onMsgDeleted', ctx.data)
  }),
  socket('editMsg', ctx => {
    console.log('onMsgEdited' + JSON.stringify(ctx.data))
    ctx.io.in(ctx.data.groupName).emit('onMsgEdited', ctx.data)
  }),
  socket('createGroup', ctx => {
    // console.log('New group in backend : ' + JSON.stringify(ctx.data))
    if (!allGroups.find(x => x.title === ctx.data.title)) {
      allGroups.push(ctx.data)
      console.log('Emitting  :' + JSON.stringify(ctx.data))
      ctx.io.emit('onGroupCreated', ctx.data)
    }
  }),
  socket('changeGroup', ctx => {
    // We message only the sender client
    if (ctx.data.group && ctx.data.user) {
      const oldGroup = ctx.data.oldGroup
      const group = ctx.data.group
      const user = ctx.data.user

      // We don't reload the group if the user click on its current group
      if (group.title === oldGroup.title) {
        return
      }

      if (!group.users) {
        group.users = [user]
      }
      // If the user does not exists, add it to the group
      if (!group.users.find(u => u.username === user.title)) {
        group.users.push(user)
      }
      // Add the group to server's group list if it is not already present
      if (!allGroups.find(g => g.title === group.title)) {
        allGroups.push(group)
        console.log('New group created : ' + JSON.stringify(ctx.data.group))
      }

      // We only show the welcome message once, for that we check that the user is not yet in the group
      if (!Object.keys(ctx.socket.rooms).includes(group.title)) {
        ctx.socket.join(group.title)
        console.log(ctx.io.sockets.adapter.rooms)
        // TODO, be able to leave a group
        if (oldGroup.title !== defaultGroupName) {
          // Notify the old group that the user leaves, we don't send the message to the sender
          // ctx.socket.leave(oldGroup.title)
          // ctx.io.to(oldGroup.title).emit('onGroupChanged', { mode: 'leave', user: ctx.data.user })
        }
        // Notify the joined group that the user is here
        ctx.io.in(group.title).emit('onGroupChanged', { mode: 'join', user: ctx.data.user, newGroupName: group.title })
        console.log('Emitted the event onGroupChanged for the group : ' + group.title)
      }
      // console.log(user.username + ' joined the group: ' + group.title)
    } else {
      console.log('Error, incomplete data, either the group object or the user that wants to join is not defined')
    }
  }),
  socket('requestGroups', ctx => {
    const finalGroups = []
    console.log(JSON.stringify(allGroups))
    for (var g in allGroups) {
      for (var u in allGroups[g].users) {
        const username = allGroups[g].users[u].username
        if (username === ctx.data.username) {
          finalGroups.push(allGroups[g])
        }
      }
    }
    ctx.socket.emit('onGroupsLoaded', finalGroups)
  })
])
  .then(() => console.log(`Server running at http://localhost:${port}`))
