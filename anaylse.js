const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default
const t = require('@babel/types')
const generate = require('@babel/generator').default
const code = `function square(n) {
  return n - n;
}; const c = a + b`;
const ast = parser.parse(code);

traverse(ast, {
  // BinaryExpression(path) {
  //   if (path.node.operator === '+') {
  //     path.replaceWith(t.binaryExpression('*', path.node.left, path.node.right))
  //   }
  // },
  // FunctionDeclaration: function (path) {
  //   console.log(' g把m过', path)
  // },
  enter(path) {
    console.log('中文啊', path)
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  }
});
const output = generate(ast, {}, code).code
console.log('output', output)