import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductListPage from './ProductListPage.vue'

// Mock路由
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock Vant
vi.mock('vant', () => ({
  showToast: vi.fn(),
}))

// Mock Pinia store
vi.mock('@/stores/cart', () => ({
  useCartStore: () => ({
    addItem: vi.fn(),
    totalCount: 0,
  }),
}))

describe('ProductListPage', () => {
  it('正确渲染组件', () => {
    const wrapper = mount(ProductListPage)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.product-list-page').exists()).toBe(true)
  })

  it('包含搜索框', () => {
    const wrapper = mount(ProductListPage)
    expect(wrapper.find('.van-search').exists()).toBe(true)
  })

  it('包含筛选条件', () => {
    const wrapper = mount(ProductListPage)
    expect(wrapper.find('.van-dropdown-menu').exists()).toBe(true)
  })

  it('包含商品列表容器', () => {
    const wrapper = mount(ProductListPage)
    expect(wrapper.find('.product-grid').exists()).toBe(true)
  })
})
