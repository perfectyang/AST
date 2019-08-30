// const babylon = require('babylon')
const t = require('@babel/types')
const parser = require('@babel/parser')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const template = require('@babel/template').default

const code = `
export default {
  data () {
    return {
      name: '大哥',
      good: ''
    }
  },
  created () {
    this.gosay()
  },
  methods: {
    async gosay (a) {
      let res = await this.test()
      this.good = res.code
    },
    test () {
      console.log('a')
    }
  }
}
`
let temObj = {}

const ast = parser.parse(code, {
  sourceType: 'module'
})

traverse(ast, {
  Identifier (path) {
    if (t.isIdentifier(path.node, {
        name: 'methods'
      })) {
      temObj['methods'] = path.parentPath.node.value
    }
  },
  enter (path) {
    // console.log(path)
  }
})

let source = generate(ast).code
console.log(source)


const buildRequire = template(`
export default {
  data () {
    return {
      name: DATA
    }
  },
  methods: METHODS
}
`)

const ast2 = buildRequire({
  DATA: t.stringLiteral('qqq'),
  METHODS: temObj['methods']
})
console.log(generate(ast2).code)