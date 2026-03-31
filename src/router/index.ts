import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 路由组件懒加载
const Home = () => import('@/views/Home/HomePage.vue')
const Login = () => import('@/views/User/LoginPage.vue')
const Register = () => import('@/views/User/RegisterPage.vue')
const ProductList = () => import('@/views/Product/ProductListPage.vue')
const ProductDetail = () => import('@/views/Product/ProductDetailPage.vue')
const Cart = () => import('@/views/Cart/CartPage.vue')
const OrderCreate = () => import('@/views/Order/OrderCreatePage.vue')
const OrderList = () => import('@/views/Order/OrderListPage.vue')
const OrderDetail = () => import('@/views/Order/OrderDetailPage.vue')
const UserCenter = () => import('@/views/User/UserCenterPage.vue')
const UserProfile = () => import('@/views/User/UserProfilePage.vue')
const UserAddress = () => import('@/views/User/UserAddressPage.vue')
const Payment = () => import('@/views/Order/PaymentPage.vue')
const NotFound = () => import('@/views/Common/NotFoundPage.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      keepAlive: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      guestOnly: true, // 仅未登录用户可访问
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '注册',
      guestOnly: true,
    },
  },
  {
    path: '/product',
    name: 'ProductList',
    component: ProductList,
    meta: {
      title: '商品列表',
      keepAlive: true,
    },
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: {
      title: '商品详情',
    },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      title: '购物车',
      requiresAuth: true,
    },
  },
  {
    path: '/order/create',
    name: 'OrderCreate',
    component: OrderCreate,
    meta: {
      title: '创建订单',
      requiresAuth: true,
    },
  },
  {
    path: '/order',
    name: 'OrderList',
    component: OrderList,
    meta: {
      title: '我的订单',
      requiresAuth: true,
      keepAlive: true,
    },
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: '订单详情',
      requiresAuth: true,
    },
  },
  {
    path: '/payment/:orderId',
    name: 'Payment',
    component: Payment,
    meta: {
      title: '支付订单',
      requiresAuth: true,
    },
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: UserCenter,
    meta: {
      title: '用户中心',
      requiresAuth: true,
    },
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: {
      title: '个人信息',
      requiresAuth: true,
    },
  },
  {
    path: '/user/address',
    name: 'UserAddress',
    component: UserAddress,
    meta: {
      title: '收货地址',
      requiresAuth: true,
    },
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '页面不存在',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.isAuthenticated

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 商城`
  }

  // 需要登录的页面
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 仅未登录用户可访问的页面（如登录、注册）
  if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router