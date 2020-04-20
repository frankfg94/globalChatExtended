const server = require('server')
const { get, socket } = require('server/router')

const port = process.env.PORT || 3001

server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', async ctx => {
    // Send the message to every socket
    // const msg = await getMessageWithTranslation(ctx.data.text, ctx.data.ui)
    ctx.io.emit('newMessage', { original: ctx.data.text })
  }),

  socket('connect', ctx => {
    console.log('client connected', Object.keys(ctx.io.sockets.sockets))
    ctx.io.emit('count', { msg: 'HI U', count: Object.keys(ctx.io.sockets.sockets).length })
  })
])
  .then(() => console.log(`Server running at http://localhost:${port}`))
