import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  // 注册为局部组件
  components: {
    quillEditor
  },
  data () {
    return {
      step: 0,
      tabActiveName: 'basic', // tag条
      // 表单数据
      goodsAddForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        is_promote: false,
        goods_cat_arr: [],
        // 获取商品分类列表数据
        cateList: [],
        // 上传文件的路径数组
        pics: [],
        goods_introduce: ''
      },
      radio: '1',
      // 上传文件的请求头
      headerUpload: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表数据
    async getCateList () {
      const res = await this.$http.get('categories', {
        params: {
          type: 3
        }
      })
      // console.log(res)
      this.goodsAddForm.cateList = res.data.data
    },
    changeTab (tab) {
      this.step = tab.index - 0
      // console.log(tab)
    },
    handleChange (value) {
      console.log(value)
    },
    nextStep (step, tabActiveName) {
      // console.log(step, tabActiveName)
      this.step = step
      this.tabActiveName = tabActiveName
    },
    // 上传图片
    handleUpload (response, file, fileList) {
      // console.log(response, file, fileList)
      this.goodsAddForm.pics.push({
        pic: response.data.tmp_path
      })
    },
    async addGoods () {
      /* eslint-disable camelcase */
      const {
        goods_name,
        goods_cat_arr,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics
      } = this.goodsAddForm
      const res = await this.$http.post('goods', {
        goods_name,
        goods_cat: goods_cat_arr.join(','),
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        attrs: []
      })
      // console.log(res)
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
      this.$router.push('/goods')
    }
  }
}
