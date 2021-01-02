const got = require('@restqa/restqapi/node_modules/got')
const { URL } = require('url')

exports.get = (tag) => {
  const url = new URL('https://api.giphy.com/v1/gifs/random')
  url.searchParams.append('apiKey', $.config.giphy.apiKey)
  url.searchParams.append('tag', tag)
  return got(url, { responseType: 'json' })
    .then(_ => {
      return _.body.data.image_original_url
    })
    .catch(_ => {
      let url = 'https://media.giphy.com/media/8YHmc8luwmJJjFY7zh/giphy.gif'
      if (tag === 'error') url = 'https://media.giphy.com/media/dlMIwDQAxXn1K/giphy.gif'
      return url
    })
}
