import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

// 响应数据格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  timestamp: number
}

// 扩展AxiosRequestConfig
declare module 'axios' {
  interface AxiosRequestConfig {
    // 是否显示加载提示
    showLoading?: boolean
    // 是否显示错误提示
    showError?: boolean
    // 是否跳过token验证
    skipAuth?: boolean
    // 重试次数
    retry?: number
    // 重试延迟（毫秒）
    retryDelay?: number
  }
}

class Request {
  private instance: AxiosInstance
  private loadingCount = 0

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.setupInterceptors()
  }

  // 获取axios实例
  public getInstance(): AxiosInstance {
    return this.instance
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 显示加载提示
        if (config.showLoading !== false) {
          this.showLoading()
        }

        // 添加token
        if (!config.skipAuth) {
          const userStore = useUserStore()
          const token = userStore.token
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }

        // 设置超时时间
        config.timeout = config.timeout || 30000

        return config
      },
      (error) => {
        this.hideLoading()
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        this.hideLoading()

        const { data, config } = response
        const { code, message, success } = data

        // 业务逻辑错误处理
        if (!success) {
          // 需要显示错误提示
          if (config.showError !== false) {
            showToast(message || '请求失败')
          }

          // token过期或无效
          if (code === 401) {
            const userStore = useUserStore()
            userStore.logout()
            // 跳转到登录页
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`
            return Promise.reject(new Error('登录已过期，请重新登录'))
          }

          // 其他业务错误
          return Promise.reject(new Error(message || '请求失败'))
        }

        return data.data
      },
      (error) => {
        this.hideLoading()

        const config = error.config || {}

        // 显示错误提示
        if (config.showError !== false) {
          let errorMessage = '网络错误，请稍后重试'

          if (error.response) {
            switch (error.response.status) {
              case 400:
                errorMessage = '请求参数错误'
                break
              case 401:
                errorMessage = '登录已过期，请重新登录'
                break
              case 403:
                errorMessage = '没有权限访问'
                break
              case 404:
                errorMessage = '请求的资源不存在'
                break
              case 500:
                errorMessage = '服务器内部错误'
                break
              case 502:
              case 503:
              case 504:
                errorMessage = '服务暂时不可用，请稍后重试'
                break
            }
          } else if (error.request) {
            errorMessage = '网络连接失败，请检查网络'
          } else {
            errorMessage = error.message || '请求失败'
          }

          showToast(errorMessage)
        }

        // 重试逻辑
        if (config.retry && config.retry > 0) {
          config.__retryCount = config.__retryCount || 0
          if (config.__retryCount < config.retry) {
            config.__retryCount++
            const delay = config.retryDelay || 1000
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(this.instance(config))
              }, delay)
            })
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // 显示加载提示
  private showLoading() {
    this.loadingCount++
    if (this.loadingCount === 1) {
      // 这里可以显示全局加载状态
      // 例如使用store设置loading状态
    }
  }

  // 隐藏加载提示
  private hideLoading() {
    this.loadingCount = Math.max(0, this.loadingCount - 1)
    if (this.loadingCount === 0) {
      // 这里可以隐藏全局加载状态
    }
  }

  // 通用请求方法
  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }
}

// 创建请求实例
const request = new Request({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

export default request.getInstance()

// 导出Request类和实例
export { Request, request }