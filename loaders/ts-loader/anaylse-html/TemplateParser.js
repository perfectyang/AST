const htmlparser = require('htmlparser2')

class TemplateParser {
  /**
   * HTML文本转AST方法
   * @param scriptText
   * @returns {Promise}
   */
  parse (scriptText) {
    return new Promise((resolve, reject) => {
      //先初始化一个domHandler
      const handler = new htmlparser.DomHandler((error, dom)=>{
        if (error) {
          reject(error)
        } else {
          //在回调里拿到AST对象
          resolve(dom)
        }
      });
      //再初始化一个解析器
      const parser = new htmlparser.Parser(handler)
      //再通过write方法进行解析
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
        str += item.data;
      } else if (item.type === 'tag') {
        str += '<' + item.name
        if (item.attribs) {
          Object.keys(item.attribs).forEach(attr => {
            str += ` ${attr}="${item.attribs[attr]}"`
          });
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
  /**
   * 模板标签匹配
   * @param ast
   */
  templateConverter (ast) {
    // 中文正则
    const regText = new RegExp('([\u4E00-\u9FA5\uF900-\uFA2D]+)', 'gi')
    const isTranslateReg = /\$t/gi

    for (let i = 0; i < ast.length; i++) {
      let node = ast[i]
      if (node.type === 'tag') { // div span 这种标签
        //进行属性里面有中文替换
        let attrs = {}
        for (let k in node.attribs) {
          let value = node.attribs[k]
          if (regText.test(value) && !isTranslateReg.test(value)) {
            // 重置一下原来的变量
            k = k.replace(/:/gi, '')
            value = value.replace(/"|'/gi, '')
            attrs[`:${k}`] = `$t('${value}')`
          } else {
            attrs[k] = value
          }
        }
        node.attribs = attrs
      }
      // 标签里面的内容
      if (node.type === 'text' && node.data) {
        if (regText.test(node.data) && !isTranslateReg.test(node.data)) {
          let tmdata = node.data.replace(regText, ($0) => {
            let tem = `{{$t('${$0}')}}`
            return tem
          })
          node.data = tmdata
        }
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