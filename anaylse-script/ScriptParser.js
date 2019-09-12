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
    })
    let output = generate(this.ast, {}).code
    console.log('翻译', getTranslateKey(output))
    return output
  }
}

module.exports = ScriptParser