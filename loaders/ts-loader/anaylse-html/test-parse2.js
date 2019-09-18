// const tpl = `
// :v-show="a?'有':'没有'"
//   <div :v-show="a?'有':'没有'"></div>
//   <div :title="(isEdit ? '编辑' : '新建') + '客户'"></div>
//   <div  :v-show="name === '中文'" :title="isNew ? '新建权限' : '编辑权限'" ></div>
//   <div :label="$t('平台')" :rules="{ required: true, message: '请输入名称', trigger: [blur, change] }" prop="platform_id" ></div>
//   <div :title="(isEdit ? '编辑' : '新建') + '客户'"></div>

// `
// const tpl = `(isEdit ? $t('编辑') : '新建') + '客户'`
// const tpl = `{ required: true, message: name + "请输入名称", trigger: [blur, change] }`
const tpl = `
:disabled="copyAccountInfo.modalTitle === '修改账号' ? true : false"
\`请输入\${tipTitle + $t('中玟')}，"添加多个请分行"\`
(isEdit ? $t('编辑') : '新建') + '客户' + \`\${name + '中文'}\`
label="babne"
:type="configData.lettered_rules===1 ? 'primary': ''"
start-placeholder="开始日期"
`

// --- 匹配 $t('中文')  $t(option.t) '中文'
const re = /\$t\(.*?\)|(['"])[\u4e00-\u9fa5a-zA-Z0-9]+[a-zA-Z0-9\s]*[\u4e00-\u9fa5a-zA-Z0-9\s]*\1/gi
const re2 = /\$t\(.*?\)/gi // --- 匹配 $t('中文')  $t(option.t) '中文'
const re3 = /`(.*?)`/g
const re4 = /\$t\(.*?\)|(['"])?[\u4e00-\u9fa5a-zA-Z0-9]+[a-zA-Z0-9\s]*[\u4e00-\u9fa5a-zA-Z0-9\s]*\1/gi
const re5 = /([\u4E00-\u9FA5\uF900-\uFA2D]+)/gi
const re6 = /\${(.*?)}/g // --- ${xxxxx}
const re7 = /(['"])+[\u4e00-\u9fa5a-zA-Z0-9]+[a-zA-Z0-9\s]*[\u4e00-\u9fa5a-zA-Z0-9\s]*\1/g

let temArr = []
let idx = 0
let str = tpl.replace(re3, ($0) => {
  console.log('了', $0)
  $0 = $0.replace(re6, (f) => {
    f = f.replace(re4, f0 => {
      if (!re2.test(f0) && re5.test(f0)) {
        return `$t(${f0})`
      } else {
        return f0
      }
    })
    return f
  })
  // console.log('出来--', $0)
  $0 = $0.replace(re4, (first) => {
    if (!re2.test(first) && re5.test(first)) {
      console.log('first', first)
      let t = re7.test(first) ? first : `'${first}'`
      return `\${$t(${t})}`
    } else {
      return first
    }
  })
  console.log('$0', $0)
  temArr.push($0)
  let tem = 'placeholder-' + idx
  idx += 1
  return tem
})

str = str.replace(re, ($0) => {
  if (!re2.test($0) && re5.test($0)) {
    console.log('出错了', $0)
    return `$t(${$0})`
  } else {
    return $0
  }
})

temArr.forEach((el, idx) => {
  str = str.replace(new RegExp('placeholder-' + idx, 'gi'), el)
})

console.log(str)
