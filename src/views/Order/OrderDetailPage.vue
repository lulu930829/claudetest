<template>
  <div class="order-detail-page">
    <van-nav-bar title="订单详情" left-arrow @click-left="goBack" placeholder safe-area-inset-top />

    <div class="order-container" v-if="orderInfo">
      <!-- 订单状态 -->
      <div class="order-status-section">
        <van-icon :name="statusIcon" :color="statusColor" size="48" />
        <div class="status-text">{{ formatStatus(orderInfo.status) }}</div>
        <div class="status-desc">{{ statusDescription }}</div>
      </div>

      <!-- 收货地址 -->
      <div class="address-section" v-if="orderInfo.address">
        <van-icon name="location-o" size="20" />
        <div class="address-info">
          <div class="address-header">
            <span class="name">{{ orderInfo.address.name }}</span>
            <span class="phone">{{ orderInfo.address.phone }}</span>
          </div>
          <div class="address-detail">
            {{ orderInfo.address.province }}{{ orderInfo.address.city
            }}{{ orderInfo.address.district }}{{ orderInfo.address.detail }}
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="product-section">
        <h3>商品信息</h3>
        <div class="product-list">
          <div class="product-item" v-for="item in orderInfo.items" :key="item.id">
            <van-image :src="item.image" width="60" height="60" radius="4" fit="cover" />
            <div class="product-info">
              <div class="product-name">{{ item.productName }}</div>
              <div class="product-spec" v-if="item.skuInfo">{{ item.skuInfo }}</div>
              <div class="product-price">¥{{ item.price }}</div>
            </div>
            <div class="product-quantity">×{{ item.quantity }}</div>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="order-info-section">
        <van-cell-group>
          <van-cell title="订单编号">
            <template #right-icon>
              <span class="order-no">{{ orderInfo.orderNo }}</span>
            </template>
          </van-cell>
          <van-cell title="下单时间">
            <template #right-icon>
              {{ formatTime(orderInfo.createTime) }}
            </template>
          </van-cell>
          <van-cell title="支付时间" v-if="orderInfo.paymentTime">
            <template #right-icon>
              {{ formatTime(orderInfo.paymentTime) }}
            </template>
          </van-cell>
          <van-cell title="发货时间" v-if="orderInfo.shippingTime">
            <template #right-icon>
              {{ formatTime(orderInfo.shippingTime) }}
            </template>
          </van-cell>
          <van-cell title="支付方式" v-if="orderInfo.paymentMethod">
            <template #right-icon>
              {{ formatPaymentMethod(orderInfo.paymentMethod) }}
            </template>
          </van-cell>
          <van-cell title="商品金额">
            <template #right-icon>¥{{ productAmount }}</template>
          </van-cell>
          <van-cell title="运费">
            <template #right-icon>¥{{ orderInfo.shippingFee || 0 }}</template>
          </van-cell>
          <van-cell title="优惠金额">
            <template #right-icon>-¥{{ orderInfo.discountAmount || 0 }}</template>
          </van-cell>
          <van-cell title="实付金额">
            <template #right-icon>
              <span class="total-amount">¥{{ orderInfo.totalAmount }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 订单备注 -->
      <div class="remark-section" v-if="orderInfo.remark">
        <van-cell title="订单备注" :value="orderInfo.remark" />
      </div>

      <!-- 底部操作栏 -->
      <div class="action-section" v-if="showActions">
        <div class="action-buttons">
          <van-button
            v-if="orderInfo.status === 'pending'"
            type="primary"
            size="large"
            @click="payOrder"
          >
            去支付
          </van-button>
          <van-button
            v-if="orderInfo.status === 'pending'"
            type="default"
            size="large"
            @click="cancelOrder"
          >
            取消订单
          </van-button>
          <van-button
            v-if="orderInfo.status === 'received'"
            type="primary"
            size="large"
            @click="confirmReceipt"
          >
            确认收货
          </van-button>
          <van-button
            v-if="orderInfo.status === 'completed'"
            type="default"
            size="large"
            @click="goToReview"
          >
            评价订单
          </van-button>
          <van-button
            v-if="orderInfo.status === 'completed'"
            type="primary"
            size="large"
            @click="buyAgain"
          >
            再次购买
          </van-button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <van-loading v-else size="48" vertical>加载订单详情...</van-loading>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { showToast, showDialog } from 'vant'
  import type { OrderInfo } from '@/types/order'

  const route = useRoute()
  const router = useRouter()

  const orderId = route.params.id as string
  const orderInfo = ref<OrderInfo | null>(null)

  const productAmount = computed(() => {
    if (!orderInfo.value) return 0
    return orderInfo.value.items.reduce((sum, item) => {
      return sum + item.price * (item.quantity || 1)
    }, 0)
  })

  const statusIcon = computed(() => {
    const icons: Record<string, string> = {
      pending: 'clock-o',
      paid: 'checked',
      shipped: 'logistics',
      received: 'package-o',
      completed: 'passed',
      cancelled: 'close',
    }
    return icons[orderInfo.value?.status || 'pending'] || 'question-o'
  })

  const statusColor = computed(() => {
    const colors: Record<string, string> = {
      pending: '#ff976a',
      paid: '#07c160',
      shipped: '#1989fa',
      received: '#1989fa',
      completed: '#07c160',
      cancelled: '#969799',
    }
    return colors[orderInfo.value?.status || 'pending'] || '#969799'
  })

  const statusDescription = computed(() => {
    const descriptions: Record<string, string> = {
      pending: '等待买家付款',
      paid: '买家已付款，等待发货',
      shipped: '卖家已发货',
      received: '商品已送达，等待确认收货',
      completed: '交易成功',
      cancelled: '交易已取消',
    }
    return descriptions[orderInfo.value?.status || 'pending'] || ''
  })

  const showActions = computed(() => {
    const status = orderInfo.value?.status
    return status === 'pending' || status === 'received' || status === 'completed'
  })

  onMounted(() => {
    fetchOrderDetail()
  })

  const fetchOrderDetail = async () => {
    try {
      // 模拟API调用
      const mockOrder: OrderInfo = {
        id: orderId,
        orderNo: '2024033100012345',
        userId: '1',
        totalAmount: 8999.0,
        discountAmount: 0,
        shippingFee: 0,
        actualAmount: 8999.0,
        itemCount: 1,
        status: 'pending',
        paymentMethod: 'wechat',
        paymentTime: undefined,
        shippingTime: undefined,
        receiveTime: undefined,
        createTime: new Date(Date.now() - 3600000).toISOString(),
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'Apple iPhone 15 Pro',
            image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
            price: 8999.0,
            quantity: 1,
            skuInfo: '深空黑色 256GB',
          },
        ],
        address: {
          name: '张三',
          phone: '13800138000',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail: '科技园南区',
        },
        remark: '请尽快发货',
      }

      orderInfo.value = mockOrder
    } catch (error) {
      console.error('获取订单详情失败:', error)
      showToast('获取订单详情失败')
      router.go(-1)
    }
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

  const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, string> = {
      wechat: '微信支付',
      alipay: '支付宝',
      balance: '余额支付',
      cash: '货到付款',
    }
    return methodMap[method] || method
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const payOrder = () => {
    router.push({ name: 'Payment', params: { orderId } })
  }

  const cancelOrder = () => {
    showDialog({
      title: '确认取消',
      message: '确定要取消这个订单吗？',
      showCancelButton: true,
    }).then(() => {
      // 这里应该调用API取消订单
      if (orderInfo.value) {
        orderInfo.value.status = 'cancelled'
      }
      showToast('订单已取消')
    })
  }

  const confirmReceipt = () => {
    showDialog({
      title: '确认收货',
      message: '请确认已收到商品，确认后订单将完成',
      showCancelButton: true,
    }).then(() => {
      // 这里应该调用API确认收货
      if (orderInfo.value) {
        orderInfo.value.status = 'completed'
        orderInfo.value.receiveTime = new Date().toISOString()
      }
      showToast('确认收货成功')
    })
  }

  const goToReview = () => {
    showToast('评价功能开发中')
  }

  const buyAgain = () => {
    showToast('再次购买功能开发中')
  }

  const goBack = () => {
    router.go(-1)
  }
</script>

<style scoped lang="scss">
  .order-detail-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-bottom: 80px;

    .order-container {
      .order-status-section {
        background: white;
        padding: 40px 20px;
        text-align: center;
        margin-bottom: 8px;

        .status-text {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin: 12px 0 8px;
        }

        .status-desc {
          font-size: 14px;
          color: #666;
        }
      }

      .address-section {
        display: flex;
        align-items: center;
        padding: 16px;
        background: white;
        margin-bottom: 8px;

        .address-info {
          flex: 1;
          margin-left: 12px;

          .address-header {
            margin-bottom: 4px;

            .name {
              font-size: 14px;
              font-weight: bold;
              color: #333;
              margin-right: 12px;
            }

            .phone {
              font-size: 14px;
              color: #666;
            }
          }

          .address-detail {
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }
        }
      }

      .product-section {
        background: white;
        padding: 16px;
        margin-bottom: 8px;

        h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }

        .product-list {
          .product-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;

            &:last-child {
              border-bottom: none;
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
                margin-bottom: 4px;
              }

              .product-price {
                font-size: 14px;
                color: #ee0a24;
                font-weight: bold;
              }
            }

            .product-quantity {
              font-size: 14px;
              color: #666;
            }
          }
        }
      }

      .order-info-section {
        background: white;
        margin-bottom: 8px;

        :deep(.van-cell) {
          padding: 12px 16px;

          .order-no {
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }

          .total-amount {
            font-size: 16px;
            color: #ee0a24;
            font-weight: bold;
          }
        }
      }

      .remark-section {
        background: white;
        margin-bottom: 8px;
      }

      .action-section {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;
        background: white;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

        .action-buttons {
          display: flex;
          gap: 8px;

          .van-button {
            flex: 1;
          }
        }
      }
    }
  }
</style>
