#!/usr/bin/env node
'use strict'
const request = require('request')
const fs = require('fs')
const path = require('path')
const jsonUrl = path.resolve(__dirname, './zh_wiki.json')
const gbResult = JSON.parse(fs.readFileSync(jsonUrl, 'utf-8'))

// 英文
const englishTs = (txt) => {
  return new Promise((resolve, reject) => {
    request.get(encodeURI(`http://fanyi.youdao.com/openapi.do?keyfrom=node-fanyi&key=110811608&type=data&doctype=json&version=1.1&q=${txt}`), (error, resp, body) => {
      if (resp.statusCode === 200) {
        // console.log(body)
        resolve(JSON.parse(body))
      } else {
        resolve(null)
      }
    })
  })
}

// 繁体字
const gbTs = (txt) => {
  let splitText = txt.split('')
  let backText = []
  splitText.forEach(t => {
    if (gbResult[t]) {
      backText.push(gbResult[t])
    } else {
      backText.push(t)
    }
  })
  return backText.join('')
}

const tsAll = (txt) => {
  return new Promise((resolve, reject) => {
    englishTs(txt).then(rs => {
      let backJson = {
        en: rs ? rs['translation'][0] : 'translation is failure',
        gb: gbTs(txt),
        key: txt
      }
      resolve(backJson)
    })
  })
}
module.exports = tsAll

