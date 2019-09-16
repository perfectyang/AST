const t = require('@babel/types')
const parser = require('@babel/parser')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const getTranslateKey = require('../anaylse-html/getTranslateKey')


class ScriptParser {
  constructor (sourceCode) {
    this.ast = parser.parse(sourceCode, {
      sourceType: 'module',
      plugins: [
        'classProperties',
        'methodDefinition',
        'decorators-legacy'
      ]
    })
  }
  transformCode () {
    traverse(this.ast, {
      StringLiteral (path) {
        let pathParent = path.findParent((path) => path.isCallExpression())
        // 判断当前节点是否已经翻译过
        if (!pathParent || (pathParent && pathParent.node.callee && pathParent.node.callee.property.name !== '$t')) {
          const value = path.node.value
          const regText = new RegExp('([\u4E00-\u9FA5\uF900-\uFA2D]+)', 'gi')
          if (regText.test(value)) {
            let callExpressionss = t.callExpression(
              t.memberExpression(t.thisExpression(), t.identifier('$t')),
              [path.node]
            )
            path.replaceWith(callExpressionss)
            path.skip()
          }
        }
      },
      TemplateElement (path) {
        let curNode = path.node
        if (curNode.value.raw.trim()) {
          const regText = new RegExp('([\u4E00-\u9FA5\uF900-\uFA2D]+)', 'gi')
          let raw = curNode.value.raw.split(regText)
          if (raw.length) {
            let pathParent = path.findParent((path) => path.isTemplateLiteral())
            let chineseText = raw.filter(text => regText.test(text))
            let chineseArr = chineseText.map(chtxt => {
              let callExpressionss = t.callExpression(
                t.memberExpression(t.thisExpression(), t.identifier('$t')),
                [t.stringLiteral(chtxt)]
              )
              return callExpressionss
            })
            if (pathParent && pathParent.node.expressions) {
              chineseArr.forEach(ar => {
                pathParent.node.expressions.push(ar)
              })
            }
            let notchineseText = raw.filter(text => !regText.test(text))
            let templateElement = notchineseText.map(txt => {
               return t.templateElement({raw: txt, cooked: txt}, true)
            })
            path.replaceWithMultiple(templateElement)
            path.stop()
          }
        }
      }
    })
    let output = generate(this.ast, {
      jsescOption: {
        'minimal': true // 防止转义中文
      }
    }).code
    return output
  }
}

module.exports = ScriptParser