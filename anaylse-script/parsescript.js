const t = require('@babel/types')
const parser = require('@babel/parser')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const template = require('@babel/template').default

const code = `
export default {
  data () {
    var validJvName = (rule, value, callback) => {
      if (this.form.is_jv === 2) {
        callback()
      } else {
        if (!value) {
          callback(new Error('请选择jv名称'))
        } else {
          callback()
        }
      }
    }
    var validPrePaidProjectId = (rule, value, callback) => {
      if (this.form.is_prepaid === 0) {
        callback()
      } else {
        if (!value) {
          callback(new Error('请选择所属的预付项目'))
        } else {
          callback()
        }
      }
    }
    return {
      editStatus: 1, // 1为新建 2 为修改
      form: {
        project_id: 0,
        project_no: '',
        project_name: '',
        company_id: '',
        advertiser_id: '',
        project_category_id: '',
        survey_category_id: [],
        brand_id: 101,
        is_jv: 2,
        jv_name: '',
        is_prepaid: 0,
        belong_project_id: '',
        pm: [],
        apm: [],
        operator: [],
        test_mark: 1,
        remarks: '',
        research_method: '', // 调研方法
        research_purpose: '', // 主研究类型
        flow_channel: [], // 流量渠道
        vice_research_purpose: [] // 副研究类型
      },
      rules: {
        project_no: [
          { required: true, message: '请输入项目编号', trigger: 'blur' }
        ],
        project_name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        brand_id: [
          { required: true, message: '请选择项目品牌', trigger: 'change' }
        ],
        advertiser_id: [
          { required: true, message: '请选择客户联系人', trigger: 'change' }
        ],
        project_category_id: [
          { required: true, message: '请选择项目品类', trigger: 'change' }
        ],
        survey_category_id: [
          { required: true, message: '请选择调研类型', trigger: 'change' }
        ],
        is_jv: [
          { required: true, message: '请选择是否jv项目', trigger: 'change' }
        ],
        jv_name: [
          { validator: validJvName, trigger: 'change' }
        ],
        is_prepaid: [
          { required: true, message: '请选择是否是预付项目', trigger: 'change' }
        ],
        belong_project_id: [
          { validator: validPrePaidProjectId, trigger: 'change' }
        ],
        pm: [
          { required: true, message: '请选择PM', trigger: 'change' }
        ],
        apm: [
          { required: true, message: '请选择APM', trigger: 'change' }
        ],
        test_mark: [
          { required: true, message: '请选择是否是测试项目', trigger: 'change' }
        ],
        research_method: [
          { required: true, message: '请选择调研方法', trigger: 'change' }
        ],
        research_purpose: [
          { required: true, message: '请选择主调研类型', trigger: 'change' }
        ],
        vice_research_purpose: [
          { required: false, message: '请选择副调研类型', trigger: 'change' }
        ],
        flow_channel: [
          { required: true, message: '请选择流量渠道', trigger: 'change' }
        ]
      },
      loading: false,
      companyLists: [],
      projectCategoryLists: [],
      checkedCompany: '',
      brandLists: [],
      surveyCategoryLists: [],
      ezTestAdvertiserLists: [],
      jvLists: [
        '敏锐信息',
        '快泰科技',
        '乐箸信息'
      ],
      pmList: [],
      apmList: [],
      allProjectLists: [],
      assignmentLists: [],
      researchMethodList: [], // 调研方法数据列表
      flowChannelList: [], // 流量渠道数据列表
      researchPurposeList: [] // 调研目的数据列表
    }
  },
  methods: {
    cancelEdit () {
      if (this.editStatus === 1) {
        this.$router.push({path: '/project-management'})
      } else {
        this.$emit('go-back')
      }
    },
    nextStep () {
      this.clickSaveBasicInfo('next-step')
    },
    getAllDatas () {
      this.loading = true
      const getCompanyListApi = companyApi.list()
      const getProjectCategoryTreeApi = categoryApi.getProjectCategoryTree()
      const brandListApi = brandApi.list()
      const getSurveyCategoryTreeApi = categoryApi.getSurveyCategoryTree()
      const getEzTestAdvertiserApi = advertiserApi.getOutsiderAdvertiser()
      const getAssignmentListApi = ownershipApi.getAssignmentList({})
      const getAllProjectListApi = projectApi.getAllProjectList()
      const getResearchMethodApi = projectApi.getResearchMethod()
      const getFlowChannelApi = projectApi.getFlowChannel()
      const getResearchPurposeApi = projectApi.getResearchPurpose()
      let getProjectBasisInfoApi
      let generateProjectNoApi
      var allApiArr = [
        getCompanyListApi,
        getProjectCategoryTreeApi,
        brandListApi,
        getSurveyCategoryTreeApi,
        getEzTestAdvertiserApi,
        getAssignmentListApi,
        getAllProjectListApi
      ]
      const projectId = this.$route.query.project_id
      // 判断是否是编辑页面
      if (projectId && this.$route.path.includes('edit')) {
        this.form.project_id = projectId
        this.editStatus = 2
        const data = {
          project_id: projectId
        }
        getProjectBasisInfoApi = projectApi.getProjectBasisInfo(data)
        allApiArr.push(getProjectBasisInfoApi)
      } else {
        // 重新获取项目号
        generateProjectNoApi = projectApi.generateProjectNo()
        allApiArr.push(generateProjectNoApi)
      }
      // 增加三个接口
      allApiArr.push(...[getResearchMethodApi, getFlowChannelApi, getResearchPurposeApi])
      Promise.all(allApiArr).then(results => {
        this.companyLists = results[0]
        this.projectCategoryLists = results[1]
        this.brandLists = results[2]
        this.surveyCategoryLists = results[3]
        this.ezTestAdvertiserLists = results[4]
        this.pmList = uniqBy(results[5].list.filter(item => item.department_id === 201).concat(results[7].pm || []), 'admin_id')
        this.apmList = uniqBy(results[5].list.filter(item => item.department_id === 301).concat(results[7].apm || []), 'admin_id')
        this.assignmentLists = uniqBy(results[5].list.concat(...(results[7].apm || []), ...(results[7].pm || [])), 'admin_id')
        this.allProjectLists = results[6]
        if (this.editStatus === 2) {
          this.handleProjectData(results[7])
        } else {
          this.form.project_no = results[7]
        }
        this.researchMethodList = results[8]
        this.flowChannelList = results[9]
        this.researchPurposeList = results[10]
      }).finally(() => {
        this.loading = false
      })
    },
    handleProjectData (projectData) {
      projectData.apm = this.getPeopleIds(projectData.apm)
      projectData.pm = this.getPeopleIds(projectData.pm)
      projectData.operator = this.getPeopleIds(projectData.operator)
      for (let key in this.form) {
        this.form[key] = projectData[key]
        this.form.research_method = this.form.research_method || ''
        this.form.research_purpose = this.form.research_purpose || ''
      }
      this.form['belong_project_id'] = this.form['belong_project_id'] || ''
    },
    // 获取人员id
    getPeopleIds (arr) {
      return arr ? arr.map(item => item.admin_id) : []
    },
    generateProjectNo () {
      projectApi.generateProjectNo().then(res => {
        this.form.project_no = res
      })
    },
    clickSaveBasicInfo (type = 'go-back') {
      this.$refs['form'].validate((valid) => {
        const cloneForm = JSON.parse(JSON.stringify(this.form))
        console.log('cloneForm', cloneForm)
        cloneForm.apm = this.getPeopleInfo(cloneForm.apm)
        cloneForm.pm = this.getPeopleInfo(cloneForm.pm)
        cloneForm.operator = this.getPeopleInfo(cloneForm.operator)
        cloneForm.jv_name = cloneForm.is_jv === 2 ? '' : cloneForm.jv_name
        cloneForm.belong_project_id = cloneForm.is_prepaid === 0 ? '' : cloneForm.belong_project_id
        const data = {
          data: JSON.stringify(cloneForm)
        }
        if (valid) {
          projectApi.saveBasicInfo(data).then(res => {
            const message = type === 'go-back' ? '保存成功，即将返回' : '保存成功'
            this.$emit('show-mask', true)
            this.$message({
              message,
              duration: 1300,
              type: 'success',
              onClose: () => {
                this.$emit('show-mask', false)
                if (this.editStatus === 1) {
                  this.$router.push({path: '/project-management'})
                  return
                }
                if (type === 'go-back') {
                  this.$emit('go-back')
                } else {
                  this.$emit('next-step', '1')
                }
              }
            })
          }, (code, data) => {
            if (+code === 2) {
              this.generateProjectNo()
            }
          })
        } else {
          return false
        }
      })
    },
    // 根据ids 获取含有名称的数组
    getPeopleInfo (ids) {
      return this.assignmentLists.filter(item => ids.includes(item.admin_id))
        .map(list => ({
          admin_id: list.admin_id,
          admin_name: list.real_name
        }))
    }
  },
  created () {
    this.getAllDatas()
  }
}
`
let ast = parser.parse(code, {
  sourceType: 'module',
  plugins: [
    'classProperties',
    'methodDefinition',
    'decorators-legacy'
  ]
})


traverse(ast, {
  StringLiteral (path) {
    let value = path.node.value
    const regText = new RegExp('([\u4E00-\u9FA5\uF900-\uFA2D]+)', 'gi')
    if (regText.test(value)) {
      let callExpressionss = t.callExpression(
        t.memberExpression(t.thisExpression(), t.identifier('$t')),
        [path.node]
      )
      path.replaceWith(
        callExpressionss
      )
      path.skip()
    }
  }
})

const output = generate(ast, {}).code

console.log(output)