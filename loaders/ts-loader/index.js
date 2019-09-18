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
  let allTpls = compiler.parseComponent(source)
  console.log('原始', allTpls)
  let scriptSourceCode = allTpls.script ? allTpls.script.content : ''
  let templateSourceCode = allTpls.template ? allTpls.template.content : ''
  // let cb = this.async()

  return tsTemplate(templateSourceCode).then(templateCode => {
    let scriptCode = tsScript(scriptSourceCode)
    let styles = allTpls.styles
    let styleTpl = ''
    if (styles && styles.length) {
      styles.forEach(style => {
        styleTpl += `\n<style lang="${style.lang}" ${style.scoped ? 'scoped' : ''}>\n${style.content}\n</style>\n`
      })
    }
    let allTpl = `<template>${templateCode}</template>\n<script>\n${scriptCode}\n</script>\n${styleTpl}`
    // console.log('转义出来', allTpl)
    // cb(null, allTpl)
    return allTpl
  })
}
module.exports = tsLoader
