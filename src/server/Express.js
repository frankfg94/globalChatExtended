const server = require('server')
const { get, socket } = require('server/router')
const port = process.env.PORT || 3001
const allClients = []

server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', ctx => {
    // Send the message to every socket
    ctx.io.emit('newMessage', ctx.data)
  }),

  socket('connect', ctx => {
    console.log('client connected', Object.keys(ctx.io.sockets.sockets))
    //  allClients.push(ctx)
    socket('changeRoom', function (roomName) {
      console.log('Client ' + ctx.socket.id + ' joined the room : ' + roomName)
      socket.join(roomName)
    })
    /*
    socket('disconnect', function () {
      var i = allClients.indexOf(ctx)
      allClients.splice(i, 1)
    })
    */
  }),
  socket('userList', ctx => {
    var allClientsFormatted = []
    if (allClients.find(x => x.ctx === ctx) === undefined) {
      allClients.push({ ctx: ctx, username: ctx.data.username })
    }
    for (let i = 0; i < allClients.length; i++) {
      allClientsFormatted.push({ username: allClients[i].username })
    }
    ctx.io.emit('userListObtained', allClientsFormatted)
  })
])
  .then(() => console.log(`Server running at http://localhost:${port}`))
