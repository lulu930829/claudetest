<template>
  <div class="not-found-page">
    <van-nav-bar title="页面不存在" left-arrow @click-left="goBack" />

    <div class="error-container">
      <van-image
        src="https://fastly.jsdelivr.net/npm/@vant/assets/empty-image-error.png"
        width="200"
        height="200"
      />
      <h2 class="error-title">404</h2>
      <p class="error-message">抱歉，您访问的页面不存在</p>

      <div class="action-buttons">
        <van-button type="primary" @click="goHome">返回首页</van-button>
        <van-button @click="goBack">返回上一页</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'Home' })
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
.not-found-page {
  min-height: 100vh;
  background-color: #f7f8fa;

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;

    .error-title {
      font-size: 48px;
      color: #333;
      margin: 20px 0 10px;
    }

    .error-message {
      font-size: 16px;
      color: #666;
      margin-bottom: 40px;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      width: 100%;
      max-width: 300px;

      .van-button {
        flex: 1;
      }
    }
  }
}
</style>