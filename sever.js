const express = require('express')
const Scenario = require('./src/scenario')
const Gif = require('./src/gif')

global.$ = {
  config : {
    giphy: {
      apiKey: process.env.GIPHY_API_KEY
    },
    port: process.env.PORT || 8080
  }
}

express()
  .use(express.static('public'))
  .post('/curl', express.urlencoded({ extended: true }), (req, res) => {
    try {
      let { cmd } = req.body
      Scenario
        .get(cmd)
        .then(result => res.send(result))
        .catch(err => {
          throw err
        })
    } catch(err) {
      console.log(err, 'eeeee')
      res.status(500).send(err.message)
    }
  })
  .get('/ready.gif', (req, res) => {
    Gif.get('ready').then(url => res.send(url))
  })
  .get('/error.gif', (req, res) => {
    Gif.get('error').then(url => res.send(url))
  })
  .listen($.config.port, () => {
    console.log(`Server start on the port ${$.config.port}`)
  })
