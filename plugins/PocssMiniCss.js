const postcss = require('postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
class PocssMiniCss {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('PocssMiniCss', (compliation, callback) => {
      let assetsNames = Object.keys(compliation.assets).filter(asset => /\.css(\?.*)?$/i.test(asset))
      const promises = []
      assetsNames.forEach(assetName => {
        let originCss = compliation.assets[assetName].source()
        const postCssOptions = {
          from: assetName,
          to: assetName,
          map: false,
        };
        let promise = postcss([autoprefixer({
          'overrideBrowserslist': [
            'last 10 Chrome versions',
            'last 5 Firefox versions',
            'Safari >= 6',
            'ie> 8',
            '> 1%'
          ]
        }), cssnano({
          preset: 'default'
        })]).process(originCss, postCssOptions).then(result => {
          console.log(result.css)
          compliation.assets[assetName] = {
            source() {
              return result.css
            },
            size() {
              return result.css.length
            }
          }
        }).catch(e => {
          console.log(e)
        })
        promises.push(promise)
      })
      Promise.all(promises).then(() => {
        callback()
      }).catch(callback)
    })
  }
}

module.exports = PocssMiniCss