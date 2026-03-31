import request from '@/api/request'
import type {
  LoginParams,
  RegisterParams,
  SocialLoginParams,
  UpdateUserParams,
  UserInfo,
  AddressInfo,
  CreateAddressParams,
  UpdateAddressParams
} from '@/types/user'

// 用户API
export const userApi = {
  // 登录
  login(params: LoginParams) {
    return request.post<{ token: string; userInfo: UserInfo }>('/user/login', params, {
      showError: true,
    })
  },

  // 注册
  register(params: RegisterParams) {
    return request.post<{ token: string; userInfo: UserInfo }>('/user/register', params, {
      showError: true,
    })
  },

  // 第三方登录
  socialLogin(params: SocialLoginParams) {
    return request.post<{ token: string; userInfo: UserInfo }>('/user/social-login', params)
  },

  // 获取用户信息
  getUserInfo() {
    return request.get<UserInfo>('/user/info')
  },

  // 更新用户信息
  updateUserInfo(params: UpdateUserParams) {
    return request.put<UserInfo>('/user/info', params)
  },

  // 修改密码
  changePassword(oldPassword: string, newPassword: string) {
    return request.put('/user/password', { oldPassword, newPassword })
  },

  // 退出登录
  logout() {
    return request.post('/user/logout')
  },

  // 发送短信验证码
  sendSmsCode(phone: string, type: 'login' | 'register' | 'reset') {
    return request.post('/user/sms-code', { phone, type })
  },

  // 验证短信验证码
  verifySmsCode(phone: string, code: string, type: 'login' | 'register' | 'reset') {
    return request.post('/user/verify-sms', { phone, code, type })
  },
}

// 地址API
export const addressApi = {
  // 获取地址列表
  getAddressList() {
    return request.get<AddressInfo[]>('/user/address')
  },

  // 获取地址详情
  getAddressDetail(id: string) {
    return request.get<AddressInfo>(`/user/address/${id}`)
  },

  // 创建地址
  createAddress(params: CreateAddressParams) {
    return request.post<AddressInfo>('/user/address', params)
  },

  // 更新地址
  updateAddress(params: UpdateAddressParams) {
    return request.put<AddressInfo>(`/user/address/${params.id}`, params)
  },

  // 删除地址
  deleteAddress(id: string) {
    return request.delete(`/user/address/${id}`)
  },

  // 设置默认地址
  setDefaultAddress(id: string) {
    return request.put(`/user/address/${id}/default`)
  },
}

// 第三方登录配置
export const socialApi = {
  // 获取第三方登录配置
  getSocialConfig() {
    return request.get<{
      wechat: { appId: string; scope: string }
      qq: { appId: string; scope: string }
      weibo: { appId: string; scope: string }
    }>('/social/config')
  },

  // 获取第三方登录URL
  getSocialLoginUrl(provider: 'wechat' | 'qq' | 'weibo', redirectUri: string) {
    return request.get<string>(`/social/${provider}/login-url`, {
      params: { redirectUri },
    })
  },
}

export default {
  user: userApi,
  address: addressApi,
  social: socialApi,
}