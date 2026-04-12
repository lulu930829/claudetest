<template>
  <div class="order-list-page">
    <van-nav-bar title="我的订单" left-arrow @click-left="goBack" placeholder safe-area-inset-top />

    <!-- 订单状态标签 -->
    <van-tabs v-model="activeTab" sticky swipeable>
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待付款" name="pending"></van-tab>
      <van-tab title="待发货" name="shipped"></van-tab>
      <van-tab title="待收货" name="received"></van-tab>
      <van-tab title="已完成" name="completed"></van-tab>
    </van-tabs>

    <!-- 订单列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="order-list">
        <div
          class="order-item"
          v-for="order in filteredOrders"
          :key="order.id"
          @click="goToOrderDetail(order.id)"
        >
          <div class="order-header">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span class="order-status">{{ formatStatus(order.status) }}</span>
          </div>

          <div class="order-products">
            <div class="product-item" v-for="item in order.items.slice(0, 3)" :key="item.id">
              <van-image :src="item.image" width="60" height="60" radius="4" fit="cover" />
              <div class="product-info">
                <div class="product-name">{{ item.productName }}</div>
                <div class="product-spec" v-if="item.skuInfo">{{ item.skuInfo }}</div>
              </div>
              <div class="product-price">¥{{ item.price }}</div>
            </div>
            <div class="more-products" v-if="order.items.length > 3">
              等{{ order.items.length }}件商品
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              共{{ order.itemCount }}件商品 合计：
              <span class="total-amount">¥{{ order.totalAmount }}</span>
            </div>
            <div class="order-actions">
              <van-button
                v-if="order.status === 'pending'"
                type="primary"
                size="small"
                plain
                @click.stop="payOrder(order.id)"
              >
                去支付
              </van-button>
              <van-button
                v-if="order.status === 'pending'"
                type="default"
                size="small"
                plain
                @click.stop="cancelOrder(order.id)"
              >
                取消订单
              </van-button>
              <van-button
                v-if="order.status === 'received'"
                type="primary"
                size="small"
                plain
                @click.stop="confirmReceipt(order.id)"
              >
                确认收货
              </van-button>
              <van-button
                v-if="order.status === 'completed'"
                type="default"
                size="small"
                plain
                @click.stop="goToReview(order.id)"
              >
                评价
              </van-button>
              <van-button
                v-if="order.status === 'completed'"
                type="default"
                size="small"
                plain
                @click.stop="buyAgain(order.id)"
              >
                再次购买
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { showToast, showDialog } from 'vant'
  import type { OrderInfo } from '@/types/order'

  const router = useRouter()

  const activeTab = ref('all')
  const loading = ref(false)
  const finished = ref(false)
  const orders = ref<OrderInfo[]>([])
  const page = ref(1)
  const pageSize = 10

  const filteredOrders = computed(() => {
    if (activeTab.value === 'all') {
      return orders.value
    }
    return orders.value.filter(order => order.status === activeTab.value)
  })

  // 监听标签切换
  watch(activeTab, () => {
    orders.value = []
    page.value = 1
    finished.value = false
    onLoad()
  })

  const onLoad = () => {
    loading.value = true

    // 模拟API调用
    setTimeout(() => {
      const statusList = ['pending', 'shipped', 'received', 'completed', 'completed']
      const mockOrders: OrderInfo[] = Array.from({ length: 5 }, (_, i) => {
        const status = statusList[Math.floor(Math.random() * statusList.length)]
        const orderId = `ORDER${page.value}${i}${Date.now()}`

        return {
          id: orderId,
          orderNo: orderId,
          userId: '1',
          totalAmount: Math.floor(Math.random() * 10000) + 1000,
          itemCount: Math.floor(Math.random() * 5) + 1,
          status: status as any,
          createTime: new Date().toISOString(),
          items: Array.from({ length: Math.min(4, Math.floor(Math.random() * 3) + 1) }, (_, j) => ({
            id: `${orderId}-${j}`,
            productId: `${j}`,
            productName: `商品 ${j + 1}`,
            image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
            price: Math.floor(Math.random() * 1000) + 100,
            quantity: 1,
          })),
        }
      })

      orders.value.push(...mockOrders)
      page.value++
      loading.value = false

      // 模拟数据加载完成
      if (page.value > 2) {
        finished.value = true
      }
    }, 1000)
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待付款',
      paid: '已支付',
      shipped: '已发货',
      received: '待收货',
      completed: '已完成',
      cancelled: '已取消',
    }
    return statusMap[status] || status
  }

  const goToOrderDetail = (orderId: string) => {
    router.push({ name: 'OrderDetail', params: { id: orderId } })
  }

  const goBack = () => {
    router.go(-1)
  }

  const payOrder = (orderId: string) => {
    router.push({ name: 'Payment', params: { orderId } })
  }

  const cancelOrder = (orderId: string) => {
    showDialog({
      title: '确认取消',
      message: '确定要取消这个订单吗？',
      showCancelButton: true,
    }).then(() => {
      // 这里应该调用API取消订单
      const orderIndex = orders.value.findIndex(order => order.id === orderId)
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = 'cancelled'
      }
      showToast('订单已取消')
    })
  }

  const confirmReceipt = (orderId: string) => {
    showDialog({
      title: '确认收货',
      message: '请确认已收到商品，确认后订单将完成',
      showCancelButton: true,
    }).then(() => {
      // 这里应该调用API确认收货
      const orderIndex = orders.value.findIndex(order => order.id === orderId)
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = 'completed'
      }
      showToast('确认收货成功')
    })
  }

  const goToReview = (orderId: string) => {
    showToast('评价功能开发中')
  }

  const buyAgain = (orderId: string) => {
    showToast('再次购买功能开发中')
  }
</script>

<style scoped lang="scss">
  .order-list-page {
    min-height: 100vh;
    background-color: #f7f8fa;

    .order-list {
      padding: 8px;

      .order-item {
        background: white;
        border-radius: 8px;
        margin-bottom: 8px;
        padding: 16px;
        cursor: pointer;

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f5f5f5;

          .order-no {
            font-size: 14px;
            color: #666;
          }

          .order-status {
            font-size: 14px;
            color: var(--van-primary-color);
            font-weight: bold;
          }
        }

        .order-products {
          .product-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;

            &:last-child {
              margin-bottom: 0;
            }

            .product-info {
              flex: 1;
              margin-left: 12px;

              .product-name {
                font-size: 14px;
                color: #333;
                margin-bottom: 4px;
              }

              .product-spec {
                font-size: 12px;
                color: #999;
              }
            }

            .product-price {
              font-size: 14px;
              color: #333;
              font-weight: bold;
            }
          }

          .more-products {
            text-align: center;
            padding: 8px;
            font-size: 12px;
            color: #999;
            background-color: #fafafa;
            border-radius: 4px;
            margin-top: 8px;
          }
        }

        .order-footer {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #f5f5f5;

          .order-total {
            text-align: right;
            font-size: 14px;
            color: #333;
            margin-bottom: 12px;

            .total-amount {
              font-size: 16px;
              color: #ee0a24;
              font-weight: bold;
            }
          }

          .order-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
          }
        }
      }
    }
  }
</style>
