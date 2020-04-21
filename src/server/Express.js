const server = require('server')
const { get, socket } = require('server/router')
const port = process.env.PORT || 3001
const allClients = []

server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', ctx => {
    ctx.io.emit('newMessage', ctx.data)
  }),

  socket('connection', ctx => {
    /*
    socket('disconnect', function () {
      var i = allClients.indexOf(ctx)
      allClients.splice(i, 1)
    })
    */
    socket('changeRoom', () => {
      console.log('sans rien')
      console.log('Client ' + ctx.socket.id + ' joined the room : ' + ctx.data)
      ctx.join(ctx.data)
    })
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
