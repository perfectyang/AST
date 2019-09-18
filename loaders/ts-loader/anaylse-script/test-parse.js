 const ScriptParser = require('./ScriptParser')

const code = `
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