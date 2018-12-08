export default {
  data () {
    return {
      goodsList: [],
      total: 0,
      pagenum: 1,
      pagesize: 5
    }
  },
  created () {
    // console.log(this.$route.params)
    const curPage = this.$route.params.page
    this.getGoodsList(curPage)
  },
  watch: {
    $route (to, from) {
      this.getGoodsList(to.params.page)
    }
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList (pagenum = 1) {
      const res = await this.$http.get('goods', {
        params: {
          query: '',
          pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      const { pagenum: curPage, total, goods } = res.data.data
      this.goodsList = goods
      this.total = total
      this.pagenum = curPage - 0
    },
    currentChange (curPage) {
      // console.log(curPage)
      // this.getGoodsList(curPage)
      this.$router.push(`/goods/${curPage}`)
    }
  }
}
