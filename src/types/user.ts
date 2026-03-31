// 用户相关类型定义

export interface UserInfo {
  id: string
  name: string
  avatar?: string
  phone?: string
  email?: string
  gender?: 'male' | 'female' | 'unknown'
  birthday?: string
  createTime: string
  updateTime?: string
}

export interface LoginParams {
  phone?: string
  username?: string
  password: string
  captcha?: string
}

export interface RegisterParams {
  phone: string
  username: string
  password: string
  confirmPassword: string
  email?: string
  captcha?: string
}

export interface SocialLoginParams {
  provider: 'wechat' | 'qq' | 'weibo'
  code: string
  state?: string
}

export interface UpdateUserParams {
  name?: string
  avatar?: string
  gender?: 'male' | 'female' | 'unknown'
  birthday?: string
  email?: string
}

export interface AddressInfo {
  id: string
  userId: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
  createTime: string
  updateTime?: string
}

export interface CreateAddressParams {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault?: boolean
}

export interface UpdateAddressParams extends Partial<CreateAddressParams> {
  id: string
}

// 第三方登录配置
export interface SocialConfig {
  wechat: {
    appId: string
    scope: string
    state: string
  }
  qq: {
    appId: string
    scope: string
    state: string
  }
  weibo: {
    appId: string
    scope: string
    state: string
  }
}