const { checkIsVariable } = require('./variables')

exports.methodsColors = {
  POST: { primary: '#f0a44b', secondary: '#fdf6ed' },
  GET: { primary: '#70c995', secondary: '#f2fcf9' },
  PUT: { primary: '#72aff8', secondary: '#f1f7fe' },
  DELETE: { primary: '#e64f47', secondary: '#fcedec' },
  OTHER: { primary: '#d38042', secondary: '#fce9e3' }
}


/**
 * Found request ins Postman JSON and push it in "folder" with name Ungrouped
 * @param {any[]} item 
 */
exports.groupUngroupedRequests = (item) => {
  const endpoints = item.filter(x => x.item)
  const ungrouped = []
  item.filter(x => !x.item).forEach(x => ungrouped.push(x))
  if (ungrouped.length) endpoints.push({ name: 'Ungrouped', item: ungrouped })
  return endpoints
}


/**
 * Get all addresses from requests and format it in HTML
 * @param { any[] } items 
 * @param { string[] } additional 
 * @returns { string }
 */
exports.generateAddresses = (items, additional = []) => {
  const concatAddress = (url) => {
    const protocol = url.protocol ? `${url.protocol}://` : ''
    return protocol.concat(url.host.join('.'))
  }

  const requests = items.map(x => x.item ? x.item.map(s => concatAddress(s.request.url)) : concatAddress(x.request.url)).flat()
  const unique = [...new Set(requests)].map(x => checkIsVariable(x))
  return unique.length ? unique.concat(additional).map(x => `<li>${x}</li>`).join('\n') : 'Not found'
}


/**
 * Get all "folders" from Postman JSON
 * @param { any[] } items 
 * @returns { string }
 */
exports.generateEndpointsList = (items) => {
  const result = items.map(x => `<li><a href="#${x.name}-endpoints">${x.name} endpoints</a></li>`)
  return result.length ? result.join('\n') : 'none'
}

/**
 * Create custom section
 * @param { string } title 
 * @param { string } text 
 * @returns { string }
 */
exports.createCustomSection = (title, text) => `<div class="section">${title}</div>${text}`
