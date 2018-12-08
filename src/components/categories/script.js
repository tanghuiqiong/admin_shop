// 导入第三方组件，实现表格展开功能
import ElTreeGrid from 'element-tree-grid'

export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data () {
    return {
      categoriesList: [],
      total: 0,
      pagenum: 0,
      isloading: false,
      pagesize: 6, // 是否加载中
      dialogCateForm: false,
      addCate: {
        cat_name: '',
        cat_pid: -1,
        cat_level: -1,
        catIds: []
      },
      addCateList: [],
      propObj: {
        label: 'cat_name',
        value: 'cat_id'
      }
    }
  },
  created () {
    this.getCategories()
    this.getCateList()
  },
  methods: {
    // 获取分类列表数据
    async getCategories (curPage = 1) {
      this.isloading = true // 开启加载中
      const res = await this.$http.get('categories', {
        params: {
          type: 3,
          pagenum: curPage,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      const { total, result, pagenum } = res.data.data
      this.categoriesList = result
      this.total = total
      this.pagenum = pagenum + 1
      this.isloading = false // 关闭加载效果中
    },
    currentChange (curPage) {
      // console.log(curPage)
      this.getCategories(curPage)
    },
    // 添加分类弹出对话框
    isShowCate () {
      this.dialogCateForm = true
    },
    // 获取分类列表数据
    async getCateList () {
      const res = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      // console.log(res)
      this.addCateList = res.data.data
    },
    async addCateComfirm () {
      // console.log('哈哈')
      const { cat_name: catName, catIds } = this.addCate
      const data = {
        cat_name: catName,
        cat_pid: catIds[catIds.length - 1],
        cat_level: catIds.length
      }
      const res = await this.$http.post('categories', data)
      // console.log(res)
      this.dialogCateForm = false // 关闭对话框
      this.getCategories()
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
    }
  }
}
