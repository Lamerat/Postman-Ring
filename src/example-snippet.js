/**
 * Add example body code snippet
 * @param {{ body: { mode: string, raw: string, options: object }}} request 
 * @param { string } color 
 * @returns { string }
 */
exports.addExampleBody = (request, color) => {
  if (!request.body || request.body.mode !== 'raw') return ''
  return `
    <div class="param-div">
      <div style="font-weight: bold; color: ${color};">Example body</div>
      <pre style="margin-bottom: 0px; overflow: hidden; border-radius: 5px;"><code class="language-json" style="font-size: small; background-image: none; border: 0px; box-shadow: none; padding: 1em;">${request.body.raw}</code></pre>
    </div>
  `
}


/**
 * 
 * @param { { code: number, _postman_previewlanguage: string, body: string }[] } response 
 * @param {*} color 
 * @returns { string }
 */
exports.addExampleResult = (response, color) => {
  if (!response.length) return ''
  const first = response[0]

  if (!first.body || first._postman_previewlanguage !== 'json' || first.code < 200 || first.code >= 300) return ''
  return `
    <div class="param-div">
      <div style="font-weight: bold; color: ${color};">Example result</div>
      <pre style="margin-bottom: 0px; overflow: hidden; border-radius: 5px;"><code class="language-json" style="font-size: small; background-image: none; border: 0px; box-shadow: none; padding: 1em;">${first.body}</code></pre>
    </div>
  `
}