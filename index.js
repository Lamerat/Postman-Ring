const fs = require('fs')
const { groupUngroupedRequests, generateAddresses, generateEndpointsList, createCustomSection } = require('./src/common')
const { generateVariables } = require('./src/variables')
const { generateEndpointGroup } = require('./src/endpoint')


/**
 * @typedef options
 * @type { object }
 * @property { string } version API version
 * @property { string[] } additionalAddresses Add API addresses what don't included in Postman JSON
 * @property { { title: string, text: string }[] } additionalSections Add custom section between addresses and endpoints
 */


/**
 * Generate HTML documentation from exported Postman JSON
 * @param { string } postman 
 * @param { options } [options] 
 * @returns { string } 
 */
module.exports = (postman, options) => {
  const { variable, item, info } = postman

  generateVariables(variable)
  const endpoints = groupUngroupedRequests(item)
  
  if (options?.additionalSections) {
    if (!Array.isArray( options.additionalSections)) throw new Error(`Field 'options.additionalSections' must be array`)

    options.additionalSections?.forEach(x => {
      if (typeof x !== 'object') throw new Error(`Field 'options.additionalSections' must be array of objects`)
      if (!x.title || typeof x.title !== 'string') throw new Error(`Field 'options.additionalSections.title' must be type string`)
      if (!x.text || typeof x.text !== 'string') throw new Error(`Field 'options.additionalSections.text' must be type string`)
    })
  } 
  

  const remap = {
    '{{serverName}}': info.name || '',
    '{{serverVersion}}': options?.version || '1.0.0',
    '{{serverAddress}}': generateAddresses(endpoints, options?.additionalAddresses),
    '{{serverEndpoints}}': generateEndpointsList(endpoints),
    '{{endpoints}}': endpoints.map(x => generateEndpointGroup(x)).join('\n'),
    '{{customSections}}': options?.additionalSections ? options.additionalSections.map(x => createCustomSection(x.title, x.text)) : ''
  }

  let template = fs.readFileSync(__dirname + '/templates/template.html', 'utf-8')
  Object.keys(remap).forEach(key => template = template.replace(key, remap[key]))

  return template
}




