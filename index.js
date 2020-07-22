const express = require('express')
const { URL } = require('url')
const curlconverter = require('curlconverter');
const got = require('got')
const flatten = require('flat')

let config = {
  giphy: {
    apiKey: process.env.GIPHY_API_KEY
  },
  port: process.env.PORT || 8080
}

express()
  .use(express.static('public'))
  .use(express.urlencoded({ extended: true }))
  .post('/curl', (req, res) => {
    let result = [
      'Given I have the api gateway'
    ]
    let { cmd } = req.body
    let request = JSON.parse(curlconverter.toJsonString(cmd))
    let url = new URL(request.url)

    result.push(`  And I have the path "${url.pathname}"`)
    result.push(`  And I have the method "${request.method.toUpperCase()}"`)

    Object.keys(request.queries).forEach(key => {
      result.push(`  And the query parameter contains "${key}" as "${request.queries[key]}"`)
    })

    Object.keys(request.headers).forEach(key => {
      result.push(`  And the header contains "${key}" as "${request.headers[key]}"`)
    })

    result.push(`When I run the API`)
    got(request)
      .then(_ => _)
      .catch(err => {
        return err.response
      })
      .then(_ => {
        result.push(`Then I should receive a response with the status ${_.statusCode}`)
        let flat = flatten(JSON.parse(_.body))
        Object.keys(flat).forEach(key => {
          if (typeof flat[key] === 'string') {
            result.push(` And the response body at "${key}" should equal "${flat[key]}"`)
          } else {
            result.push(` And the response body at "${key}" should equal ${flat[key]}`)
          }
        })
        return res.send(result.join('\n'))
      })

  })
  .get('/ready.gif', (req, res) => {
    let url = new URL('https://api.giphy.com/v1/gifs/random')
    url.searchParams.append('apiKey', config.giphy.apiKey)
    url.searchParams.append('tag', 'ready')
    got(url)
      .then(_ => {
        return JSON.parse(_.body).data.image_original_url
      })
      .catch(_ => {
        return 'https://media.giphy.com/media/8YHmc8luwmJJjFY7zh/giphy.gif'
      })
      .then(_ => {
        res.send(_)
      })
  })
  .listen(config.port, () => {
    console.log(`Server start on the port ${config.port}`)
  })
