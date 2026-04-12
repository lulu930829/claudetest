<template>
  <div class="payment-page">
    <van-nav-bar title="支付订单" left-arrow @click-left="goBack" placeholder safe-area-inset-top />

    <div class="payment-container" v-if="orderInfo">
      <!-- 订单信息 -->
      <div class="order-info-card">
        <div class="order-header">
          <h3>订单信息</h3>
          <span class="order-status">{{ formatStatus(orderInfo.status) }}</span>
        </div>
        <div class="order-details">
          <div class="order-item">
            <span class="label">订单号</span>
            <span class="value">{{ orderInfo.orderNo }}</span>
          </div>
          <div class="order-item">
            <span class="label">订单金额</span>
            <span class="value price">¥{{ orderInfo.totalAmount }}</span>
          </div>
          <div class="order-item">
            <span class="label">商品数量</span>
            <span class="value">{{ orderInfo.itemCount }}件</span>
          </div>
          <div class="order-item" v-if="orderInfo.createTime">
            <span class="label">下单时间</span>
            <span class="value">{{ formatTime(orderInfo.createTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="payment-methods">
        <h3>选择支付方式</h3>
        <van-radio-group v-model="selectedMethod">
          <van-cell-group>
            <van-cell
              v-for="method in paymentMethods"
              :key="method.value"
              clickable
              @click="selectedMethod = method.value"
            >
              <template #title>
                <div class="payment-method">
                  <van-icon :name="method.icon" :color="method.color" size="20" />
                  <span class="method-name">{{ method.name }}</span>
                </div>
              </template>
              <template #right-icon>
                <van-radio :name="method.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>

      <!-- 支付金额 -->
      <div class="payment-amount">
        <div class="amount-label">支付金额</div>
        <div class="amount-value">¥{{ orderInfo.totalAmount }}</div>
      </div>

      <!-- 支付按钮 -->
      <div class="payment-action">
        <van-button round block type="primary" size="large" :loading="paying" @click="onPay">
          确认支付 ¥{{ orderInfo.totalAmount }}
        </van-button>
      </div>

      <!-- 支付结果弹窗 -->
      <van-dialog
        v-model:show="showResultDialog"
        :title="paymentResult.success ? '支付成功' : '支付失败'"
        show-cancel-button
        @confirm="onResultConfirm"
        @cancel="onResultCancel"
      >
        <div class="result-content">
          <van-icon
            :name="paymentResult.success ? 'success' : 'fail'"
            :color="paymentResult.success ? '#07c160' : '#ee0a24'"
            size="48"
          />
          <p class="result-message">{{ paymentResult.message }}</p>
          <p class="order-no" v-if="paymentResult.orderNo">订单号：{{ paymentResult.orderNo }}</p>
          <p class="payment-time" v-if="paymentResult.paymentTime">
            支付时间：{{ formatTime(paymentResult.paymentTime) }}
          </p>
        </div>
      </van-dialog>
    </div>

    <!-- 加载状态 -->
    <van-loading v-else size="48" vertical>加载订单信息...</van-loading>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { showToast, showDialog } from 'vant'
  import type { PaymentMethod, OrderInfo, PaymentResult } from '@/types/order'

  const route = useRoute()
  const router = useRouter()

  const orderId = route.params.orderId as string
  const orderInfo = ref<OrderInfo | null>(null)
  const selectedMethod = ref<'wechat' | 'alipay'>('wechat')
  const paying = ref(false)
  const showResultDialog = ref(false)
  const paymentResult = ref<PaymentResult>({
    success: false,
    message: '',
  })

  // 支付方式列表
  const paymentMethods = ref<PaymentMethod[]>([
    { value: 'wechat', name: '微信支付', icon: 'wechat', color: '#07c160' },
    { value: 'alipay', name: '支付宝支付', icon: 'alipay', color: '#1677ff' },
  ])

  onMounted(() => {
    fetchOrderInfo()
  })

  // 获取订单信息
  const fetchOrderInfo = async () => {
    try {
      // 模拟API调用
      const mockOrder: OrderInfo = {
        id: orderId,
        orderNo: '2024033100012345',
        userId: '1',
        totalAmount: 8999.0,
        itemCount: 1,
        status: 'pending',
        createTime: new Date().toISOString(),
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
      }
      orderInfo.value = mockOrder
    } catch (error) {
      console.error('获取订单信息失败:', error)
      showToast('获取订单信息失败')
      router.go(-1)
    }
  }

  // 微信支付
  const payWithWechat = async (orderId: string, amount: number) => {
    return new Promise<PaymentResult>(resolve => {
      // 这里应该调用微信支付SDK
      // 示例：调用微信JS-SDK的chooseWXPay

      // 模拟支付成功
      setTimeout(() => {
        resolve({
          success: true,
          message: '支付成功',
          orderNo: orderInfo.value?.orderNo || '',
          paymentTime: new Date().toISOString(),
          transactionId: 'WX' + Date.now(),
        })
      }, 2000)
    })
  }

  // 支付宝支付
  const payWithAlipay = async (orderId: string, amount: number) => {
    return new Promise<PaymentResult>(resolve => {
      // 这里应该调用支付宝支付SDK
      // 示例：调用支付宝H5支付

      // 模拟支付成功
      setTimeout(() => {
        resolve({
          success: true,
          message: '支付成功',
          orderNo: orderInfo.value?.orderNo || '',
          paymentTime: new Date().toISOString(),
          transactionId: 'ALIPAY' + Date.now(),
        })
      }, 2000)
    })
  }

  // 发起支付
  const onPay = async () => {
    if (!orderInfo.value) {
      showToast('订单信息不存在')
      return
    }

    paying.value = true

    try {
      let result: PaymentResult

      if (selectedMethod.value === 'wechat') {
        result = await payWithWechat(orderId, orderInfo.value.totalAmount)
      } else {
        result = await payWithAlipay(orderId, orderInfo.value.totalAmount)
      }

      paymentResult.value = result
      showResultDialog.value = true

      // 更新订单状态
      if (result.success && orderInfo.value) {
        orderInfo.value.status = 'paid'
      }
    } catch (error) {
      console.error('支付失败:', error)
      paymentResult.value = {
        success: false,
        message: '支付失败，请重试',
      }
      showResultDialog.value = true
    } finally {
      paying.value = false
    }
  }

  // 支付结果确认
  const onResultConfirm = () => {
    if (paymentResult.value.success) {
      // 跳转到订单详情页
      router.push({
        name: 'OrderDetail',
        params: { id: orderId },
      })
    } else {
      // 留在当前页面重试
      showResultDialog.value = false
    }
  }

  // 支付结果取消
  const onResultCancel = () => {
    showResultDialog.value = false
  }

  // 返回上一页
  const goBack = () => {
    router.go(-1)
  }

  // 格式化状态
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待支付',
      paid: '已支付',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消',
    }
    return statusMap[status] || status
  }

  // 格式化时间
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
</script>

<style scoped lang="scss">
  .payment-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-bottom: 80px;

    .payment-container {
      padding: 16px;

      .order-info-card {
        background: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          h3 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            color: #333;
          }

          .order-status {
            color: var(--van-primary-color);
            font-size: 14px;
            font-weight: bold;
          }
        }

        .order-details {
          .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;

            .label {
              color: #666;
            }

            .value {
              color: #333;
              font-weight: 500;

              &.price {
                color: #ee0a24;
                font-size: 16px;
                font-weight: bold;
              }
            }
          }
        }
      }

      .payment-methods {
        background: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;

        h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }

        .payment-method {
          display: flex;
          align-items: center;
          gap: 8px;

          .method-name {
            font-size: 14px;
            color: #333;
          }
        }
      }

      .payment-amount {
        background: white;
        border-radius: 8px;
        padding: 20px 16px;
        margin-bottom: 16px;
        text-align: center;

        .amount-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .amount-value {
          font-size: 32px;
          color: #ee0a24;
          font-weight: bold;
        }
      }

      .payment-action {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;
        background: white;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      }
    }

    .result-content {
      text-align: center;
      padding: 24px 16px;

      .result-message {
        margin: 16px 0;
        font-size: 16px;
        color: #333;
      }

      .order-no,
      .payment-time {
        margin: 8px 0;
        font-size: 14px;
        color: #666;
      }
    }
  }
</style>
