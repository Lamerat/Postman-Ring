# Postman-Ring
Create simple HTML documentation (swagger style) from Postman export JSON file

### Remarks
- Library can't parse Markdown syntax from Postman descriptions
- Get data from Header, Query and Path parameters
- Work only with raw JSON body
- Recognized auth methods
  - API key
  - Authorization header
  - Bearer token
  - Basic auth
  - Digest auth

### Installation
```sh
npm i postman-rings
```

### Usage
```JavaScript
// ES6
import postman from 'postman-rings'
import fs from 'fs'

const file = JSON.parse(fs.readFileSync('./examplePostman.json').toString())
const html = postman(file, { version: '1.0.2' })

// No ES6
const postman = require('postman-rings')
const file = require('./examplePostman.json')

const html = postman(file, {version: '1.0.2'})
```

### Syntax
__postman__(str {, options})

#### Options
* __version__: _string_ - Add version number in badge after API name
* __additionalAddresses__: _string[ ]_ - Add custom addresses to Address section
* __additionalSections__: _{ title: string, text: string }[ ]_ Add custom section(s) between Addresses and Endpoints section


### Example documentation page
https://lamerat.github.io/Postman-Ring/