// 导入axios
// import axios from 'axios'
// 邮箱正则
const EMAIL_REG = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
// 手机号码正则
const MOBILE_GER = /^1(3|4|5|7|8)\d{9}$/
export default {
  created () {
    // 发送请求，获取用户列表
    this.getUserList()
    this.getRoleList()
  },
  data () {
    return {
      userlist: [], // 用户列表数据
      total: 0, // 总条数
      pagesize: 3, // 每页大小
      pagenum: 1, // 展示第几页数据
      searchText: '',
      // 添加用户
      dialogFormVisible: false,
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户时的表单验证
      userAddRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '用户名长度为3到12个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度为6到12个字符', trigger: 'blur' }
        ],
        email: [
          // pattern 表示使用正则表达式对数据进行校验
          { pattern: EMAIL_REG, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: MOBILE_GER,
            message: '手机号码格式不正确',
            trigger: 'blur'
          }
        ]
      },
      // 编辑用户
      userEditDailog: false,
      userEditForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 分配角色
      isShowRolesFormVisible: false,
      userRoleForm: {
        username: '',
        rid: -1,
        userid: -1 // 用户id
      },
      userRoleList: []
    }
  },
  methods: {
    async getUserList (pagenum = 1, query = '') {
      const config = {
        // get请求参数
        params: {
          pagesize: this.pagesize,
          pagenum,
          query
        },
        // 设置请求头
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
      const res = await this.$http.get(
        'http://localhost:8888/api/private/v1/users',
        config
      )
      // console.log(res)
      const { data, meta } = res.data
      const { status } = meta
      const { users, total, pagenum: num } = data
      if (status === 200) {
        // 成功获取数据
        this.userlist = users
        // 总条数
        this.total = total
        // 设置当前页
        this.pagenum = num
      } else {
        this.$router.push('/login')
        localStorage.removeItem('token')
      }
    },
    changePage (curPage) {
      // console.log('点击分页了', curPage)
      this.getUserList(curPage, this.searchText)
    },
    search () {
      this.getUserList(1, this.searchText)
    },
    // 修改用户状态
    async changeUserState (curUser) {
      // console.log('changeuserstatus', curUser.mg_state, curUser.id)
      const url = `/users/${curUser.id}/state/${curUser.mg_state}`
      const res = await this.$http.put(url)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
      } else {
        this.$message({
          type: 'error',
          message: res.data.meta.msg
        })
      }
    },
    // 删除用户
    async delUser (id) {
      try {
        await this.$confirm('您确定删除该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送请求删除
        const res = await this.$http.delete(`/users/${id}`)
        const {
          meta: { status }
        } = res.data
        if (status === 200) {
          this.getUserList(1, this.searchText)
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      }
    },
    // 添加用户
    showAddUser () {
      this.dialogFormVisible = true
    },
    async addUser () {
      try {
        await this.$refs.userAddForm.validate()
        const res = await this.$http.post('/users', this.userAddForm)
        // console.log(res)
        const { meta } = res.data
        if (meta.status === 201) {
          this.$message({
            type: 'success',
            message: meta.msg
          })
          // 关闭添加用户对话框
          this.dialogFormVisible = false
          // 刷新表格数据
          this.getUserList(1, this.searchText)
        }
      } catch (e) {}
    },
    // 对话框关闭
    closeUserAddDialog () {
      this.$refs.userAddForm.resetFields()
    },
    // 编辑用户
    showEditUser (user) {
      this.userEditDailog = true
      for (let key in this.userEditForm) {
        this.userEditForm[key] = user[key]
      }
      // console.log(this.userEditForm)
    },
    async EditUser () {
      const { id, email, mobile } = this.userEditForm
      const res = await this.$http.put(`/users/${id}`, {
        email,
        mobile
      })
      // console.log(res)
      const { meta } = res.data
      if (meta.status === 200) {
        // 编辑用户成功
        this.$message({
          type: 'success',
          message: meta.msg
        })
        // 关闭编辑用户对话框
        this.userEditDailog = false
        // 刷新表格数据
        this.getUserList(1, this.searchText)
      } else {
        this.$message({
          type: 'error',
          message: meta.msg
        })
      }
    },
    // 分配角色
    async assignRoles (curUser) {
      console.log(curUser)
      this.isShowRolesFormVisible = true
      const res = await this.$http.get(`users/${curUser.id}`)
      // console.log(res)
      let { rid } = res.data.data
      rid = rid === -1 ? '' : rid
      // 显示当前用户的名称和角色
      this.userRoleForm.username = curUser.username
      this.userRoleForm.rid = rid
      this.userRoleForm.userid = curUser.id
    },
    // 获取角色列表数据
    async getRoleList () {
      const res = await this.$http.get('/roles')
      console.log(res)
      this.userRoleList = res.data.data
    },
    // 分配角色给用户
    async assignUserRole () {
      const { userid, rid } = this.userRoleForm
      const res = await this.$http.put(`users/${userid}/role`, { rid })
      // console.log(res)
      this.isShowRolesFormVisible = false // 关闭对话框
      this.getUserList(1, this.searchText) // 重新刷新用户列表
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
    }
  }
}
