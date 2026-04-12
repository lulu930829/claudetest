<template>
  <div class="cart-page">
    <van-nav-bar title="购物车" left-arrow @click-left="goBack" placeholder safe-area-inset-top />

    <div class="cart-container" v-if="!isEmpty">
      <!-- 全选和编辑 -->
      <div class="cart-header">
        <van-checkbox v-model="allChecked" @click="toggleAllChecked">全选</van-checkbox>
        <van-button v-if="!isEditing" type="primary" size="small" plain @click="startEdit">
          编辑
        </van-button>
        <van-button v-else type="primary" size="small" plain @click="finishEdit">完成</van-button>
      </div>

      <!-- 购物车商品列表 -->
      <van-checkbox-group v-model="checkedItems" ref="checkboxGroup">
        <div class="cart-items">
          <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
            <van-checkbox :name="item.id" />
            <div class="item-content" @click="goToProductDetail(item.productId)">
              <van-image :src="item.image" width="80" height="80" radius="4" fit="cover" />
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-spec" v-if="item.sku && Object.keys(item.sku).length > 0">
                  {{ formatSku(item.sku) }}
                </div>
                <div class="item-price">
                  <span class="current-price">¥{{ item.price }}</span>
                  <span class="original-price" v-if="item.originalPrice">
                    ¥{{ item.originalPrice }}
                  </span>
                </div>
              </div>
            </div>
            <div class="item-actions">
              <van-stepper
                v-model="item.quantity"
                :min="1"
                :max="item.product?.stock || 99"
                integer
                @change="updateQuantity(item.id, item.quantity)"
              />
              <van-button v-if="isEditing" type="danger" size="mini" @click="removeItem(item.id)">
                删除
              </van-button>
            </div>
          </div>
        </div>
      </van-checkbox-group>

      <!-- 推荐商品 -->
      <div class="recommend-section" v-if="recommendProducts.length > 0">
        <h3>猜你喜欢</h3>
        <div class="recommend-list">
          <div
            class="recommend-item"
            v-for="product in recommendProducts"
            :key="product.id"
            @click="goToProductDetail(product.id)"
          >
            <van-image :src="product.image" width="80" height="80" radius="4" fit="cover" />
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">¥{{ product.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空购物车 -->
    <div class="empty-cart" v-else>
      <van-image
        src="https://fastly.jsdelivr.net/npm/@vant/assets/empty-image-shopping.png"
        width="200"
        height="200"
      />
      <p class="empty-text">购物车还是空的</p>
      <van-button type="primary" @click="goToHome">去逛逛</van-button>
    </div>

    <!-- 底部结算栏 -->
    <van-submit-bar
      v-if="!isEmpty"
      :price="totalPrice * 100"
      button-text="去结算"
      @submit="onSubmit"
      :disabled="checkedItems.length === 0"
    >
      <van-checkbox v-model="allChecked" @click="toggleAllChecked">全选</van-checkbox>
      <template #tip>您的收货地址不支持配送</template>
    </van-submit-bar>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { showToast } from 'vant'
  import { useCartStore } from '@/stores/cart'
  import type { Product } from '@/types/product'

  const router = useRouter()
  const cartStore = useCartStore()

  const isEditing = ref(false)
  const checkedItems = ref<string[]>([])
  const recommendProducts = ref<Product[]>([])

  const isEmpty = computed(() => cartStore.isEmpty)
  const allChecked = computed({
    get: () => cartStore.allChecked,
    set: value => {
      if (value) {
        cartStore.toggleAllChecked()
      }
    },
  })
  const totalPrice = computed(() => cartStore.totalPrice)

  onMounted(() => {
    cartStore.initialize()
    loadRecommendProducts()
  })

  // 监听勾选状态变化
  const updateCheckedItems = () => {
    checkedItems.value = cartStore.items.filter(item => item.checked).map(item => item.id)
  }

  // 初始化勾选状态
  updateCheckedItems()

  const loadRecommendProducts = () => {
    // 模拟推荐商品
    const mockProducts: Product[] = Array.from({ length: 3 }, (_, i) => ({
      id: `rec-${i}`,
      name: `推荐商品 ${i + 1}`,
      price: Math.floor(Math.random() * 500) + 100,
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
      categoryId: '1',
      stock: 100,
      sales: 50,
      status: 'onSale',
      createTime: new Date().toISOString(),
    }))

    recommendProducts.value = mockProducts
  }

  const toggleAllChecked = () => {
    cartStore.toggleAllChecked()
    updateCheckedItems()
  }

  const startEdit = () => {
    isEditing.value = true
  }

  const finishEdit = () => {
    isEditing.value = false
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    cartStore.updateQuantity(itemId, quantity)
  }

  const removeItem = (itemId: string) => {
    cartStore.removeItem(itemId)
    showToast('移除成功')
  }

  const formatSku = (sku: Record<string, any>) => {
    return Object.values(sku).join(' ')
  }

  const goToProductDetail = (productId: string) => {
    router.push({ name: 'ProductDetail', params: { id: productId } })
  }

  const goToHome = () => {
    router.push({ name: 'Home' })
  }

  const goBack = () => {
    router.go(-1)
  }

  const onSubmit = () => {
    if (checkedItems.value.length === 0) {
      showToast('请选择商品')
      return
    }

    // 跳转到订单确认页
    const selectedProducts = cartStore.items
      .filter(item => checkedItems.value.includes(item.id))
      .map(item => ({
        productId: item.productId,
        skuId: item.sku ? JSON.stringify(item.sku) : undefined,
        quantity: item.quantity,
      }))

    // 这里应该传递选中的商品信息到订单确认页
    router.push({
      name: 'OrderCreate',
      query: {
        items: JSON.stringify(selectedProducts),
      },
    })
  }
</script>

<style scoped lang="scss">
  .cart-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-bottom: 50px;

    .cart-container {
      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: white;
        margin-bottom: 8px;
      }

      .cart-items {
        background: white;

        .cart-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f5f5f5;

          .item-content {
            flex: 1;
            display: flex;
            align-items: center;
            margin-left: 12px;
            gap: 12px;

            .item-info {
              flex: 1;

              .item-name {
                font-size: 14px;
                color: #333;
                margin-bottom: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              .item-spec {
                font-size: 12px;
                color: #999;
                margin-bottom: 8px;
              }

              .item-price {
                .current-price {
                  font-size: 16px;
                  color: #ee0a24;
                  font-weight: bold;
                  margin-right: 8px;
                }

                .original-price {
                  font-size: 12px;
                  color: #999;
                  text-decoration: line-through;
                }
              }
            }
          }

          .item-actions {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
        }
      }

      .recommend-section {
        background: white;
        margin-top: 8px;
        padding: 16px;

        h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }

        .recommend-list {
          .recommend-item {
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
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              .product-price {
                font-size: 16px;
                color: #ee0a24;
                font-weight: bold;
              }
            }
          }
        }
      }
    }

    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;

      .empty-text {
        margin: 16px 0 24px;
        font-size: 16px;
        color: #666;
      }
    }
  }
</style>
