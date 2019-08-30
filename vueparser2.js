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
    <x-header title="aaa"></x-header>
    <group title="components">
      <cell title="number">1</cell>
      <cell title="link" is-link>2</cell>
      <popup-picker v-model="picker1" title="picker" :data="[['1', '2', '3']]"></popup-picker>
      <x-input title="XInput" placeholder="please input"></x-input>
    </group>
    <group title="x-icon">
      <x-icon type="ios-search" size="30"></x-icon>
      <x-icon type="ios-search-strong" size="30"></x-icon>
      <x-icon type="ios-star" size="30"></x-icon>
      <x-icon type="ios-star-half" size="30"></x-icon>
      <x-icon type="ios-star-outline" size="30"></x-icon>
      <x-icon type="ios-heart" size="30"></x-icon>
      <x-icon type="ios-heart-outline" size="30"></x-icon>
      <x-button type="primary">XButton</x-button>
    </group>
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
  phone = '我是中文222'
  code = '22'

  get count () {
    return this.countDown
  }

  get say () {
    return this.countDown
  }

  created () {
    console.log(1)
  }

  mounted () {
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

let computedArr = []

traverse(ast, {
  ClassProperty (p) { // 属性获取
    dataArr.push(t.objectProperty(p.node.key, p.node.value))
  },
  ClassMethod (p) {
    if (definedLifeCycle.includes(p.node.key.name)) { // 生命周期方法
      lifeCycle.push(t.objectMethod(p.node.kind, p.node.key, p.node.params, p.node.body))
    } else if (p.node.kind === 'get') { // 获取computed
      computedArr.push(t.objectMethod(p.node.kind, p.node.key, p.node.params, p.node.body))
    } else {
      methodsArr.push(t.objectMethod(p.node.kind, p.node.key, p.node.params, p.node.body))
    }

  },
  ImportDeclaration (p) {
    importArr.push(t.importDeclaration(p.node.specifiers, p.node.source))
  }
})
// let sourcecode = generator(ast).code
// vue 里面的 data
let data = t.objectMethod('method', t.identifier('data'), [], t.blockStatement([
  t.returnStatement(t.objectExpression(dataArr))
]))

let methods = t.objectProperty(t.identifier('methods'), t.objectExpression(methodsArr))

let computed = t.objectProperty(t.identifier('computed'), t.objectExpression(computedArr))


let ExportDefaultDeclaration = t.exportDefaultDeclaration(
  t.objectExpression([data, methods, ...lifeCycle, computed])
)


const code = ''
const ast2 = parser.parse(code)

ast2.program.body.push(...importArr)
console.log('ExportDefaultDeclaration', ExportDefaultDeclaration)
ast2.program.body.push(ExportDefaultDeclaration)



const output = generate(ast2, {}, code)

console.log('出来一', output.code)
