const getTranslateKey = require('./getTranslateKey')
const TemplateParser = require('./TemplateParser')



// const tpl = `
// <el-form class="project-approval-info" v-loading="loading" ref="form" :model="form" :rules="rules" label-width="170px">
//     <el-row :gutter="20">
//       <el-col class="form-item-wrap" :span="12" style="display: flex;">
//         <el-form-item class="project-form-item" label="属于大PO：" prop="is_big_po">
//           <el-radio-group style="margin-top: 13px;" v-model="form.is_big_po">
//             <el-radio :label="0">否</el-radio>
//             <el-radio :label="1">是</el-radio>
//           </el-radio-group>
//         </el-form-item>
//       </el-col>
//       <el-col class="form-item-wrap" :span="12" style="display: flex;">
//       </el-col>
//     </el-row>
//     <el-row :gutter="20" v-if="+form.is_big_po === 1">
//       <el-col class="form-item-wrap" style="display: flex;" :span="12">
//         <el-form-item label="大PO号：" prop="big_po_no">
//           <el-select
//             class="form-item-content"
//             v-model="form.big_po_no"
//             filterable
//             allow-create
//             placeholder="请选择或者创建大po号"
//             @change="changeBigPo"
//             >
//             <el-option
//               v-for="item in bigPoLists"
//               :key="item.project_id"
//               :label="item.big_po_no"
//               :value="item.big_po_no">
//             </el-option>
//           </el-select>
//         </el-form-item>
//       </el-col>
//       <el-col class="form-item-wrap" :span="12" style="display: flex;">
//         <el-form-item class="project-form-item" label="大PO金额（不含税）：" prop="big_po_total">
//           <el-select style="width: 130px;margin-right: 10px;" v-model="form.big_po_currency" :disabled="Boolean(bigPoLinkProjectId && form.is_big_po)">
//             <el-option
//               label="人民币"
//               :value="'中文'">
//             </el-option>
//             <el-option
//               label="美元"
//               :value="2">
//             </el-option>
//           </el-select>
//           <el-input :min="0" type="number" placeholder="请输入大PO金额" :value="form.big_po_total" @input="changeValue" :disabled="Boolean(bigPoLinkProjectId && form.is_big_po)"></el-input>
//         </el-form-item>
//       </el-col>
//     </el-row>
//     <el-row :gutter="20" v-if="+form.is_big_po === 0">
//       <el-col class="form-item-wrap" :span="12" style="display: flex;">
//         <el-form-item  label="PO号：" prop="po_no">
//           <el-input class="form-item-content" type="text" placeholder="请输入PO号" v-model="form.po_no"></el-input>
//         </el-form-item>
//       </el-col>
//       <el-col :span="12">
//         <el-form-item class="project-form-item" label="PO金额（不含税）：" prop="po_amount">
//           <el-select style="width: 130px;margin-right: 10px;" v-model="form.po_amount_currency">
//             <el-option
//               label="人民币"
//               :value="1">
//             </el-option>
//             <el-option
//               label="美元"
//               :value="2">
//             </el-option>
//           </el-select>
//           <el-input :min="0" type="number" placeholder="请输入PO金额" v-model="form.po_amount"></el-input>
//         </el-form-item>
//       </el-col>
//     </el-row>
//     <el-row :gutter="20">
//       <el-col :span="12">
//         <el-form-item label="PO名称：" prop="po_name">
//           <el-input type="text" placeholder="请输入PO名称" v-model="form.po_name" :disabled="Boolean(bigPoLinkProjectId && form.is_big_po)"></el-input>
//         </el-form-item>
//       </el-col>
//       <el-col :span="12">
//         <el-form-item label="签订PO时间：" prop="po_signing_time">
//           <el-date-picker
//             class="form-item-content"
//             v-model="form.po_signing_time"
//             type="date"
//             placeholder="选择日期时间"
//             :disabled="Boolean(bigPoLinkProjectId && form.is_big_po)">
//           </el-date-picker>
//         </el-form-item>
//       </el-col>
//     </el-row>
//     <el-row :gutter="20">
//       <el-col :span="12">
//         <el-form-item class="project-form-item" label="PO原件：" prop="po_original">
//           <upload-component
//             class="form-item-content"
//             ref="uploadComponentRef"
//             :prop-file-lists="form.po_original"
//             @update-file-list="updatePoOriginal">
//           </upload-component>
//         </el-form-item>
//       </el-col>
//     </el-row>
//     <el-form-item style="text-align: center;" label-width="80px">
//       <el-button type="primary" @click="clickSaveApprovalInfo('form')">保存</el-button>
//       <el-button @click="cancelEdit">取消aa</el-button>
//     </el-form-item>
//   </el-form>
// </template>
// `

const tpl = `
  <div id="app">
    <HelloWorld msg="中文" />
    <div>顺在在在</div>
    <span>this is for test</span>
    <div :value='"中文"'>{{$t('要这里aaa')}}</div>
    <div :value="'中文aa'" placeholder="请选择或者创建大po号">要这里aaa</div>
    <div :test="$t('我是翻译过的')"></div>
  </div>
`



const parseHtml = new TemplateParser()

parseHtml.parse(tpl).then(astHtml => {
  let originTpl = parseHtml.astToString(astHtml)
  console.log('之前', originTpl)
  let changeAstTpl = parseHtml.templateConverter(astHtml)
  let outputTpl = parseHtml.astToString(changeAstTpl)
  console.log('之后', outputTpl)
  console.log('解析出来', getTranslateKey(outputTpl))
})
