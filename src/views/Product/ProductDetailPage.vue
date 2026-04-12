<template>
  <div class="product-detail-page">
    <van-nav-bar title="商品详情" left-arrow @click-left="goBack" placeholder safe-area-inset-top />

    <!-- 商品图片轮播 -->
    <van-swipe class="product-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in product.images" :key="index">
        <img :src="image" class="swipe-image" />
      </van-swipe-item>
    </van-swipe>

    <!-- 商品信息 -->
    <div class="product-info">
      <div class="price-section">
        <div class="current-price">¥{{ product.price }}</div>
        <div class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</div>
        <van-tag v-if="product.isHot" type="danger" size="medium">热销</van-tag>
        <van-tag v-if="product.isNew" type="primary" size="medium">新品</van-tag>
      </div>

      <h2 class="product-name">{{ product.name }}</h2>
      <p class="product-desc">{{ product.description }}</p>

      <div class="meta-info">
        <span>销量：{{ product.sales }}</span>
        <span>库存：{{ product.stock }}</span>
        <span v-if="product.brand">品牌：{{ product.brand }}</span>
      </div>
    </div>

    <!-- 规格选择 -->
    <div class="spec-section" v-if="product.specs && product.specs.length > 0">
      <h3>选择规格</h3>
      <div class="spec-options">
        <van-button
          v-for="spec in product.specs"
          :key="spec.id"
          size="small"
          plain
          :type="selectedSpec === spec.id ? 'primary' : 'default'"
          @click="selectSpec(spec.id)"
        >
          {{ spec.name }}
        </van-button>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="detail-section">
      <h3>商品详情</h3>
      <div class="detail-content" v-html="product.details"></div>
    </div>

    <!-- 底部操作栏 -->
    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" @click="onService" />
      <van-action-bar-icon icon="cart-o" text="购物车" :badge="cartCount" @click="goToCart" />
      <van-action-bar-button type="warning" text="加入购物车" @click="addToCart" />
      <van-action-bar-button type="danger" text="立即购买" @click="buyNow" />
    </van-action-bar>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { showToast } from 'vant'
  import { useCartStore } from '@/stores/cart'
  import type { Product, ProductSpec } from '@/types/product'

  const route = useRoute()
  const router = useRouter()
  const cartStore = useCartStore()

  const productId = route.params.id as string
  const product = ref<Product>({
    id: productId,
    name: '商品名称',
    description: '商品描述信息',
    price: 0,
    image: '',
    categoryId: '',
    stock: 0,
    sales: 0,
    status: 'onSale',
    createTime: '',
  })
  const selectedSpec = ref<string>('')
  const quantity = ref(1)

  const cartCount = computed(() => {
    return cartStore.totalCount > 0 ? cartStore.totalCount : ''
  })

  onMounted(() => {
    fetchProductDetail()
  })

  const fetchProductDetail = async () => {
    try {
      // 模拟API调用
      const mockProduct: Product = {
        id: productId,
        name: 'Apple iPhone 15 Pro',
        description: '苹果最新旗舰手机，A17 Pro芯片，钛金属机身',
        price: 8999,
        originalPrice: 9999,
        image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        images: [
          'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
          'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
          'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
        ],
        categoryId: '1',
        categoryName: '手机数码',
        brand: 'Apple',
        stock: 50,
        sales: 1200,
        tags: ['旗舰', '5G', '高端'],
        specs: [
          { id: '1', name: '128GB', values: [] },
          { id: '2', name: '256GB', values: [] },
          { id: '3', name: '512GB', values: [] },
        ],
        details: '<p>商品详细描述内容...</p>',
        isHot: true,
        isNew: true,
        isRecommend: true,
        status: 'onSale',
        createTime: new Date().toISOString(),
      }

      product.value = mockProduct
      if (mockProduct.specs && mockProduct.specs.length > 0) {
        selectedSpec.value = mockProduct.specs[0].id
      }
    } catch (error) {
      console.error('获取商品详情失败:', error)
      showToast('获取商品详情失败')
      router.go(-1)
    }
  }

  const selectSpec = (specId: string) => {
    selectedSpec.value = specId
  }

  const addToCart = () => {
    if (product.value.stock <= 0) {
      showToast('商品已售罄')
      return
    }

    const sku = selectedSpec.value ? { spec: selectedSpec.value } : {}
    cartStore.addItem(product.value, quantity.value, sku)
    showToast('已加入购物车')
  }

  const buyNow = () => {
    if (product.value.stock <= 0) {
      showToast('商品已售罄')
      return
    }

    // 这里应该跳转到订单确认页
    showToast('立即购买功能开发中')
  }

  const onService = () => {
    showToast('客服功能开发中')
  }

  const goToCart = () => {
    router.push({ name: 'Cart' })
  }

  const goBack = () => {
    router.go(-1)
  }
</script>

<style scoped lang="scss">
  .product-detail-page {
    min-height: 100vh;
    padding-bottom: 50px;
    background-color: #f7f8fa;

    .product-swipe {
      height: 400px;

      .swipe-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .product-info {
      background: white;
      padding: 16px;
      margin-bottom: 8px;

      .price-section {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;

        .current-price {
          font-size: 24px;
          color: #ee0a24;
          font-weight: bold;
        }

        .original-price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }
      }

      .product-name {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 8px;
      }

      .product-desc {
        font-size: 14px;
        color: #666;
        margin-bottom: 12px;
        line-height: 1.5;
      }

      .meta-info {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: #999;
      }
    }

    .spec-section {
      background: white;
      padding: 16px;
      margin-bottom: 8px;

      h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }

      .spec-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    .detail-section {
      background: white;
      padding: 16px;

      h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }

      .detail-content {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
      }
    }
  }
</style>
