<template>
  <div class="product-list-page">
    <!-- 固定顶部区域：导航栏、搜索、筛选 -->
    <div class="fixed-top-area">
      <van-nav-bar title="商品列表" left-arrow @click-left="goBack" safe-area-inset-top />

      <van-search
        v-model="searchKeyword"
        shape="round"
        placeholder="搜索商品"
        @search="onSearch"
        @clear="onClearSearch"
      />

      <!-- 筛选条件 -->
      <div class="filters">
        <van-dropdown-menu>
          <van-dropdown-item v-model="filter.categoryId" :options="categoryOptions" />
          <van-dropdown-item v-model="filter.sortBy" :options="sortOptions" />
          <van-dropdown-item v-model="filter.priceRange" :options="priceOptions" />
        </van-dropdown-menu>
      </div>
    </div>

    <!-- 商品列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="product-grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
          @click="goToProductDetail(product.id)"
        >
          <!-- 商品图片区域 -->
          <div class="product-image-container">
            <van-image :src="product.image" fit="cover" class="product-image" radius="4" />
            <!-- 标签 -->
            <div class="product-tags">
              <van-tag v-if="product.isHot" type="danger" size="small">热销</van-tag>
              <van-tag v-if="product.isNew" type="primary" size="small">新品</van-tag>
              <van-tag v-if="product.stock <= 10" type="warning" size="small">库存紧张</van-tag>
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">
              <span class="current-price">¥{{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price">
                ¥{{ product.originalPrice }}
              </span>
            </div>

            <!-- 加入购物车按钮 - 与图片底部对齐 -->
            <div class="product-actions">
              <van-button
                size="mini"
                type="primary"
                class="add-to-cart-btn"
                @click.stop="addToCart(product)"
              >
                加入购物车
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { showToast } from 'vant'
  import { useCartStore } from '@/stores/cart'
  import type { Product } from '@/types/product'

  const router = useRouter()
  const cartStore = useCartStore()

  const searchKeyword = ref('')
  const loading = ref(false)
  const finished = ref(false)
  const products = ref<Product[]>([])
  const page = ref(1)
  const pageSize = 10

  // 筛选条件
  const filter = ref({
    categoryId: '',
    sortBy: 'default',
    priceRange: '',
  })

  const categoryOptions = [
    { text: '全部分类', value: '' },
    { text: '手机数码', value: '1' },
    { text: '电脑办公', value: '2' },
    { text: '家用电器', value: '3' },
  ]

  const sortOptions = [
    { text: '默认排序', value: 'default' },
    { text: '价格从低到高', value: 'price_asc' },
    { text: '价格从高到低', value: 'price_desc' },
    { text: '销量从高到低', value: 'sales_desc' },
    { text: '新品优先', value: 'new_first' },
  ]

  const priceOptions = [
    { text: '全部价格', value: '' },
    { text: '0-100元', value: '0-100' },
    { text: '100-500元', value: '100-500' },
    { text: '500-1000元', value: '500-1000' },
    { text: '1000元以上', value: '1000-' },
  ]

  // 加载更多商品
  const onLoad = () => {
    loading.value = true

    // 模拟API调用
    setTimeout(() => {
      const mockProducts: Product[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${page.value}-${i}`,
        name: `商品 ${page.value * pageSize + i}`,
        description: '商品描述',
        price: Math.floor(Math.random() * 1000) + 100,
        originalPrice: Math.floor(Math.random() * 1200) + 200,
        image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        categoryId: '1',
        stock: Math.floor(Math.random() * 100),
        sales: Math.floor(Math.random() * 500),
        status: 'onSale',
        isHot: i < 2,
        isNew: i > 3,
        createTime: new Date().toISOString(),
      }))

      products.value.push(...mockProducts)
      page.value++
      loading.value = false

      // 模拟数据加载完成
      if (page.value > 3) {
        finished.value = true
      }
    }, 1000)
  }

  const onSearch = () => {
    products.value = []
    page.value = 1
    finished.value = false
    onLoad()
  }

  const onClearSearch = () => {
    searchKeyword.value = ''
    onSearch()
  }

  const goToProductDetail = (productId: string) => {
    router.push({ name: 'ProductDetail', params: { id: productId } })
  }

  const addToCart = (product: Product) => {
    cartStore.addItem(product, 1)
    showToast('已加入购物车')
  }

  const goBack = () => {
    router.go(-1)
  }
</script>

<style scoped lang="scss">
  .product-list-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-top: 150px; /* 为固定顶部区域预留空间（导航栏+搜索+筛选） */

    /* 固定顶部区域 */
    .fixed-top-area {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filters {
      background: white;
      margin-bottom: 0;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 12px;

      .product-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition:
          transform 0.2s,
          box-shadow 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;

          .product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .product-tags {
            position: absolute;
            top: 8px;
            left: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }
        }

        .product-info {
          padding: 12px;
          display: flex;
          flex-direction: column;
          height: 120px;

          .product-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            line-height: 1.4;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-shrink: 0;
          }

          .product-price {
            margin-bottom: 8px;
            flex-shrink: 0;

            .current-price {
              font-size: 18px;
              font-weight: bold;
              color: #ff4444;
              margin-right: 6px;
            }

            .original-price {
              font-size: 12px;
              color: #999;
              text-decoration: line-through;
            }
          }

          .product-actions {
            margin-top: auto;
            flex-shrink: 0;

            .add-to-cart-btn {
              width: 100%;
              border-radius: 4px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
</style>
