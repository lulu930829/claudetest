<template>
  <div class="order-create-page">
    <van-nav-bar title="确认订单" left-arrow @click-left="goBack" placeholder safe-area-inset-top />

    <div class="order-container">
      <!-- 收货地址 -->
      <div class="address-section" @click="selectAddress">
        <van-icon name="location-o" size="20" />
        <div class="address-info">
          <div class="address-header" v-if="selectedAddress">
            <span class="name">{{ selectedAddress.name }}</span>
            <span class="phone">{{ selectedAddress.phone }}</span>
          </div>
          <div class="address-detail" v-if="selectedAddress">
            {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district
            }}{{ selectedAddress.detail }}
          </div>
          <div class="address-empty" v-else>
            <span>请选择收货地址</span>
          </div>
        </div>
        <van-icon name="arrow" size="16" />
      </div>

      <!-- 商品列表 -->
      <div class="product-section">
        <h3>商品信息</h3>
        <div class="product-list">
          <div class="product-item" v-for="item in orderItems" :key="item.id">
            <van-image :src="item.image" width="60" height="60" radius="4" fit="cover" />
            <div class="product-info">
              <div class="product-name">{{ item.name }}</div>
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
          <van-cell title="商品金额">
            <template #right-icon>¥{{ orderInfo.productAmount }}</template>
          </van-cell>
          <van-cell title="运费">
            <template #right-icon>¥{{ orderInfo.shippingFee }}</template>
          </van-cell>
          <van-cell title="优惠券">
            <template #right-icon>
              <van-button size="mini" plain @click="selectCoupon">
                {{ selectedCoupon ? `-¥${selectedCoupon.amount}` : '选择优惠券' }}
              </van-button>
            </template>
          </van-cell>
          <van-cell title="实付金额">
            <template #right-icon>
              <span class="total-amount">¥{{ orderInfo.totalAmount }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 备注 -->
      <div class="remark-section">
        <van-field
          v-model="remark"
          label="备注"
          placeholder="选填，可填写特殊要求"
          type="textarea"
          rows="1"
          autosize
        />
      </div>
    </div>

    <!-- 底部提交栏 -->
    <van-submit-bar
      :price="orderInfo.totalAmount * 100"
      button-text="提交订单"
      @submit="submitOrder"
      :loading="submitting"
    >
      <template #tip>
        点击提交即表示同意
        <router-link to="/agreement">《用户协议》</router-link>
      </template>
    </van-submit-bar>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { showToast } from 'vant'
  import type { OrderItem } from '@/types/order'

  const router = useRouter()

  const selectedAddress = ref<any>(null)
  const orderItems = ref<OrderItem[]>([])
  const selectedCoupon = ref<any>(null)
  const remark = ref('')
  const submitting = ref(false)

  const orderInfo = computed(() => {
    const productAmount = orderItems.value.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    const shippingFee = productAmount > 99 ? 0 : 10
    const discount = selectedCoupon.value?.amount || 0
    const totalAmount = productAmount + shippingFee - discount

    return {
      productAmount,
      shippingFee,
      discount,
      totalAmount,
    }
  })

  onMounted(() => {
    loadOrderData()
  })

  const loadOrderData = () => {
    // 模拟数据
    orderItems.value = [
      {
        id: '1',
        productId: '1',
        productName: 'Apple iPhone 15 Pro',
        image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        price: 8999,
        quantity: 1,
        skuInfo: '深空黑色 256GB',
      },
      {
        id: '2',
        productId: '2',
        productName: 'AirPods Pro',
        image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        price: 1899,
        quantity: 1,
      },
    ]

    // 模拟地址
    selectedAddress.value = {
      id: '1',
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区',
      isDefault: true,
    }
  }

  const selectAddress = () => {
    router.push({ name: 'UserAddress' })
  }

  const selectCoupon = () => {
    showToast('优惠券选择功能开发中')
  }

  const goBack = () => {
    router.go(-1)
  }

  const submitOrder = async () => {
    if (!selectedAddress.value) {
      showToast('请选择收货地址')
      return
    }

    submitting.value = true
    try {
      // 模拟提交订单
      await new Promise(resolve => setTimeout(resolve, 1000))

      const orderId = 'ORDER' + Date.now()
      showToast('订单创建成功')

      // 跳转到支付页面
      router.push({
        name: 'Payment',
        params: { orderId },
      })
    } catch (error) {
      console.error('创建订单失败:', error)
      showToast('创建订单失败，请重试')
    } finally {
      submitting.value = false
    }
  }
</script>

<style scoped lang="scss">
  .order-create-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-bottom: 50px;

    .order-container {
      .address-section {
        display: flex;
        align-items: center;
        padding: 16px;
        background: white;
        margin-bottom: 8px;
        cursor: pointer;

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

          .address-empty {
            font-size: 14px;
            color: #999;
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
    }
  }
</style>
