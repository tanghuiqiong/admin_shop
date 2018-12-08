export default {
  data () {
    return {
      rolesList: [],
      rolesFormVisible: false,
      rightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 当前分配角色的id
      curRoleId: -1
    }
  },
  created () {
    this.getRolesList()
    // 获取权限列表数据
    this.getRightsTree()
  },
  methods: {
    // 获取权限列表数据
    async getRightsTree () {
      const res = await this.$http.get(`rights/tree`)
      console.log(res)
      this.rightsTree = res.data.data
    },
    async getRolesList () {
      const res = await this.$http.get('/roles')
      // console.log(res)
      this.rolesList = res.data.data
    },
    getIndex (index) {
      return index
    },
    // 删除角色的权限
    async removeUserRight (rightId, roleId) {
      const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
      console.log(res)
      this.getRolesList() // 刷新列表数据
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
    },
    // 分配权限
    // 点击按钮，弹出对话框
    isShowAssign (curRole) {
      this.rolesFormVisible = true
      this.curRoleId = curRole.id
      this.$nextTick(() => {
        // console.log(curRole)
        const checkedKeys = []
        curRole.children.forEach(levell1 => {
          levell1.children.forEach(levell2 => {
            levell2.children.forEach(levell3 => {
              checkedKeys.push(levell3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(checkedKeys)
      })
    },
    async assignRole () {
      // console.log(this.$refs.tree.getCheckedKeys())
      // console.log(this.$refs.tree.getHalfCheckedKeys())
      // 获取全选中的权限菜单id
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // 获取半选中权限菜单的id
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      const allKeys = [...checkedKeys, ...halfCheckedKeys]
      console.log(allKeys)
      const res = await this.$http.post(`roles/${this.curRoleId}/rights`, {
        rids: allKeys.join(',')
      })
      // 关闭对话框
      this.rolesFormVisible = false
      this.getRolesList() // 刷新列表数据
      // 提示已经分配权限成功
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
    }
  }
}
