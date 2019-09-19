const htmlparser = require('htmlparser2')

class TemplateParser {
  /**
   * HTML文本转AST方法
   * @param scriptText
   * @returns {Promise}
   */
  parse (scriptText) {
    return new Promise((resolve, reject) => {
      // 先初始化一个domHandler
      const handler = new htmlparser.DomHandler((error, dom) => {
        if (error) {
          reject(error)
        } else {
          // 在回调里拿到AST对象
          // console.log('出来来的dom', dom)
          resolve(dom)
        }
      })
      // 再初始化一个解析器
      const parser = new htmlparser.Parser(handler, {
        xmlMode: true,
        // 将所有标签小写，并不需要，设置为false, 如果xmlMode禁用，则默认为true。所以xmlMode为true。
        lowerCaseTags: false,
        // 自动识别关闭标签，并关闭，如<image /> ==> <image></image>,不加的话，会解析异常，导致关闭标签会出现在最后面
        recognizeSelfClosing: true
      })
      // 再通过write方法进行解析
      parser.write(scriptText)
      parser.end()
    })
  }
  /**
   * AST转文本方法
   * @param ast
   * @returns {string}
   */
  astToString (ast) {
    let str = ''
    ast.forEach(item => {
      if (item.type === 'text') {
        str += item.data
      } else if (item.type === 'tag') {
        str += '<' + item.name
        if (item.attribs) {
          Object.keys(item.attribs).forEach(attr => {
            str += ` ${attr}="${item.attribs[attr]}"`
          })
        }
        str += '>'
        if (item.children && item.children.length) {
          str += this.astToString(item.children)
        }
        str += `</${item.name}>`
      }
    })
    return str
  }

  handleTag (tpl) {
    const re = /\$t\(.*?\)|(['"])[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9]+[a-zA-Z0-9\s]*[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9\s]*\1/gi
    const re2 = /\$t\(.*?\)/i // --- 匹配 $t('中文')  $t(option.t) '中文'
    const re3 = /`(.*?)`/g
    const re4 = /\$t\(.*?\)|(['"])?[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9]+[a-zA-Z0-9\s]*[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9\s]*\1/gi
    const re5 = /([\u4E00-\u9FA5\uF900-\uFA2D]+)/i
    const re6 = /\${(.*?)}/g // --- ${xxxxx}
    const re7 = /(['"])+[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9]+[a-zA-Z0-9\s]*[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9\s]*\1/i
    let temArr = []
    let idx = 0
    let str = tpl.replace(re3, ($0) => {
      $0 = $0.replace(re6, (f) => {
        f = f.replace(re4, f0 => {
          if (!re2.test(f0) && re5.test(f0)) {
            return `$t(${f0})`
          } else {
            return f0
          }
        })
        return f
      })
      // console.log('出来', $0)
      $0 = $0.replace(re4, (first) => {
        if (!re2.test(first) && re5.test(first)) {
          let t = re7.test(first) ? first : `'${first}'`
          return `\${$t(${t})}`
        } else {
          return first
        }
      })
      temArr.push($0)
      let tem = 'perfectyang2' + idx
      idx += 1
      return tem
    })
    str = str.replace(re, ($0) => {
      if (!re2.test($0) && re5.test($0)) {
        return `$t(${$0})`
      } else {
        return $0
      }
    })
    temArr.forEach((el, idx) => {
      str = str.replace(new RegExp('perfectyang2' + idx, 'gi'), el)
    })
    return str
  }
  handleText (tpl) {
    const re2 = /\$t\(.*?\)/i // --- 匹配 $t('中文')  $t(option.t)
    const re4 = /{{(.*?)}}/gi
    const re6 = /[\u4E00-\u9FA5\uF900-\uFA2D]+/i
    const re8 = /[\u4E00-\u9FA5\uF900-\uFA2D]+[a-zA-Z0-9]*[\u4E00-\u9FA5\uF900-\uFA2D]*/gi
    const re9 = /\$t\(.*?\)|(['"])?[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9]+[a-zA-Z0-9\s]*[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9\s]*\1/gi
    const temStoreArr = []
    let idx = 0
    let str = tpl.replace(re4, ($0) => {
      let newStr = $0.replace(re9, (first) => {
        if (!re2.test(first) && re6.test(first)) {
          first = `$t(${first})`
        }
        return first
      })
      temStoreArr.push(newStr)
      let placer = '&&perfectyang&&' + idx
      idx += 1
      return placer
    })
    str = str.replace(re8, ($1) => {
      return `{{$t('${$1}')}}`
    })
    temStoreArr.forEach((el, i) => {
      str = str.replace(new RegExp('&&perfectyang&&' + i, 'gi'), el)
    })
    return str
  }
  /**
   * 模板标签匹配
   * @param ast
   */
  templateConverter (ast) {
    for (let i = 0; i < ast.length; i++) {
      let node = ast[i]
      if (node.type === 'tag') { // div span 这种标签
        // 进行属性里面有中文替换
        let attrs = {}
        for (let k in node.attribs) {
          let value = node.attribs[k]
          if (/(:|v-|@)/gi.test(k)) { // 变量
            attrs[k] = this.handleTag(value)
          } else { // 不是变量
            if (/[\u4E00-\u9FA5\uF900-\uFA2D]+/i.test(value)) {
              attrs[`:${k}`] = `$t('${value}')`
            } else {
              attrs[k] = value
            }
          }
        }
        node.attribs = attrs
      }
      // 标签里面的内容
      if (node.type === 'text' && node.data) {
        node.data = this.handleText(node.data)
      }
      // 递归
      if (node.children) {
        this.templateConverter(node.children)
      }
    }
    return ast
  }
}

module.exports = TemplateParser
