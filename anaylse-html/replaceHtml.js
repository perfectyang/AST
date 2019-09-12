

//替换入口方法
function templateConverter (ast) {
  // 中文正则
  const regText = new RegExp('([\u4E00-\u9FA5\uF900-\uFA2D]+)', 'gi')

  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    //检测到是html节点
    if (node.type === 'tag') { // div span 这种标签
      // console.log('标签', node.name)
      //进行属性里面有中文替换
      let attrs = {}
      for(let k in node.attribs){
        let value = node.attribs[k]
        if (regText.test(value)) {
          let innerK = k
          if (!/:/gi.test(k)) {
            innerK = `:${innerK}`
          }
          value = value.replace(/"|'/gi, '')
          attrs[innerK] = `$t('${value}')`
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
    if(node.children){
      templateConverter(node.children)
    }
  }
  return ast
}

module.exports = templateConverter
