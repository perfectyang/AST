
const compiler = require('vue-template-compiler')
const TemplateParser = require('./anaylse-html/TemplateParser')
const ScriptParser = require('./anaylse-script/ScriptParser')

function tsTemplate (tpl) {
  const parseHtml = new TemplateParser()
  return parseHtml.parse(tpl).then(astHtml => {
    let changeAstTpl = parseHtml.templateConverter(astHtml)
    let outputTpl = parseHtml.astToString(changeAstTpl)
    return outputTpl
  })
}

function tsScript (tpl) {
  let scriptTpl = new ScriptParser(tpl)
  let backSourceCode = scriptTpl.transformCode()
  console.log(backSourceCode)
  return backSourceCode
}


function tsLoader (source) {
  console.log('source', source)
  let allTpls = compiler.parseComponent(source)
  let scriptSourceCode = allTpls.script ? allTpls.script.content : ''
  let templateSourceCode = allTpls.template ? allTpls.template.content : ''
  let cb = this.async()

  tsTemplate(templateSourceCode).then(templateCode => {
    let scriptCode = tsScript(scriptSourceCode)
    let styles = allTpls.styles
    let styleTpl = ''
    if (styles && styles.length) {
      styles.forEach(style => {
        styleTpl += `
        <style lang="${style.lang}" ${style.scoped ? 'scoped' : ''}>
          ${style.content}
        </style>
        `
      })
    }
    let allTpl = `<template>${templateCode}</template><script>${scriptCode}</script>${styleTpl}`
    console.log('allTpl', allTpl)
    cb(null, allTpl)
  })
}
module.exports = tsLoader