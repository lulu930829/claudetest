import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'

describe('user store', () => {
  beforeEach(() => {
    // 创建一个新的pinia实例并激活它
    setActivePinia(createPinia())

    // 清除localStorage mock
    vi.clearAllMocks()
  })

  it('初始化状态', () => {
    const store = useUserStore()
    expect(store.token).toBe('')
    expect(store.userInfo).toBe(null)
    expect(store.loading).toBe(false)
    expect(store.isAuthenticated).toBe(false)
  })

  it('登录功能', async () => {
    const store = useUserStore()
    const loginParams = { username: 'testuser', phone: '13800138000' }

    const result = await store.login(loginParams)

    expect(result.success).toBe(true)
    expect(store.token).toBeTruthy()
    expect(store.userInfo).toBeTruthy()
    expect(store.userInfo?.name).toBe('testuser')
    expect(store.isAuthenticated).toBe(true)
  })

  it('注册功能', async () => {
    const store = useUserStore()
    const registerParams = {
      username: 'newuser',
      phone: '13900139000',
      email: 'new@example.com',
    }

    const result = await store.register(registerParams)

    expect(result.success).toBe(true)
    expect(store.token).toBeTruthy()
    expect(store.userInfo).toBeTruthy()
    expect(store.userInfo?.name).toBe('newuser')
  })

  it('退出登录', () => {
    const store = useUserStore()

    // 先登录
    store.token = 'test_token'
    store.userInfo = { id: '1', name: 'test', avatar: '', phone: '', email: '', createTime: '' }

    store.logout()

    expect(store.token).toBe('')
    expect(store.userInfo).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })

  it('更新用户信息', async () => {
    const store = useUserStore()

    // 先设置用户信息
    store.userInfo = { id: '1', name: 'old', avatar: '', phone: '', email: '', createTime: '' }

    const result = await store.updateUserInfo({ name: 'new name', email: 'new@example.com' })

    expect(result.success).toBe(true)
    expect(store.userInfo?.name).toBe('new name')
    expect(store.userInfo?.email).toBe('new@example.com')
  })

  it('获取用户信息', async () => {
    const store = useUserStore()

    // 设置token
    store.token = 'test_token'

    const result = await store.fetchUserInfo()

    expect(result.success).toBe(true)
    expect(result.data).toBeTruthy()
    expect(store.userInfo).toBeTruthy()
  })

  it('未登录时获取用户信息失败', async () => {
    const store = useUserStore()

    const result = await store.fetchUserInfo()

    expect(result.success).toBe(false)
    expect(result.message).toBe('未登录')
  })

  it('第三方登录', async () => {
    const store = useUserStore()
    const provider = 'wechat'
    // 设置当前页面URL
    const currentHref = 'http://example.com'
    window.location.href = currentHref

    const result = await store.socialLogin(provider)

    expect(result.success).toBe(true)
    // 验证window.location.href被设置为正确的重定向URL
    expect(window.location.href).toBe(
      `/api/auth/${provider}?redirect=${encodeURIComponent(currentHref)}`
    )
  })

  it('初始化从本地存储恢复状态', () => {
    const store = useUserStore()
    // 设置localStorage mock返回值
    const mockToken = 'saved_token'
    const mockUserInfo = { id: '1', name: 'saved' }
    localStorage.getItem.mockImplementation(key => {
      if (key === 'user_token') return mockToken
      if (key === 'user_info') return JSON.stringify(mockUserInfo)
      return null
    })

    store.initialize()

    expect(store.token).toBe(mockToken)
    expect(store.userInfo).toEqual(mockUserInfo)
  })

  it('初始化时无效的本地存储数据', () => {
    const store = useUserStore()
    localStorage.getItem.mockImplementation(key => {
      if (key === 'user_info') return 'invalid json'
      return null
    })

    store.initialize()

    expect(store.userInfo).toBe(null)
    // localStorage.removeItem应该被调用
    expect(localStorage.removeItem).toHaveBeenCalledWith('user_info')
  })
})
