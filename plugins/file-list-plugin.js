class FileListPlugin {
  constructor(options = {}) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compliation, cb) => {
      let allAssets = compliation.assets
      console.log(Object.keys(allAssets))
      let txt = ''
      Object.keys(allAssets).forEach(file => {
        txt += `##${file} \n`
      })
      compliation.assets['list.md'] = {
        source() {
          return txt
        },
        size() {
          return txt.length
        }
      }
      cb()
    })
  }

}

module.exports = FileListPlugin