 const ScriptParser = require('./ScriptParser')
// const code = `
// import { mapState, mapMutations } from 'vuex'
//   import debounce from 'lodash/debounce'
//   import cloneDeep from 'lodash/cloneDeep'
//   import projectApi from '@/allApi/project'
//   import ownershipApi from '@/allApi/ownership'
//   import formApi from '@/allApi/form'
//   import tabMixin from '@/lib/mixin/tab'
//   import { formatTimeString, getTokenId } from '@/lib/utils/index.js'

//   import page from 'components/pagination/page'
//   import BreadcrumbComponent from 'components/common/breadcrumb-component'
//   import AuditSetting from '../components/audit-setting'
//   import CommonScreenCondition from '../components/common-screen-condition.vue'
//   import OtherScreenCondition from '../components/other-screen-condition.vue'
//   import ProjectTable from './table.vue'
//   import tableAttributes from './table-attributes.json'
//   import searchConditionConfig from './search-condition.json'
//   import BudgetApplicationModal from '../components/budget-application-modal'
//   import costMarkDialog from '../components/cost-mark-dialog'
//   import qs from 'qs'

//   export default {
//     name: 'ProjectManagement',
//     mixins: [page, tabMixin],
//     data () {
//       return {
//         budgetVisible: false,
//         breadcrumbList: [
//           {
//             name: '业务管理',
//             path: ''
//           },
//           {
//             name: '项目管理',
//             path: ''
//           }
//         ],
//         tableData: [],
//         page: {
//           current: 1,
//           size: 10,
//           total: 0
//         },
//         tableAttributes: tableAttributes,
//         customizedCheckedAttribute: [],
//         data: [],
//         commonScreenConditionData: {
//           keyword: ''
//         },
//         otherScreenConditionData: {
//         },
//         showScreenPopover: false,
//         loading: false,
//         auditProjectId: 0,
//         auditInfo: {
//           pm: [],
//           apm: [],
//           deliveryPeoples: []
//         },
//         screenFormObj: {
//           itLists: [],
//           dpLists: [],
//           operationalLists: [],
//           allPeopleLists: []
//         },
//         commonScreenShowData: {},
//         otherScreenShowData: {},
//         assignmentLists: [],
//         screenFormData: {},
//         commonScreenPopover: false, // 常用筛选popover 是否展示
//         showScreenCondition: false,
//         showOtherScreenCondition: false
//       }
//     },
//     components: {
//       BreadcrumbComponent,
//       AuditSetting,
//       CommonScreenCondition,
//       OtherScreenCondition,
//       ProjectTable,
//       BudgetApplicationModal,
//       costMarkDialog
//     },
//     computed: {
//       ...mapState({
//         projectManageSearchCondition: state => state.Search.projectManageSearchCondition,
//         pageSize: state => state.Search.pageSize
//       }),
//       // 合并展示的筛选条件
//       screenShowData () {
//         return Object.assign({}, this.commonScreenShowData, this.otherScreenShowData)
//       },
//       customizedAttributes () {
//         return this.tableAttributes.filter(attribute => !attribute.defaultShow)
//       },
//       initialCommonCondition () {
//         return this.getInitSearchCondition(true)
//       },
//       initialUncommonCondition () {
//         return this.getInitSearchCondition(false)
//       }
//     },
//     watch: {
//       // 更新展示的筛选条件
//       commonScreenPopover (value) {
//         if (value && !this.loading) {
//           this.clickCommonScreen('hover')
//         }
//       },
//       // 搜索关键词改变
//       'commonScreenConditionData.keyword': debounce(function (keyword) {
//         this.recordSearchCondition()
//         this.setPagePosition(1, 'page')
//         this.setPagePosition(keyword, 'keyword')
//         this.getProjectList()
//       }, 600)
//     },
//     methods: {
//       ...mapMutations([
//         'setProjectManageSearchCondition',
//         'setPageSize'
//       ]),
//       getInitSearchCondition (isCommon) {
//         const commonSearchCondition = searchConditionConfig.filter(condition => condition.common === isCommon)
//         let result = {}
//         commonSearchCondition.forEach(condition => {
//           result[condition.key] = condition.value
//         })
//         return result
//       },
//       getScreenLabel (key) {
//         const targetCondition = searchConditionConfig.find(item => item.key === key) || {}
//         return targetCondition.label
//       },
//       // 点击提交审核处理数据
//       submitAudit (project) {
//         this.auditInfo.apm = project.apm.map(item => item.admin_id)
//         this.auditInfo.pm = project.pm.map(item => item.admin_id)
//         this.auditInfo.deliveryPeoples = project.head_of_delivery.map(item => item.admin_id)
//         this.auditInfo.assignmentLists = this.assignmentLists
//         this.$refs.auditSetting.show()
//         this.auditProjectId = project.project_id
//       },
//       // 清楚来自工作台的参数
//       changeStatus (status) {
//         this.setPagePosition('', status)
//       },
//       // 点击筛选进行筛选数据
//       clickScreenData () {
//         this.recordSearchCondition()
//         this.setPagePosition(1, 'page')
//         this.getProjectList({ page: 1 })
//         this.showScreenCondition = false
//       },
//       recordSearchCondition () {
//         this.setProjectManageSearchCondition(this.getScreenConditionData())
//       },
//       // 导出项目信息
//       exportProjectInfo () {
//         const params = this.getScreenConditionData()
//         const downloadUrl = '//' + location.host + '/index.php/project/exportProjectInfo?token_id=' + getTokenId() + '&search_condition=' + JSON.stringify(params)
//         window.open(downloadUrl)
//       },
//       clickCommonScreen (type) {
//         if (this.screenFormData) {
//           for (let key in this.screenFormData) {
//             // 兼容旧数据把时间的对象形式改为''
//             if (key.indexOf('time') > -1 && Object.prototype.toString.call(this.screenFormData[key]) === '[object Object]') {
//               this.screenFormData[key] = ''
//             }
//           }
//           let commonCondition = cloneDeep(this.commonScreenConditionData)
//           let otherCondition = cloneDeep(this.otherScreenConditionData)
//           for (let key in commonCondition) {
//             commonCondition[key] = this.screenFormData[key]
//           }
//           for (let key in otherCondition) {
//             otherCondition[key] = this.screenFormData[key]
//           }
//           this.$refs.commonScreenElement.getCommonScreenShowData(commonCondition)
//           this.$refs.otherScreenElement.getOtherScreenShowData(otherCondition)
//           if (type !== 'hover') {
//             this.commonScreenConditionData = commonCondition
//             this.otherScreenConditionData = otherCondition
//           }
//         }
//       },
//       // 点击常用筛选
//       useCommonScreen () {
//         this.clickCommonScreen()
//         this.recordSearchCondition()
//         this.setPagePosition(1, 'page')
//         this.getProjectList()
//         this.showScreenCondition = false
//       },
//       // 更新常用筛选展示
//       reviseCommonShowCondition (commonScreenShowData) {
//         this.commonScreenShowData = commonScreenShowData
//       },
//       // 更新不常用筛选展示
//       reviseOtherShowCondition (otherScreenShowData) {
//         this.otherScreenShowData = otherScreenShowData
//       },
//       changeSize (val) {
//         this.page.page_size = val
//         this.page.current = 1
//         this.setPageSize(val)
//         this.setPagePosition(1, 'page')
//         this.getProjectList()
//       },
//       getPeopleText (list) {
//         return list ? list.map(item => item.real_name).join(',') : ''
//       },
//       transformTimeRange (timeRange) {
//         return timeRange ? timeRange.map(time => Math.floor(new Date(time).getTime() / 1000)) : []
//       },
//       getScreenConditionData () {
//         const params = cloneDeep(Object.assign({}, this.commonScreenConditionData, this.otherScreenConditionData))
//         for (let key in params) {
//           if (key.indexOf('time') > -1) {
//             params[key] = this.transformTimeRange(params[key])
//           }
//         }
//         // 处理从工作台跳过来的情况 跳过来的是数组格式
//         var urlStatus = this.$route.query.status
//         var urlDeliveryStatus = this.$route.query.delivery_state
//         var startTime = this.$route.query.start_time
//         var endTime = this.$route.query.end_time
//         if (urlStatus) {
//           var status = JSON.parse(urlStatus)
//           params.status = status
//           this.commonScreenConditionData.status = status
//         }
//         if (urlDeliveryStatus) {
//           var deliveryStatus = JSON.parse(urlDeliveryStatus)
//           params.delivery_state = deliveryStatus
//           this.commonScreenConditionData.delivery_state = deliveryStatus
//         }
//         if (startTime || endTime) {
//           params.done_time = [startTime, endTime]
//         }
//         return params
//       },
//       conversionTimestamp (time) {
//         return new Date(time).getTime() / 1000
//       },
//       conversionTimeToStr (time) {
//         if (!time) {
//           return ''
//         }
//         return new Date(time * 1000)
//       },
//       showAllCondition () {
//         this.$refs.allScreenConditionEl.show()
//       },
//       hideAllCondition () {
//         this.$refs.allScreenConditionEl.hide()
//       },
//       saveCommonCondition () {
//         this.recordSearchCondition()
//         let searchCondition = Object.assign({}, this.commonScreenConditionData, this.otherScreenConditionData)
//         formApi.saveNewProjectManagementScreenSetting(searchCondition).then(res => {
//           this.screenFormData = searchCondition
//           this.$message.success('保存成功')
//         }).then(() => {
//           return this.getProjectList({ page: 1 })
//         }).finally(() => {
//           this.showScreenCondition = false
//         })
//       },
//       handleCurrentChange (value) {
//         console.log(value, 'value')
//         this.setPagePosition(value, 'page')
//         this.getProjectList({ page: value })
//       },
//       changeFormSetting () {
//         formApi.saveNewProjectManagementFormSetting(this.customizedCheckedAttribute)
//       },
//       initScreenConditionData () {
//         this.commonScreenConditionData = JSON.parse(JSON.stringify(this.initialCommonCondition))
//         this.otherScreenConditionData = JSON.parse(JSON.stringify(this.initialUncommonCondition))
//       },
//       resetScreenCondition () {
//         if (JSON.stringify(this.$route.query) !== '{}') {
//           this.$router.push({
//             path: '/project-management'
//           })
//         }
//         this.initScreenConditionData()
//         this.setProjectManageSearchCondition({})
//         this.getProjectList()
//         this.showScreenCondition = false
//       },
//       updateSearchCondition (searchCondition) {
//         for (let key in this.commonScreenConditionData) {
//           this.commonScreenConditionData[key] = searchCondition[key]
//           if (key.indexOf('time') > -1) {
//             this.commonScreenConditionData[key] = this.commonScreenConditionData[key].map(time => time * 1000)
//           }
//         }
//         for (let key in this.otherScreenConditionData) {
//           this.otherScreenConditionData[key] = searchCondition[key]
//           if (key.indexOf('time') > -1) {
//             this.otherScreenConditionData[key] = this.otherScreenConditionData[key].map(time => time * 1000)
//           }
//         }
//       },
//       async getProjectList (option = {}) {
//         this.loading = true
//         this.data = []
//         let searchCondition
//         if (JSON.stringify(this.projectManageSearchCondition) !== '{}') {
//           searchCondition = JSON.stringify(this.projectManageSearchCondition)
//           this.updateSearchCondition(this.projectManageSearchCondition)
//         } else {
//           searchCondition = JSON.stringify(this.getScreenConditionData())
//         }
//         try {
//           const params = {
//             page_size: this.pageSize || this.page.page_size || 10,
//             page: option.page || this.$route.query.page || 1,
//             search_condition: searchCondition
//           }
//           let data = await projectApi.getProjectList(params)
//           this.setPagination(data)
//           this.handleProjectListData(data.list)
//           if (!data) return
//           this.data = Array.from(data.list)
//           this.page.current = data.page
//           this.page.page_size = data.page_size
//           this.page.total = data.total
//         } finally {
//           this.loading = false
//         }
//       },
//       handleProjectListData (list) {
//         list.forEach(project => {
//           project.pm_text = this.getPeopleText(project.pm)
//           project.apm_text = this.getPeopleText(project.apm)
//           project.delivery_text = this.getPeopleText(project.head_of_delivery)
//           project.dp_text = this.getPeopleText(project.head_of_dp)
//           project.tech_text = this.getPeopleText(project.head_of_tech)
//           project.test_text = this.getPeopleText(project.head_of_test)
//           project.operator_text = this.getPeopleText(project.operator)
//           project.creator_text = this.getPeopleText(project.creator)
//           // 数字状态展示为文字
//           project.is_jv_text = +project.is_jv === 2 ? '否' : '是'
//           project.is_prepaid_text = +project.is_prepaid === 0 ? '否' : '是'
//           project.test_mark_text = +project.test_mark === 1 ? '否' : '是'
//           project.is_big_po_text = +project.is_big_po === 0 ? '否' : '是'
//           project.is_overdue_text = +project.is_overdue === 0 ? '否' : '是'
//           project.invoice_type_text = +project.invoice_type === 1 ? '增值税专用发票' : '增值税普通发票'
//           project.tax_rate_text = +project.tax_rate + '%'
//           project.invoice_status_text = project.invoice_status === 1 ? '有效' : '废弃'
//           project.is_discount_text = project.is_discount === 0 ? '否' : '是'
//           project.flow_channel_name_text = project.flow_channel_name.join(',')
//           project.vice_research_purpose_name_text = project.vice_research_purpose_name.join(',')
//           for (let key in project) {
//             if (key.includes('time')) {
//               project[key + '_text'] = project[key] ? formatTimeString(project[key] * 1000, 'yyyy-MM-dd') : ''
//             }
//           }
//         })
//       },
//       getAllDatas () {
//         this.loading = true
//         const formAttributeDataApi = formApi.getNewProjectManagementFormSetting()
//         const getAssignmentListApi = ownershipApi.getAssignmentList({})
//         const defaultScreenSettingApi = formApi.getNewProjectManagementScreenSetting()
//         const allApis = [
//           formAttributeDataApi,
//           getAssignmentListApi,
//           defaultScreenSettingApi
//         ]
//         Promise.all(allApis).then(results => {
//           this.customizedCheckedAttribute = results[0] || []
//           this.assignmentLists = results[1].list
//           this.screenFormData = results[2]
//         }).then(res => {
//           return this.getProjectList()
//         }).finally(() => {
//           this.loading = false
//         })
//       },
//       initSetting () {
//         this.commonScreenConditionData = cloneDeep(this.initialCommonCondition)
//         this.otherScreenConditionData = cloneDeep(this.initialUncommonCondition)
//         this.commonScreenConditionData.keyword = this.$route.query.keyword || ''
//         this.page.current = +this.$route.query.page || 1
//         this.getAllDatas()
//       },
//       exportWeekWord () {
//         let a = document.createElement('a')
//         let searchCondition
//         if (JSON.stringify(this.projectManageSearchCondition) !== '{}') {
//           searchCondition = JSON.stringify(this.projectManageSearchCondition)
//           this.updateSearchCondition(this.projectManageSearchCondition)
//         } else {
//           searchCondition = JSON.stringify(this.getScreenConditionData())
//         }
//         let data = {
//           token_id: this.$store.state.User.token_id,
//           search_condition: searchCondition
//         }
//         a.target = '_blank'
//         a.href = '/index.php/project/exportWeekPlan?' + qs.stringify(data)
//         a.click()
//       }
//     },
//     created () {
//       this.initSetting()
//       // 针对客户项目如果新的项目管理没有权限就跳到旧的项目管理
//       const hasProjectManagement = !!JSON.parse(window.sessionStorage.getItem('user_role_code'))['004_001_005']
//       if (!hasProjectManagement) {
//         this.$router.push({
//           path: '/project'
//         })
//       }
//     }
//   }
// `
const  code = `
import eztalkApi from '@/allApi/eztalk'
export default {
  data () {
    return {
      dialogVisible: false,
      phoneList: '',
      loading: false
    }
  },
  watch: {
    dialogVisible (value) {
      if (!value) {
        this.phoneList = ''
      }
    }
  },
  methods: {
    async getAndCheckPhone (status) {
      this.loading = true
      this.test = '这是中文法'
      console.log('phoneLists', phoneLists)
      if (!phoneLists.length) {
        this.$message.error(this.$t('index.common["请输入内容"]'))
        this.loading = false
        return
      }
      try {
        await eztalkApi.insertUser({project_id: this.$route.query.project_id, phones: phoneLists})
        this.$message({
          type: 'success',
          message: this.$t('index.detail["操作成功"]'),
          duration: 500,
          onClose: () => {
            this.dialogVisible = false
            this.$parent.filterInterviewer()
          }
        })
      } catch (e) {
        this.$message({
          type: 'error',
          message: this.$t('index.detail["操作失败"]'),
          duration: 1000
        })
      } finally {
        this.loading = false
      }
    },
    show () {
      this.dialogVisible = true
    },
    hide () {
      this.dialogVisible = false
    }
  }
}
`


let scriptTpl = new ScriptParser(code)

console.log(scriptTpl.transformCode())