<template>
  <el-container class="home">
    <el-header class="home-header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <div class="grid-content bg-purple"><img src="@/assets/images/logo.png" alt=""></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light title">电商后台管理系统</div>
        </el-col>
        <el-col :span="4" class="desc">
          欢迎上海前端27期星曜会员
          <a href="javascript:;" class="logout" @click.prevent="logout">退出</a>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu :unique-opened="true" :router="true" :default-active="$route.path.split('/').length === 2?$route.path:('/' + $route.path.split('/')[1])" class="home-header-menu" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <!-- 第一个菜单 -->
          <el-submenu :index="menu.id + ''" v-for="menu in menus" :key="menu.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+menu2.path" v-for="menu2 in menu.children" :key="menu2.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ menu2.authName }}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenus()
  },
  data () {
    return {
      menus: [] // 菜单列表数据
    }
  },
  methods: {
    // 动态获取菜单数据
    async getMenus () {
      const res = await this.$http.get('menus')
      // console.log(res)
      this.menus = res.data.data // 渲染列表数据
    },
    logout () {
      this.$confirm('您是否确定退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功'
          })
          // 清除token
          localStorage.removeItem('token')
          // 返回login页面
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出'
          })
        })
    }
  }
}
</script>

<style lang="less">
.el-header {
  padding: 0;
}
.home {
  height: 100%;
  background-color: #eaeef1;
  &-header {
    background-color: #b3c1cd;
    line-height: 60px;
    img {
      width: 200px;
    }
    .title {
      min-width: 282px;
      font-size: 30px;
      font-weight: 700;
      color: #fff;
    }
    .desc {
      font-size: 16px;
      min-width: 236px;
      font-weight: 700;
      .logout {
        color: #daa520;
      }
    }
    &-menu {
      height: 100%;
    }
  }
}
</style>
