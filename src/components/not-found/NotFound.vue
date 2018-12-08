<template>
  <h1>404！ 您访问的页面不存在，3秒后回到首页</h1>
</template>

<script>
export default {
  created () {
    setTimeout(() => {
      this.$router.push('/home')
    }, 3000)
  }
}
</script>

<style>
</style>
