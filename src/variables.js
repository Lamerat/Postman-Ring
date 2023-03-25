const variables = {}

/**
 * Get variables from Postman JSON
 * @param {{ key: string, value: string, type: string }[]} variable 
 */
exports.generateVariables = (variable) => {
  if (variable) variable.forEach(x => variables[x.key] = x.value)
}


/**
 * Replace variable with value if exists
 * @param { string } str 
 * @returns 
 */
exports.checkIsVariable = (str) => {
  if (str.startsWith('{{') && str.endsWith('}}')) {
    const value = str.replace('{{', '').replace('}}', '')
    return variables[value]
  }
  return str
}
