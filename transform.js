
const compiler = require('vue-template-compiler')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generate = require('@babel/generator').default

function transform (source) {
  let vuecontent = compiler.parseComponent(source)
  let ast = parser.parse(vuecontent.script.content, {
    sourceType: 'module',
    plugins: [
      'classProperties',
      'methodDefinition',
      'decorators-legacy'
    ]
  })
  let dataArr = []
  let methodsArr = []
  let importArr = []
  let lifeCycle = []
  let computedArr = []
  let componentsArr = null
  let definedLifeCycle = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'beforeDestroy',
    'destroyed',
    'errorCaptured'
  ]
  traverse(ast, {
    ClassProperty (p) { // 属性获取
      dataArr.push(t.objectProperty(p.node.key, p.node.value))
    },
    ClassMethod (p) {
      if (definedLifeCycle.includes(p.node.key.name)) { // 生命周期方法
        lifeCycle.push(t.objectMethod(p.node.kind, p.node.key, p.node.params, p.node.body))
      } else if (p.node.kind === 'get') { // 获取computed
        computedArr.push(t.objectMethod('method', p.node.key, p.node.params, p.node.body))
      } else {
        methodsArr.push(t.objectMethod(p.node.kind, p.node.key, p.node.params, p.node.body))
      }
    },
    ImportDeclaration (p) {
      let node = p.node
      if (node.specifiers.length === 1 
        && (
          (node.specifiers[0].local.name === 'Vue' && node.source.value === 'vue')
          || (node.specifiers[0].local.name === 'Component' && node.source.value === 'vue-class-component')
        )) {
          // console.log('vue')
      } else {
        importArr.push(t.importDeclaration(node.specifiers, node.source))
      }
    },
    Decorator (p) {
      let expression = p.node.expression
      if (expression.callee.name === 'Component') {
        componentsArr = expression.arguments[0].properties
      }
    }
  })

  let data = t.objectMethod('method', t.identifier('data'), [], t.blockStatement([
    t.returnStatement(t.objectExpression(dataArr))
  ]))

  let methods = t.objectProperty(t.identifier('methods'), t.objectExpression(methodsArr))
  let computed = t.objectProperty(t.identifier('computed'), t.objectExpression(computedArr))


  let reconstructor = [...lifeCycle, data, computed, methods]
  if (componentsArr) {
    reconstructor.unshift(...componentsArr)
  }

  let ExportDefaultDeclaration = t.exportDefaultDeclaration(
    t.objectExpression(reconstructor)
  )


  // 构造正常结构
  const code = ''
  const ast2 = parser.parse(code)
  ast2.program.body.push(...importArr)
  ast2.program.body.push(ExportDefaultDeclaration)

  const output = generate(ast2, {}, code)
  
  const allTpl = `
    <template>
      ${vuecontent.template.content}
    </template>

    <script>
      ${output.code}
    </script>

    <style lang="less" scoped>
      ${vuecontent.styles[0].content}
    </style>
  `
  return allTpl
}

module.exports = transform