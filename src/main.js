// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入 element-ui
import ElementUI from 'element-ui'
// 导入样式
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'
// 导入axios
import axios from 'axios'
// 配置接口的公共地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 将axios添加到Vue原型中
Vue.prototype.$http = axios
// 请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 所有请求完成后都要执行的操作
    // console.log('response', response)
    if (response.data.meta.status === 403) {
      console.log('没有权限访问接口')
      // console.log(Vue.prototype)

      vm.$message({
        type: 'error',
        message: '您没有权限访问这个接口'
      })
      vm.$router.push('/login')
      localStorage.removeItem('token')
    }
    return response
  },
  error => {
    // 错误处理
    return Promise.reject(error)
  }
)
// 安装 ElementUI插件
Vue.use(ElementUI)
Vue.config.productionTip = false
/* eslint-disable no-new */

const vm = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router
})
