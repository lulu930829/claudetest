import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import { createPinia } from 'pinia'

// 配置Vue测试工具
config.global.stubs = {
  RouterLink: true,
  RouterView: true,
  // Stub all Vant components
  'van-*': true,
}
// 全局插件
config.global.plugins = [createPinia()]

// 全局mock
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
  }),
  useRoute: () => ({
    path: '/',
    query: {},
    params: {},
  }),
  RouterView: { name: 'RouterView', render: () => null },
  RouterLink: { name: 'RouterLink', render: () => null },
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
})

// Mock CSS imports (Vant styles)
vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))
// Mock Vant toast
vi.mock('vant', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    showToast: vi.fn(),
  }
})
