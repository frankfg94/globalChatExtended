const server = require('server')
const { get, socket } = require('server/router')
const port = process.env.PORT || 3001
const allClients = []

server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', ctx => {
    ctx.io.emit('newMessage', ctx.data)
  }),
  socket('changeRoom', ctx => {
    console.log('sans rien : ' + ctx.data)
    ctx.socket.join(ctx.data)
    console.log('Derniere ligne', ctx.socket.rooms)
  }),
  socket('getUserList', ctx => {
    // On prend l'envoyeur de la requête, afin de pouvoir l'enlever au tableau lors du filtrage, comme ça il pourra retourner au chat
    const senderUser = ctx.data;
    // Ce tableau ne doit pas comprendre l'utilisateur qui envoie la requête (afin qu'il puisse se reconnecter)
    const filtered = allClients.filter(function(item) { 
      return item.username !== senderUser.username
    })
    ctx.io.emit('userListReceived', filtered)
  }),

  socket('userRegistered', ctx => {
    const user = ctx.data
    if (allClients.find(x => x.username === user.username) === undefined) {
      allClients.push(ctx.data)
    }
    ctx.io.emit('newUserJoined', allClients)
  })
])
  .then(() => console.log(`Server running at http://localhost:${port}`))
