import Vue from 'vue'
// 导入路由
import Router from 'vue-router'
import Login from '@/components/login/Login'
import NotFound from '@/components/not-found/NotFound'
// 异步组件语法
const Home = () => import('@/components/home/Home')
const Users = () => import('@/components/users/Users')
const Roles = () => import('@/components/roles/Roles')
const Rights = () => import('@/components/rights/Rights')
const Categories = () => import('@/components/categories/Categories')
// 通过 webpackChunkName 这个注释，给需要打包生成一个JS文件的两个组件起相同的名称，在打包的时候就可以打包生成一个JS文件了
const Goods = () =>
  import(/* webpackChunkName: 'goods' */ '@/components/goods/Goods')
const GoodsAdd = () =>
  import(/* webpackChunkName: 'goods' */ '@/components/goods-add/GoodsAdd')
// 导入创建好的两个单文件组件
// import Home from '@/components/home/Home'
// import Users from '@/components/users/Users'
// import Roles from '@/components/roles/Roles'
// import Rights from '@/components/rights/Rights'
// import Categories from '@/components/categories/Categories'
// import Goods from '@/components/goods/Goods'
// import GoodsAdd from '@/components/goods-add/GoodsAdd'

Vue.use(Router)
// 2.创建路由实例，配置路由规则
const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/categories', component: Categories },
        // { path: '/goods', component: Goods },
        { path: '/goods/:page?', component: Goods },
        { path: '/goods-add', component: GoodsAdd }
      ]
    },
    { path: '/login', component: Login },
    { path: '*', component: NotFound }
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
