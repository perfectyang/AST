let fs = require('fs')
let loaderUtils = require('loader-utils')
let valiation = require('schema-utils')

function loader(source) {
  // Object.keys(this).forEach(key => console.log(key))
  console.log('a', this.resource)
  console.log('b', this.resourcePath)
  console.log('c', this.resourceQuery)
  let cb = this.async()
  let options = loaderUtils.getOptions(this)
  let schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string',
      },
      filename: {
        type: 'string'
      }
    }
  }
  valiation(schema, options, 'demo-loader1')
  if (options.filename) {
    this.addDependency(options.filename)
    fs.readFile(options.filename, 'utf8', (err, data) => {
      cb(err, `/**${data}**/${source}`)
    })
  } else {
    cb(null, `/**${options.text}**/${source}`)
  }
}

module.exports = loader