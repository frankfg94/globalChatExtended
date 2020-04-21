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
  socket('getUserList', ctx => {-
    // On prend l'envoyeur de la requête, afin de pouvoir l'enlever au tableau lors du filtrage, comme ça il pourra retourner au chat
    var senderUser = ctx.data;
    // TODO : Marine replacer avec la vraie liste des utilisateurs
    const mockUserList =
    [
      {
        username: 'Nicolas',
        icon: 'far fa-angry'
      },
      {
        username: 'François',
        icon: 'far fa-angry'
      }
    ]
    // Ce tableau ne doit pas comprendre l'utilisateur qui envoie la requête (afin qu'il puisse se reconnecter)
    var filtered = mockUserList.filter(function(item) { 
      return item.username !== senderUser.username
   });
    ctx.io.emit('userListReceived', filtered)
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
