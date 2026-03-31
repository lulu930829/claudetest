<template>
  <div class="home-page">
    <van-nav-bar title="商城首页" fixed placeholder safe-area-inset-top />

    <van-search
      v-model="searchValue"
      shape="round"
      placeholder="搜索商品"
      @search="onSearch"
    />

    <!-- 轮播图 -->
    <van-swipe class="home-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in swipeList" :key="index">
        <img :src="item.image" :alt="item.title" class="swipe-image" />
      </van-swipe-item>
    </van-swipe>

    <!-- 分类导航 -->
    <div class="category-nav">
      <van-grid :column-num="5" :border="false">
        <van-grid-item
          v-for="category in categories"
          :key="category.id"
          :icon="category.icon"
          :text="category.name"
          @click="onCategoryClick(category.id)"
        />
      </van-grid>
    </div>

    <!-- 推荐商品 -->
    <div class="recommend-section">
      <div class="section-header">
        <h3>热门推荐</h3>
        <van-button type="primary" size="mini" plain @click="goToProductList">
          查看更多
        </van-button>
      </div>
      <van-grid :column-num="2" :gutter="10">
        <van-grid-item
          v-for="product in recommendProducts"
          :key="product.id"
          @click="goToProductDetail(product.id)"
        >
          <van-image
            :src="product.image"
            fit="cover"
            height="120"
            radius="4"
          />
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">¥{{ product.price }}</div>
          </div>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 底部导航 -->
    <van-tabbar v-model="activeTab" fixed placeholder safe-area-inset-bottom>
      <van-tabbar-item name="home" icon="home-o" @click="goToHome">首页</van-tabbar-item>
      <van-tabbar-item name="category" icon="apps-o" @click="goToCategory">分类</van-tabbar-item>
      <van-tabbar-item name="cart" icon="cart-o" :badge="cartCount" @click="goToCart">购物车</van-tabbar-item>
      <van-tabbar-item name="user" icon="user-o" @click="goToUser">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const searchValue = ref('')
const activeTab = ref('home')

// 模拟数据
const swipeList = ref([
  { id: 1, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', title: '新品上市' },
  { id: 2, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg', title: '限时抢购' },
  { id: 3, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg', title: '热卖推荐' },
])

const categories = ref([
  { id: 1, name: '手机数码', icon: 'phone-o' },
  { id: 2, name: '电脑办公', icon: 'laptop-o' },
  { id: 3, name: '家用电器', icon: 'tv-o' },
  { id: 4, name: '服饰鞋包', icon: 'gem-o' },
  { id: 5, name: '美妆护肤', icon: 'flower-o' },
  { id: 6, name: '食品生鲜', icon: 'fire-o' },
  { id: 7, name: '运动户外', icon: 'like-o' },
  { id: 8, name: '母婴玩具', icon: 'baby-o' },
  { id: 9, name: '家居日用', icon: 'home-o' },
  { id: 10, name: '图书音像', icon: 'book-o' },
])

const recommendProducts = ref([
  { id: 1, name: 'Apple iPhone 15 Pro', price: 8999, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg' },
  { id: 2, name: '小米14 Ultra', price: 6499, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg' },
  { id: 3, name: '华为Mate 60 Pro', price: 6999, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg' },
  { id: 4, name: '三星Galaxy S24', price: 5699, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg' },
])

// 计算购物车商品数量
const cartCount = computed(() => {
  return cartStore.totalCount > 0 ? cartStore.totalCount : ''
})

const onSearch = () => {
  if (searchValue.value.trim()) {
    router.push({
      name: 'ProductList',
      query: { keyword: searchValue.value.trim() }
    })
  } else {
    showToast('请输入搜索关键词')
  }
}

const onCategoryClick = (categoryId: number) => {
  router.push({
    name: 'ProductList',
    query: { categoryId: categoryId.toString() }
  })
}

const goToProductList = () => {
  router.push({ name: 'ProductList' })
}

const goToProductDetail = (productId: number) => {
  router.push({ name: 'ProductDetail', params: { id: productId } })
}

const goToHome = () => {
  router.push({ name: 'Home' })
}

const goToCategory = () => {
  router.push({ name: 'ProductList' })
}

const goToCart = () => {
  router.push({ name: 'Cart' })
}

const goToUser = () => {
  router.push({ name: 'UserCenter' })
}
</script>

<style scoped lang="scss">
.home-page {
  padding-bottom: 50px;
  background-color: #f7f8fa;

  .home-swipe {
    margin: 12px;
    border-radius: 8px;
    overflow: hidden;

    .swipe-image {
      width: 100%;
      height: 200px;
      display: block;
    }
  }

  .category-nav {
    background: white;
    margin: 12px;
    padding: 16px 0;
    border-radius: 8px;

    :deep(.van-grid-item__content) {
      padding: 8px;
    }
  }

  .recommend-section {
    background: white;
    margin: 12px;
    padding: 16px;
    border-radius: 8px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
    }

    .product-info {
      padding: 8px 0;

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
        color: #ff4444;
        font-weight: bold;
      }
    }
  }
}
</style>