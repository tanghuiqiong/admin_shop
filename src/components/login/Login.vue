<template>
  <div class="login">
    <el-row class="login" type="flex" justify="center" align="middle">
      <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
        <el-form :model="loginForm" :rules="rules" ref="ruleForm" class="login-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导入axios
import axios from 'axios'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return false
        }
        // 校验成功
        // 发送请求到登录接口
        axios
          .post('http://localhost:8888/api/private/v1/login', this.loginForm)
          .then(res => {
            // 登录成功，跳转到后台首页
            // 将token存储到localStorage中
            console.log(res)
            if (res.data.meta.status === 200) {
              localStorage.setItem('token', res.data.data.token)
              // 通过编程式实现路由跳转
              this.$router.push('/home')
              this.$message({
                message: res.data.meta.msg,
                type: 'success',
                duration: 1000
              })
            } else {
              this.$message({
                message: res.data.meta.msg,
                type: 'error',
                duration: 800
              })
            }
          })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less">
.login {
  height: 100%;
  background-color: #2d434c;
  &-ruleForm {
    padding: 20px;
    border-radius: 15px;
    background-color: #fff;
  }
}
</style>
