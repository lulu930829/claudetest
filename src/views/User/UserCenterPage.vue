<template>
  <div class="user-center-page">
    <van-nav-bar title="我的" fixed placeholder safe-area-inset-top />

    <!-- 用户信息 -->
    <div class="user-info-card">
      <div class="user-header">
        <van-image :src="userInfo.avatar" width="60" height="60" round fit="cover" />
        <div class="user-detail">
          <div class="user-name">{{ userInfo.name }}</div>
          <div class="user-id">ID: {{ userInfo.id }}</div>
        </div>
        <van-icon name="arrow" size="16" @click="goToProfile" />
      </div>

      <div class="user-stats">
        <div class="stat-item" @click="goToOrderList('pending')">
          <div class="stat-value">{{ orderStats.pending }}</div>
          <div class="stat-label">待付款</div>
        </div>
        <div class="stat-item" @click="goToOrderList('shipped')">
          <div class="stat-value">{{ orderStats.shipped }}</div>
          <div class="stat-label">待发货</div>
        </div>
        <div class="stat-item" @click="goToOrderList('received')">
          <div class="stat-value">{{ orderStats.received }}</div>
          <div class="stat-label">待收货</div>
        </div>
        <div class="stat-item" @click="goToOrderList('completed')">
          <div class="stat-value">{{ orderStats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="function-menu">
      <van-cell-group>
        <van-cell title="我的订单" is-link @click="goToOrderList()">
          <template #right-icon>
            <van-tag v-if="orderStats.total > 0" type="danger">
              {{ orderStats.total }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="收货地址" is-link @click="goToAddress" />
        <van-cell title="我的收藏" is-link @click="goToFavorites" />
        <van-cell title="我的优惠券" is-link @click="goToCoupons" />
        <van-cell title="客服中心" is-link @click="goToService" />
        <van-cell title="设置" is-link @click="goToSettings" />
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <van-button round block type="default" @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { showDialog, showToast } from 'vant'
  import { useUserStore } from '@/stores/user'
  import type { UserInfo } from '@/types/user'

  const router = useRouter()
  const userStore = useUserStore()

  const userInfo = ref<UserInfo>({
    id: '',
    name: '用户',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    createTime: '',
  })

  const orderStats = ref({
    pending: 0,
    shipped: 0,
    received: 0,
    completed: 0,
    total: 0,
  })

  onMounted(() => {
    loadUserInfo()
    loadOrderStats()
  })

  const loadUserInfo = () => {
    if (userStore.userInfo) {
      userInfo.value = userStore.userInfo
    }
  }

  const loadOrderStats = () => {
    // 模拟订单统计
    orderStats.value = {
      pending: 2,
      shipped: 1,
      received: 3,
      completed: 12,
      total: 18,
    }
  }

  const goToProfile = () => {
    router.push({ name: 'UserProfile' })
  }

  const goToOrderList = (status?: string) => {
    router.push({
      name: 'OrderList',
      query: status ? { status } : {},
    })
  }

  const goToAddress = () => {
    router.push({ name: 'UserAddress' })
  }

  const goToFavorites = () => {
    showToast('我的收藏功能开发中')
  }

  const goToCoupons = () => {
    showToast('优惠券功能开发中')
  }

  const goToService = () => {
    showToast('客服中心功能开发中')
  }

  const goToSettings = () => {
    showToast('设置功能开发中')
  }

  const onLogout = () => {
    showDialog({
      title: '确认退出',
      message: '确定要退出登录吗？',
      showCancelButton: true,
    }).then(() => {
      userStore.logout()
      showToast('已退出登录')
      router.push({ name: 'Home' })
    })
  }
</script>

<style scoped lang="scss">
  .user-center-page {
    min-height: 100vh;
    background-color: #f7f8fa;

    .user-info-card {
      background: white;
      padding: 20px 16px;
      margin-bottom: 8px;

      .user-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .user-detail {
          flex: 1;
          margin-left: 12px;

          .user-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 4px;
          }

          .user-id {
            font-size: 12px;
            color: #999;
          }
        }
      }

      .user-stats {
        display: flex;
        justify-content: space-around;

        .stat-item {
          text-align: center;
          cursor: pointer;

          .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }

    .function-menu {
      background: white;
      margin-bottom: 8px;

      :deep(.van-cell) {
        padding: 16px;
      }
    }

    .logout-section {
      padding: 20px 16px;
    }
  }
</style>
