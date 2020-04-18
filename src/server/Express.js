/* const express = require('express')
const app = express()
const port = 3001

const server = app.listen(port, function () {
  console.log('server is running on port 3001')
})

const io = require('socket.io')(server)

io.on('connection', socket => {
  console.log('connected' + socket.id)
  // socket.broadcast.emit('message', 'Someone joined the chat')
  io.on('message', () => {
    console.log('new message express.js')
  })
}) */

// server.js
// load the server resource and route GET method
const server = require('server')
const { get, socket } = require('server/router')

// get server port from environment or default to 3000
const port = process.env.PORT || 3001

server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', ctx => {
    // Send the message to every socket
    console.log('broadcast')
    ctx.io.emit('message', ctx.data)
  }),
  socket('connect', ctx => {
    console.log('client connected', Object.keys(ctx.io.sockets.sockets))
    ctx.io.emit('count', { msg: 'HI U', count: Object.keys(ctx.io.sockets.sockets).length })
  })
])
  .then(() => console.log(`Server running at http://localhost:${port}`))
