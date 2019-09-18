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
<div>
    <el-row type="flex" style="padding: 20px; border-bottom: 1px solid #D6D6D6;">
      <el-col :span="12">
        <el-row style="height: 100%;" type="flex" align="middle">
          <el-breadcrumb>
            <el-breadcrumb-item>业务管理</el-breadcrumb-item>
            <el-breadcrumb-item><span class="nav-btn-text" @click="$router.push('/project-management')">项目管理</span></el-breadcrumb-item>
            <el-breadcrumb-item><b>问卷管理</b></el-breadcrumb-item>
          </el-breadcrumb>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="end" align="middle">
          <span v-auth="{code: '004_001_001_005_005'}">投放日期：</span>
          <el-date-picker size="mini" type="daterange" v-auth="{code: '004_001_001_005_005'}" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="{
              disabledDate
            }" v-model="dateRange">
          </el-date-picker>
          <el-button style="margin-left: 10px;" size="mini" v-auth="{code: '004_001_001_005_006'}" @click="visible.banner = true">
            Banner 素材
          </el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-row style="margin: 20px;">
      <el-col :span="16">
        <el-dropdown v-if="true && '为了tools上线暂时隐蔽该入口'" split-button type="primary" v-auth="{code: '004_001_001_005_001'}" trigger="click" @click="newSurvey">
          新建问卷
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-upload :action="uploadFilePath" :data="{
                  project_id: projectId
                }" :show-file-list="false" :before-upload="beforeUpload" :on-success="uploadSuccess" :on-error="uploadError">
                <i class="el-icon-loading" v-show="loading.upload"></i>
                一键导入问卷
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item @click.native="surveyTemplate.visible = true">
              <i class="el-icon-loading" v-show="loading.template"></i>
              使用问卷模板
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-auth="{code: '004_001_001_005_002'}" style="margin-left: 10px;" type="primary" @click="questionVisible = true">题目编码</el-button>
        <el-button v-auth="{code: '004_001_001_005_003'}" type="primary" @click="questionCodeVisible = true">选项编码</el-button>
        <el-input v-auth="{code: '004_001_001_005_004_002'}" style="width: 200px; margin-left: 10px;" suffix-icon="el-icon-search" placeholder="请输入问卷名称" v-model="keyword">
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-row type="flex" justify="end">
          <el-tag style="margin: 0 10px;" type="info" v-auth="{code: '004_001_001_005_007'}">
            项目样本量: <strong>{{ projectInfo.sampleGoal }}</strong>
          </el-tag>
          <el-tag style="margin: 0 10px;" type="info" v-auth="{code: '004_001_001_005_008'}">
            总完答量: <strong>{{ projectInfo.recieveSample }}</strong>
          </el-tag>
        </el-row>
      </el-col>
    </el-row>
    <el-row style="margin: 20px;">
      <el-table border stripe v-auth="{code: '004_001_001_005_004'}" row-key="id" :header-cell-style="{
          width: '100%',
          background: '#F4F4F4'
        }" :data="surveyShowList" v-loading="loading.survey">
        <el-table-column label="问卷ID" prop="id" align="center" header-align="center" width="100">
        </el-table-column>

        <el-table-column show-overflow-tooltip align="center" label="问卷名称" prop="name" min-width="200">
        </el-table-column>

        <el-table-column label="投放时间" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <div>起：{{ scope.row.marketStartTime | date('YYYY-MM-DD') }}</div>
            <div>止：{{ scope.row.marketEndTime | date('YYYY-MM-DD') }}</div>
          </template>
        </el-table-column>

        <el-table-column label="问卷总配额" prop="sampleGoal" align="center" header-align="center">
        </el-table-column>

        <el-table-column label="完答量" prop="recieveSample" align="center" header-align="center">
        </el-table-column>

        <el-table-column label="问卷状态" prop="stateName" align="center">
        </el-table-column>

        <el-table-column label="投放状态" prop="deliveryStateName" align="center">
        </el-table-column>

        <el-table-column show-overflow-tooltip label="问卷预览" align="center" width="100">
          <template slot-scope="scope">
            <a target="_blank" :href="scope.row.link">预览</a>
          </template>
        </el-table-column>

        <el-table-column
        width="130px"
        align="center"
        label="到达配额表要求自动结束投放">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.quota_monitor"
              @change="changeMonitor('quota', scope.row.id, $event)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
        width="130px"
        align="center"
        label="到达问卷总配额自动结束投放">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.sample_monitor"
              @change="changeMonitor('sample', scope.row.id, $event)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" width="260">
          <template slot-scope="scope">
            <el-button size="mini" style="margin-left: 4px;" :key="button.name" :disabled="scope.row.loading[button.name]" :loading="scope.row.loading[button.name]" @click="handleOperation(button.handler, scope.row)" v-for="button of scope.row.buttons.first">
              {{ button.name }}
            </el-button>
            <el-dropdown v-if="scope.row.buttons.last">
              <span class="el-dropdown-link">
                <el-button size="mini" slot="reference" @click="scope.row.popover = true">...</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item style="min-width: 124px;" :key="button.name" v-for="button of scope.row.buttons.last" @click.native="handleOperation(button.handler, scope.row)">
                  <i class="el-icon-loading" v-show="scope.row.loading[button.name]"></i>
                  {{ button.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-popover
              trigger="click"
              placement="bottom-end"
              popper-class="project-table-operation-popper"
              v-model="scope.row.popover"
              v-if="scope.row.buttons.last">
              <ul>
                <li :key="button.name" v-for="button of scope.row.buttons.last">
                  <a @click="handleOperation(button.handler, scope.row)">
                    <i class="el-icon-loading" v-show="scope.row.loading[button.name]"></i>
                    {{ button.name }}
                  </a>
                </li>
              </ul>
              <el-button size="mini" slot="reference" @click="scope.row.popover = true">...</el-button>
            </el-popover> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 新建问卷 -->
    <el-dialog title="新建问卷" width="640px" :visible.sync="visible.newSurvey">
      <el-form class="survey-new-dialog" label-width="80px">
        <el-form-item label="问卷名称">
          <el-input placeholder="请填写问卷名称" v-model="newSurveyName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="visible.newSurvey = false">取消</el-button>
        <el-button type="primary" :loading="loading.newSurveySave" :disabled="loading.newSurveySave" @click="saveBlankSurvey">
          保存
        </el-button>
      </div>
    </el-dialog>

    <survey-template-dialog :category-id="surveyTemplate.categoryId" :visible.sync="surveyTemplate.visible" @save="saveTemplates"></survey-template-dialog>

    <banner-dialog :project-id="projectId" :visible.sync="visible.banner"></banner-dialog>

    <quota v-if="Partion.visible && (quota.quota_version == 1 || !quota.quota_version)" :survey_id="quota.survey_id" :hasSurveyId="true" @updateQuota="getSurveyList" />

    <quota2 v-if="Partion.visible && quota.quota_version == 2" ref="quota2" :survey_id="quota.survey_id" :hasSurveyId="true" @updateQuota="getSurveyList" />
    <question-code v-model="questionVisible"></question-code>
    <option-code v-model="questionCodeVisible"></option-code>

    <el-dialog title="数据处理" :visible.sync="dataProcess.visible">
      <div style="text-align: center;">
            </div>
    </el-dialog>

    <el-dialog title="测试数据" :visible.sync="testProcess.visible">
      <div style="text-align: center;">
        <div style="margin: 16px 0;">
          <span>选择数据类型：</span>
          <el-select clearable @change="getCountBySurvey" v-model="valid" placeholder="请选择">
            <el-option v-for="(item, index) in dataTypes" :key="item" :label="item" :value="index + 1">
            </el-option>
          </el-select>
        </div>
        <div style="margin: 16px 0;">
          样本数量：{{ testProcess.sampleNum }}
          <span style="padding: 0 80px;"></span>
        </div>
       </div>
    </el-dialog>

    <limit-respondents :surveyId="limitSurveyId" ref="limitRespondents"></limit-respondents>
    <dp-type :surveyId="dpConfig.surveyId" :multiDpTableId="dpConfig.multiDpTableId" :multiStep="dpConfig.multiStep" ref="dptype" />
  </div>
`



const parseHtml = new TemplateParser()

parseHtml.parse(tpl).then(astHtml => {
  let originTpl = parseHtml.astToString(astHtml)
  console.log('之前', originTpl)
  let changeAstTpl = parseHtml.templateConverter(astHtml)
  let outputTpl = parseHtml.astToString(changeAstTpl)
  console.log('之后', outputTpl)
  let tsSourceCode = getTranslateKey(outputTpl)
  console.log('解析出来', tsSourceCode)
})
