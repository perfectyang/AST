const t = require('@babel/types')
const parser = require('@babel/parser')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const template = require('@babel/template').default

const code = `
  function aa (n) {
    return n * n
  }
`
let ast = parser.parse(code, {
  sourceType: 'module'
})

traverse(ast, {
  // BinaryExpression(path) {
  //   // console.log(path.node.left) // 这种访问，就是节点
  //   // console.log(path.get('left')) // 这种访问，是路径
  //   // let left = path.get('right')
  //   // console.log(left.parentPath.node)
  //   // console.log(path.get('left').node.name)
  //   // console.log(path.get('right').node.name)

  //   // --- 对于每一个父路径调用callback并将其NodePath当作参数，当callback返回真值时，则将其NodePath返回。
  //   // let targetPath = path.findParent((path) => path.isExpressionStatement())
  //   // console.log(targetPath.node)

  //   // 找同一级别的路径
  //   // let curPath = path.find((path) => path.isExpressionStatement())
  //   // console.log(curPath.node)

  //   // 向上遍历语法树，直到找到在列表中的父节点路径
  //   // let parentPath = path.getStatementParent()
  //   // console.log(parentPath.node)

  //   // 查找最接近的父函数或程序：
  //   // let cur = path.getFunctionParent()
  //   // console.log('cur', cur.node)
  //   // path.replaceWith(
  //   //   t.binaryExpression("**", path.node.left, path.node.right)
  //   // )
  // },
  BinaryExpression(path) {
    path.replaceWithMultiple([
      t.binaryExpression("*", t.identifier("a"), t.identifier("b"))
    ])
  },
  FunctionDeclaration(path) {
    // path.replaceWithSourceString(`function a () {return a + b}`)
    path.insertBefore(t.expressionStatement(t.stringLiteral('go to hell')))
    path.insertAfter(t.expressionStatement(t.stringLiteral('go to hell')))
  },
  // ReturnStatement(path) {
  //   path.replaceWithMultiple([
  //     t.expressionStatement(t.stringLiteral("Is this the real life?"))
  //   ])
  // },
  // Identifier(path) {
  //   if (!path.inList) {
  //     // console.log('没有', path.node)
  //   } else {
  //     // console.log('有', path.node)
  //     // console.log(path.listKey)
  //     // console.log(path.key)
  //     // console.log(path.getSibling(1).node)
  //   }
  //   // console.log(path.inList)
  // }
})

const output = generate(ast, {}).code

console.log(output)