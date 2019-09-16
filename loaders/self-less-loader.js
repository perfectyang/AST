let fs = require('fs')
let loaderUtils = require('loader-utils')
let less = require('less')

function loader(source) {
  let cb = this.async()
  // let options = loaderUtils.getOptions(this)
  less.render(source, {sourceMap: {sourceMapFileInline: true}}).then((output) => {
    console.log('less输入', output)
    console.log('output', output.css)
      // output.css = string of css
      // output.map = string of sourcemap
      // output.imports = array of string filenames of the imports referenced
      cb(null, output.css, output.map)
  }, cb)
}

module.exports = loader