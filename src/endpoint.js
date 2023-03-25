const { pathParameters, queryParameters, bodyParameters, headerParameters } = require('./parameter-table')
const { checkForAuthorization, authorizationSection } = require('./authorization')
const { addExampleBody, addExampleResult } = require('./example-snippet')
const { methodsColors } = require('./common')
const { checkIsVariable } = require('./variables')

const endpointTag = (data) =>  {
  const { request, response } = data

  const formatPath = request.url.path.map(x => x.startsWith(':') ? ':' + checkIsVariable(x.slice(1)) : checkIsVariable(x))

  const path = '/' + formatPath.join('/')
  const method = request.method
  const description = request.description || ''
  const colors = methodsColors[method] || methodsColors.OTHER
  const authIcon = checkForAuthorization(request) ? `<i class="bi bi-key-fill" style="color: black; margin-right: 16px;" uk-tooltip="Require authorization"></i>` : ''

  const html = `
    <li style="padding: 6px; border: 1px solid ${colors.primary}; background-color: ${colors.secondary}; border-radius: 4px; margin: 4px 0px; font-size: 1rem;">
      <ul uk-nav="multiple: true" uk-nav style="padding: 0px;">
        <li class="uk-parent">
          <a href="#" style="padding: 0px; margin-right: 8px;">
            <div class="endpoint-holder">
              <div class="endpoint">
                <div class="method" style="background-color: ${colors.primary}">${method}</div>
                <div class="endpoint-title">${path}</div>
                <div class="endpoint-description">${description}</div>
              </div>
              ${authIcon}
            </div>
            <span uk-nav-parent-icon></span>
          </a>
          <ul class="uk-nav-sub" style="padding: 0px;">
            ${authorizationSection(request, colors.primary)}
            ${headerParameters(request.header, colors.primary)}
            ${pathParameters(request.url, colors.primary)}
            ${queryParameters(request.url, colors.primary)}
            ${bodyParameters(request.body, colors.primary)}
            ${addExampleBody(request, colors.primary)}
            ${addExampleResult(response, colors.primary)}
          </ul>
        </li>
      </ul>
    </li>
  `
  return html
}


/**
 * Generate endpoint requests group
 * @param { { name: string, item: any[] } } endpoint 
 * @returns { string }
 */
exports.generateEndpointGroup = (endpoint) => {
  const { name, item } = endpoint

  const startTags = `
  <ul id="${name}-endpoints" uk-nav="multiple: true" class="uk-nav-primary" uk-nav >
    <li class="uk-parent" style="padding: 4px 0px">
      <a href="#" style="padding: 0px 10px; font-size: 22px;">${name}<span uk-nav-parent-icon></span></a>
      <hr style="margin: 0px;" />
      <ul class="uk-nav-sub" style="padding: 0;">
  `
  const endTags = `</ul></li></ul>`
  const endpointsData = item.map(x => endpointTag(x)).join('\n')

  return `${startTags}${endpointsData}${endTags}`
}