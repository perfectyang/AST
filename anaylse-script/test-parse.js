 const ScriptParser = require('./ScriptParser')
 const code = `

 `

let scriptTpl = new ScriptParser(code)

console.log(scriptTpl.transformCode())