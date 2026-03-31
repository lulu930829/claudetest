<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

const userStore = useUserStore()

// 初始化用户信息
onMounted(() => {
  userStore.initialize()
})
</script>

<template>
  <div id="app">
    <!-- 路由视图 -->
    <RouterView v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <keep-alive :include="[]">
          <component
            :is="Component"
            :key="route.fullPath"
            v-if="!route.meta.keepAlive"
          />
        </keep-alive>
      </transition>
    </RouterView>

    <!-- 全局加载状态 -->
    <van-overlay :show="userStore.loading" class="global-loading">
      <van-loading type="spinner" size="48" />
    </van-overlay>
  </div>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
  background-color: var(--van-background-color);

  // 页面切换动画
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  // 全局加载样式
  .global-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.9);
  }
}
</style>
