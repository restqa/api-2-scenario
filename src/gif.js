const got = require('got')
const { URL } = require('url')

exports.get = () => {
  let url = new URL('https://api.giphy.com/v1/gifs/random')
  url.searchParams.append('apiKey', $.config.giphy.apiKey)
  url.searchParams.append('tag', 'ready')
  return got(url, {responseType: 'json'})
    .then(_ => {
      return _.body.data.image_original_url
    })
    .catch(_ => {
      return 'https://media.giphy.com/media/8YHmc8luwmJJjFY7zh/giphy.gif'
    })
}
