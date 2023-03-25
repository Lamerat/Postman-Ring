const { checkIsVariable } = require('./variables')

/**
 * Check string is JWT
 * @param { string } jwt 
 * @returns { boolean }
 */
const isJWT = (jwt) => {
  const jwtSplitted = jwt.split('.')
  if (jwtSplitted.length !== 3) return false

  const jsonFirstPart = Buffer.from(jwtSplitted[0], 'base64').toString()
  const firstPart = JSON.parse(jsonFirstPart)
  if (!firstPart.hasOwnProperty('alg') || !firstPart.hasOwnProperty('typ') || firstPart.typ !== 'JWT') return false

  return true
}


/**
 * Check request include auth param or 'Authorization' header
 * @param { { auth: { type: string }, header: { key: string, value: string, description: string }[] } } request
 * @returns { boolean } 
 */
exports.checkForAuthorization = (request) => {
  const { auth, header } = request
  return Boolean((auth || header.filter(x => x.key === 'Authorization').length))
}


/**
 * Check request include auth param or 'Authorization' header
 * @param { { auth: { type: string }, header: { key: string, value: string, description: string }[] } } request
 * @returns { string } 
 */
authorizationMethod = (request) => {
  const { auth, header } = request
  
  const authHeader = header.filter(x => x.key === 'Authorization')
  if (authHeader.length) {
    const authValue = checkIsVariable(authHeader[0].value)
    const type = isJWT(authValue) ? 'JSON Web Token (JWT)' : authValue
    return `<strong>Authorization</strong> header with value <i>${type}</i>`
  }

  let authText = `<em>This type of authorization can't be recognized by <strong>Postman Ring</strong></em>`

  switch (auth.type) {
    case 'bearer':
      const type = isJWT(checkIsVariable(auth.bearer[0].value))
      authText = `<strong>Bearer</strong> Token ${type ? '(JWT)' : ''}`
      break
    case 'basic':
      const basicAuth = auth.basic.map(x => `<i>${x.key}</i>`).reverse().join(' and ')
      authText = `<strong>Basic Auth</strong> with ${basicAuth}`
      break
    case 'apikey':
      const apiAuthKey = auth.apikey.find(x => x.key === 'key')?.value
      const apiAuthValueType = auth.apikey.find(x => x.key === 'value')?.type
      const apiAuthValueIn = auth.apikey.find(x => x.key === 'in')?.value === 'query' ? 'Query params' : 'Headers'      
      authText = `<strong>API Key</strong> with <strong>key</strong> <i>${apiAuthKey || ''}</i> and <strong>value</strong> type <i>${apiAuthValueType || ''}</i>. Must be added in <strong>${apiAuthValueIn}</strong>`
      break
    case 'digest':
      const digestAuth = auth.digest.filter(x => x.key !== 'algorithm').map(x => `<i>${x.key}</i>`).reverse().join(' and ')
      const algorithm = auth.digest.find(x => x.key === 'algorithm')?.value
      const algorithmText = algorithm ? `. Algorithm is <strong>${algorithm}</strong>` : ''
      authText = `<strong>Digest Auth</strong> with ${digestAuth}${algorithmText}`
      break
    default:
      break
  }

  return authText
}


exports.authorizationSection = (request, color) => {
  if (!this.checkForAuthorization(request)) return ''
  return `<div class="param-div"><div style="font-weight: bold; color: ${color}">Authorization</div><div style="font-size: 14px;">${authorizationMethod(request)}</div></div>`
}