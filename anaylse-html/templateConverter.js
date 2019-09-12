

//替换入口方法
function templateConverter (ast) {
  // 中文正则
  const regText = new RegExp('([\u4E00-\u9FA5\uF900-\uFA2D]+)', 'gi')
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    if (node.type === 'tag') { // div span 这种标签
      //进行属性里面有中文替换
      let attrs = {}
      for (let k in node.attribs) {
        let value = node.attribs[k]
        if (regText.test(value)) {
          // 重置一下原来的变量
          k = k.replace(/:/gi, '')
          value = value.replace(/"|'/gi, '')
          attrs[`:${k}`] = `$t('${value}')`
        } else {
          attrs[k] = value
        }
      }
      node.attribs = attrs
    }
    // 标签里面的内容
    if (node.type === 'text' && node.data) {
      if (regText.test(node.data)) {
        let tmdata = node.data.replace(regText, ($0) => {
          let tem = `{{$t('${$0}')}}`
          return tem
        })
        node.data = tmdata
      }
    }

    // 递归
    if (node.children) {
      templateConverter(node.children)
    }
  }
  return ast
}

module.exports = templateConverter
