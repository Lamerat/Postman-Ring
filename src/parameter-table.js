const { checkIsVariable } = require('./variables')

/**
 * Create start and end tags for parameters table
 * @param { string } color 
 * @param { 'Path' | 'Body' | 'Query' | 'Header' } title 
 * @param { string } description 
 * @returns 
 */
const startAndEndTags = (color, title, description = '') => {
  const startTags = `
  <div class="param-div">
    <div style="font-weight: bold; color: ${color}">${title} parameters ${description}</div>
    <table class="uk-table uk-table-small uk-table-divider" style="font-size: small; margin: 0px;">
      <thead>
        <tr>
          <th style="width: 20%;">Parameter</th>
          <th style="width: 10%;">Data type</th>
          <th style="width: 30%;">Example value</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
  `
  const endTags = `</tbody></table></div>`

  return { startTags, endTags }
}


/**
 * Create table for path parameters
 * @param { { variable: { key: string, value: string, description: string }[] } } url 
 * @param { string } color 
 * @returns { string }
 */
exports.pathParameters = (url, color) => {
  if (!url || !url.variable || !Array.isArray(url.variable) || !url.variable.length ) return ''

  const tags = startAndEndTags(color, 'Path')

  const rows = url.variable.map(x => {
    const value = x.value ? checkIsVariable(x.value) : '-'
    return `
      <tr>
        <td >${x.key ? checkIsVariable(x.key) : '-'}</td>
        <td >${value !== '-' ? typeof value : '-' }</td>
        <td >${value}</td>
        <td>${x.description || '-'}</td>
      </tr>
    `
  }).join('\n')
  
  return `${tags.startTags}${rows}${tags.endTags}`
}


/**
 * Create table for query parameters
 * @param { { query: { key: string, value: string, description: string }[] } } url 
 * @param { string } color 
 * @returns { string }
 */
exports.queryParameters = (url, color) => {
  if (!url || !url.query || !Array.isArray(url.query) || !url.query.length ) return ''

  const tags = startAndEndTags(color, 'Query')

  const rows = url.query.map(x => {
    const value = x.value ? checkIsVariable(x.value) : '-'
    return `
      <tr>
        <td >${x.key ? checkIsVariable(x.key) : '-'}</td>
        <td >${value !== '-' ? typeof value : '-' }</td>
        <td >${value}</td>
        <td>${x.description || '-'}</td>
      </tr>
    `
  }).join('\n')
  
  return `${tags.startTags}${rows}${tags.endTags}`
}


/**
 * Create table for header parameters
 * @param { { key: string, value: string, description: string, type: string }[] } header 
 * @param { string } color 
 * @returns { string }
 */
exports.headerParameters = (header, color) => {
  if (!header || !Array.isArray(header) || !header.filter(x => x.key !== 'Authorization').length) return ''
  const tags = startAndEndTags(color, 'Header')

  const rows = header.filter(x => x.key !== 'Authorization').map(x => {
    const value = x.value ? checkIsVariable(x.value) : '-'
    return `
      <tr>
        <td >${x.key ? checkIsVariable(x.key) : '-'}</td>
        <td >${value !== '-' ? typeof value : '-' }</td>
        <td >${value}</td>
        <td>${x.description || '-'}</td>
      </tr>
    `
  }).join('\n')
  
  return `${tags.startTags}${rows}${tags.endTags}`
}


/**
 * Create table for body (raw) parameters
 * @param {{ mode: string, raw: object, options: { raw: { language: string } } }} requestBody 
 * @param { string } color 
 * @returns { string }
 */
exports.bodyParameters = (requestBody, color) => {
  if (!requestBody || !requestBody.raw) return ''
  if (requestBody.mode && requestBody.mode !== 'raw') return ''
  if (requestBody?.options?.raw?.language !== 'json') return ''

  let body = JSON.parse(requestBody.raw)
  if (typeof body !== 'object') return ''

  let title = ' - Object'
  if (Array.isArray(body)) {
    const types = body.map(x => typeof x)
    const uniqueTypes = new Set(types)
    if (uniqueTypes.size !== 1 || !uniqueTypes.has('object')) return ''
    title = ` - Array (${types[0]}s)`
    body = body[0]
  }

  const row = (name, value, padding = 8) => {
    let type = value === null ? null : typeof value

    if (type === 'object' && Array.isArray(value)) {
      const types = value.map(s => typeof s)
      const uniqueTypes = new Set(types)
      if (!types.length || uniqueTypes.size !== 1) {
        type = 'array (any)'
      } else {
        type = `array of ${types[0]}s`
        value = value[0]
      }
    }

    if (type === 'object' || type === 'array of objects') {
      return `<tr><td style="padding-left: ${padding}px;">${padding > 8 ? '<i class="bi bi-braces"></i> ' : ''}${name}</td><td >${type}</td><td></td><td> - </td></tr>${Object.keys(value).map(x => row(x, value[x], padding + 16)).join('\n')}`
    }

    return `<tr><td style="padding-left: ${padding}px;">${padding > 8 ? '<i class="bi bi-braces"></i> ' : ''}${name}</td><td>${type}</td><td>${value}</td><td> - </td></tr>`
  }

  const rows = Object.keys(body).map(x => row(x, body[x])).join('\n')
  const tags = startAndEndTags(color, 'Body', title)
  
  return `${tags.startTags}${rows}${tags.endTags}`
}
