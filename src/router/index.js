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
export default router
