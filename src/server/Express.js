const server = require('server')
const { get, socket } = require('server/router')

const port = process.env.PORT || 3001

server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', ctx => {
    // Send the message to every socket
    ctx.io.emit('newMessage', ctx.data)
  }),

  socket('connect', ctx => {
    console.log('client connected', Object.keys(ctx.io.sockets.sockets))
    ctx.io.emit('count', { msg: 'HI U', count: Object.keys(ctx.io.sockets.sockets).length })
  })
])
  .then(() => console.log(`Server running at http://localhost:${port}`))
