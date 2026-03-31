import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginParams, RegisterParams } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const loading = ref<boolean>(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const userId = computed(() => userInfo.value?.id || '')
  const userName = computed(() => userInfo.value?.name || '用户')

  // 从本地存储初始化
  const initialize = () => {
    const savedToken = localStorage.getItem('user_token')
    const savedUserInfo = localStorage.getItem('user_info')

    if (savedToken) {
      token.value = savedToken
    }

    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        localStorage.removeItem('user_info')
      }
    }
  }

  // 登录
  const login = async (params: LoginParams) => {
    loading.value = true
    try {
      // 这里应该调用API，这里模拟成功
      const mockToken = 'mock_jwt_token_' + Date.now()
      const mockUserInfo: UserInfo = {
        id: '1',
        name: params.username || '用户',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        phone: params.phone || '',
        email: '',
        createTime: new Date().toISOString(),
      }

      token.value = mockToken
      userInfo.value = mockUserInfo

      // 保存到本地存储
      localStorage.setItem('user_token', mockToken)
      localStorage.setItem('user_info', JSON.stringify(mockUserInfo))

      return { success: true, message: '登录成功' }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, message: '登录失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 第三方登录
  const socialLogin = async (provider: 'wechat' | 'qq' | 'weibo') => {
    loading.value = true
    try {
      // 这里应该调用第三方登录API
      // 模拟重定向到第三方登录页面
      window.location.href = `/api/auth/${provider}?redirect=${encodeURIComponent(window.location.href)}`
      return { success: true }
    } catch (error) {
      console.error('第三方登录失败:', error)
      return { success: false, message: '第三方登录失败' }
    } finally {
      loading.value = false
    }
  }

  // 注册
  const register = async (params: RegisterParams) => {
    loading.value = true
    try {
      // 这里应该调用API，这里模拟成功
      const mockToken = 'mock_jwt_token_' + Date.now()
      const mockUserInfo: UserInfo = {
        id: '2',
        name: params.username,
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        phone: params.phone,
        email: params.email || '',
        createTime: new Date().toISOString(),
      }

      token.value = mockToken
      userInfo.value = mockUserInfo

      localStorage.setItem('user_token', mockToken)
      localStorage.setItem('user_info', JSON.stringify(mockUserInfo))

      return { success: true, message: '注册成功' }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, message: '注册失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_info')
    // 跳转到首页
    window.location.href = '/'
  }

  // 更新用户信息
  const updateUserInfo = async (info: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info }
      localStorage.setItem('user_info', JSON.stringify(userInfo.value))
      return { success: true, message: '更新成功' }
    }
    return { success: false, message: '用户未登录' }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) {
      return { success: false, message: '未登录' }
    }

    loading.value = true
    try {
      // 这里应该调用API获取用户信息
      // 模拟数据
      const mockUserInfo: UserInfo = {
        id: '1',
        name: '测试用户',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        phone: '13800138000',
        email: 'test@example.com',
        createTime: new Date().toISOString(),
      }

      userInfo.value = mockUserInfo
      localStorage.setItem('user_info', JSON.stringify(mockUserInfo))

      return { success: true, data: mockUserInfo }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return { success: false, message: '获取用户信息失败' }
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    token,
    userInfo,
    loading,

    // 计算属性
    isAuthenticated,
    userId,
    userName,

    // 方法
    initialize,
    login,
    socialLogin,
    register,
    logout,
    updateUserInfo,
    fetchUserInfo,
  }
})