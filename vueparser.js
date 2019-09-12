const compiler = require('vue-template-compiler')

const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
const core = require('@babel/core')
const template = require('@babel/template').default
const generate = require('@babel/generator').default

const source = `
<template>
  <div class="home">
     <div :title="中文">中文</div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import eztalkApi from 'm/api/eztalk'
import config from 'm/config'

@Component({
  mixins: [routeMixin],
  watch: {
    'readModal.visible': function (visible) {
      if (!visible) {
        this.readModal.current = -1
      }
    }
  }
})

export default class Login extends Vue {
  phone = '我是中文'
  code = ''

  get count () {
    return this.countDown
  }

  create () {
    console.log(1)
  }

  getVerifycode () {}

  login () {}

}
</script>
<style lang="less" scoped>
  .home {
    background: red;
  }
</style>
<style>
  .test {font-size: 14px;}
</style>
`



let vuecontent = compiler.parseComponent(source)
// console.log('脚本script', vuecontent.script.content)
// console.log('脚本script.template', vuecontent.template)
// console.log('styles', vuecontent.styles)
let ast = parser.parse(vuecontent.script.content, {
  sourceType: 'module',
  plugins: [
    'classProperties',
    'methodDefinition',
    'decorators-legacy'
  ]
})
console.log('上文', ast)


let dataArr = []
let methodsArr = []
// [t.objectProperty(t.identifier('phone'), t.stringLiteral(''))]
traverse(ast, {
  ClassProperty (p) { // 属性获取
    console.log(p.node)
    dataArr.push(t.objectProperty(p.node.key, p.node.value))
  },
  ClassMethod (p) {
    console.log('函数', p.node)
    methodsArr.push(t.objectMethod(p.node.kind, p.node.key, p.node.params, p.node.body))
  }

})
// let html = `${vuecontent.template.content}${vuecontent.script.content}${vuecontent.styles.content}`
let sourcecode = generator(ast).code



const buildRequire = template(`
export default {
  data () {
    return DATA
  },
  methods: METHODS
}
`)

const ast2 = buildRequire({
  DATA: t.objectExpression(dataArr),
  METHODS: t.objectExpression(methodsArr)
})
console.log(generate(ast2).code)


