class Annotation {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tap('Annotation', (compliation) => {
      let assets = compliation.assets;
      Object.entries(assets).forEach(([filename, statObj]) => {
        let source = statObj.source()
        if (/\.js$/.test(filename)) {
          let annotation = `
          /*
            快决测公司
            @招人啊
          */
          `
          source = `${annotation}${source}`
          assets[filename] = {
            source() {
              return source
            },
            size() {
              return source.length;
            }
          }
        }
      })
    })
  }
}

module.exports = Annotation