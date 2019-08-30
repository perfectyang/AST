#!/bin/env node
const babylon = require('babylon')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default

const code = ''
const ast = babylon.parse(code)

// const a = 'bbb' ----
// const id = t.identifier('a')
// const literal = t.stringLiteral('bbb')
// const declarator = t.variableDeclarator(id, literal)
// const declaration = t.variableDeclaration('const', [declarator])
// ast.program.body.push(declaration)

// function aa(a, b) { return a + b }
// const binaryExpress = t.binaryExpression('+', t.identifier('a'), t.identifier('b'))
// const returnStatement = t.ReturnStatement(binaryExpress)
// const fnBody = t.BlockStatement([returnStatement])
// const functionDeclaration = t.FunctionDeclaration(t.identifier('aa'), [t.identifier('a'), t.identifier('b')], fnBody)
// ast.program.body.push(functionDeclaration)

const id = t.identifier('arr')
const arrayExpression = t.arrayExpression([t.stringLiteral('a'), t.numericLiteral(222)])
const VariableDeclarator = t.VariableDeclarator(id, arrayExpression)
const VariableDeclaration = t.VariableDeclaration('let', [VariableDeclarator])
ast.program.body.push(VariableDeclaration)


const output = generate(ast, {}, code)

console.log('Input \n', code)
console.log('Output \n', output.code)