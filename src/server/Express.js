const server = require('server')
const axios = require('axios')
const { get, socket } = require('server/router')

const port = process.env.PORT || 3001

server({ port }, [
  get('/', ctx => '<h1>Hello you!</h1>'),
  socket('message', ctx => {
    // Send the message to every socket
    console.log('broadcast')
    var msg = getMessageWithTranslation(ctx.data, 'en')
    ctx.io.emit('message', msg)
  }),
  socket('connect', ctx => {
    console.log('client connected', Object.keys(ctx.io.sockets.sockets))
    ctx.io.emit('count', { msg: 'HI U', count: Object.keys(ctx.io.sockets.sockets).length })
  })
])
  .then(() => console.log(`Server running at http://localhost:${port}`))

async function getMessageWithTranslation (text, targetLanguage) {
  const key = 'trnsl.1.1.20200419T135148Z.c4fac443bbed2781.b22675d40250840dd99e7ad5aec754f224de4dc1'
  const requestURL = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key + '&text=' + text + '&lang=' + targetLanguage
  const response = await axios.get(requestURL)
  const responseOK = response && response.status === 200 && response.statusText === 'OK'
  if (responseOK) {
    console.log('Translated text: ' + response.data.text)
    return { original: text, translation: response.data.text }
  } else {
    return { original: text, translation: 'Erreur de traduction' }
  }
}
