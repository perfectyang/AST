const getTranslateKey = require('./getTranslateKey')
const fs = require('fs-extra')
const path = require('path')
const tsAll = require('./fy')
const resolve = f => path.resolve(process.cwd(), f)
class Genratets {
  constructor ({
    // 输出文件
    output = [
      './src/i18n/zh.js',
      './src/i18n/en.js',
      './src/i18n/gb.js',
    ]
  } = {}) {
    this.output = Array.isArray(output) ? output : [output]
    this.__zhCache = {}
    this.__enCache = {}
    this.__gbCache = {}
  }
  generateTranslateKeyFile (translateText, callback) {
    let arr = []
    translateText.forEach(key => {
      arr.push(tsAll(key))
    })
    Promise.all(arr).then(rs => {
      rs.forEach(result => {
        this.__zhCache[result.key] = result.key
        this.__enCache[result.key] = result.en
        this.__gbCache[result.key] = result.gb
      })
      this.writeTranslateKeyFile()
      callback()
    })
  }
  writeTranslateKeyFile () {
    this.output.forEach(f => {
      const file = resolve(f)
      const fileName = path.basename(file, path.extname(file))
      let newContent
      let content
      if (fileName === 'zh') { // 中文
        content = JSON.stringify(this.__zhCache, null, 2)
      } else if (fileName === 'gb') { // 繁体
        content = JSON.stringify(this.__gbCache, null, 2)
      } else if (fileName === 'en') { // 英文
        content = JSON.stringify(this.__enCache, null, 2)
      }
      if (fs.existsSync(file)) {
        const fileContent = fs.readFileSync(file, 'utf8')
        newContent = fileContent.replace(/\/\*\s?i18n\s?\*\/([^\*]*)\/\*\s?i18n\s?end\s?\*\//gm, `/* i18n */${content}/* i18n end */`)
      } else {
        newContent = `export default /* i18n */${content}/* i8n end */`
      }
      fs.outputFileSync(file, newContent)
    })
  }
  apply(compiler) {
    const afterEmit = (compilation, callback = () => {}) => {
      let chunks = compilation.chunks
      let files = []
      chunks.forEach(chunk => {
        files = files.concat(chunk.files)
      })
      let translateText = []
      files.forEach(file => {
        let asset = compilation.assets[file]
        if (asset) {
          let content = asset.source()
          let getKey = Object.keys(getTranslateKey(content))
          translateText = translateText.concat(getKey)
        }
      })
      this.generateTranslateKeyFile(translateText, callback)
    }
    compiler.hooks.afterEmit.tapAsync('Genratets', afterEmit)
  }
}

module.exports = Genratets