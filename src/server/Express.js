const server = require('server')
const { get, socket } = require('server/router')
const port = process.env.PORT || 3001
let allClients = []

server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', ctx => {
    ctx.io.emit('newMessage', ctx.data)
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
    if (allClients.find(x => x.username === user.username) === undefined) {
      allClients.push(ctx.data)
    }
    ctx.io.emit('userListChanged', allClients)
  }),
  socket('refresh', ctx => {
    allClients = allClients.filter(u => u.username !== ctx.data.username)
    ctx.io.emit('userListChanged', allClients)
  }),
  socket('userGone', ctx => {
    allClients = allClients.filter(u => u.username !== ctx.data.username)
    ctx.io.emit('userListChanged', allClients)
  })
])
  .then(() => console.log(`Server running at http://localhost:${port}`))
