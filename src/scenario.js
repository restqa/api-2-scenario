const { URL } = require('url')
const curlconverter = require('curlconverter')
const got = require('got')
const flatten = require('flat')

exports.get = (cmd) => {
  cmd = cmd.replace(/[ ]{2,}/g, ' ')

  const result = [
    'Given I have the api gateway'
  ]

  const request = JSON.parse(curlconverter.toJsonString(cmd))
  const url = new URL(request.url)

  result.push(`  And I have the path "${url.pathname}"`)
  result.push(`  And I have the method "${request.method.toUpperCase()}"`)

  request.queries && Object.keys(request.queries).forEach(key => {
    result.push(`  And the query parameter contains "${key}" as "${request.queries[key]}"`)
  })

  let isJson = false
  if (request.headers) {
    Object.keys(request.headers).forEach(key => {
      result.push(`  And the header contains "${key}" as "${request.headers[key]}"`)
    })
    isJson = Object.values(request.headers).map(_ => _.toLowerCase()).includes('application/json')
  }

  if (request.data) {
    if (isJson) {
      let payload = JSON.parse(Object.keys(request.data)[0])
      payload = flatten(payload)
      Object.keys(payload).forEach(key => {
        let value = payload[key]
        if (typeof value === 'string') {
         value = `"${value}"`
        }
        result.push(`  And the payload contains "${key}" as ${value}`)
      })

      delete request.data
      request.responseType = 'json'
      request.json = payload
    }
  }

  result.push('When I run the API')

  return got(request).then(_ => _).catch(err => err.response)
    .then(_ => {
      result.push(`Then I should receive a response with the status ${_.statusCode}`)
      isJson = Object.values(_.headers).filter(_ => typeof _ === 'string').map(_ => _.toLowerCase()).find(_ => _.match(/application\/(.*)json/))
      if (isJson) {
        if (typeof _.body === 'string') _.body = JSON.parse(_.body)
        const flat = flatten(_.body)
        Object.keys(flat).forEach(key => {
          switch (typeof flat[key]) {
            case ('string'):
              result.push(` And the response body at "${key}" should equal "${flat[key]}"`)
              break
            case ('number'):
              if (Number.isInteger(flat[key])) {
                result.push(` And the response body at "${key}" should equal ${flat[key]}`)
              }
              break
            default:
              if (Array.isArray(flat[key])) {
                result.push(` And the response body at "${key}" should be an array`)
              } else if (flat[key] === null) {
                result.push(` And the response body at "${key}" should be null`)
              } else {
                result.push(` And the response body at "${key}" should equal ${flat[key]}`)
              }
          }
        })
      }
      return result.join('\n')
    })
}
