const server = require('server')
const { get, socket } = require('server/router')
const port = process.env.PORT || 3001
let allClients = []

server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', ctx => {
    ctx.io.emit('newMessage', ctx.data)
  }),
  socket('changeRoom', ctx => {
    ctx.socket.join(ctx.data)
  }),
  socket('getUserList', ctx => {
    // On prend l'envoyeur de la requête, afin de pouvoir l'enlever au tableau lors du filtrage, comme ça il pourra retourner au chat
    const senderUser = ctx.data
    if (senderUser == null) {
      throw new Error('User is null')
    }
    // Ce tableau ne doit pas comprendre l'utilisateur qui envoie la requête (afin qu'il puisse se reconnecter)
    const filtered = allClients.filter(function (item) {
      return item.username !== senderUser.username
    })
    ctx.io.emit('userListReceived', filtered)
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
