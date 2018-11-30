import Vue from 'vue'
// 导入路由
import Router from 'vue-router'
// 导入创建好的两个单文件组件
import Home from '@/components/home/Home'
import Login from '@/components/login/Login'
Vue.use(Router)
// 2.创建路由实例，配置路由规则
const router = new Router({
  routes: [
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})
router.beforeEach((to, from, next) => {
  // 如果访问的登录页，直接展示登录页
  if (to.path === '/login') {
    next()
    return
  }
  // 判断有没有登录
  const token = localStorage.getItem('token')
  if (token) {
    // 登录，直接展示访问当前的页面
    next()
  } else {
    // 没有登录，跳回登录页登录
    next('/login')
  }
})
export default router
