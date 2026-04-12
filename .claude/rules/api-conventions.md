# API 约定

本项目使用Axios进行HTTP请求，遵循统一的API设计和错误处理规范。

## 目录结构

```
src/api/
├── request.ts           # Axios实例配置
├── types/              # API相关类型定义
│   └── api.ts
└── modules/            # 按模块组织的API
    ├── user.ts         # 用户相关API
    ├── product.ts      # 商品相关API
    ├── order.ts        # 订单相关API
    └── cart.ts         # 购物车相关API
```

## Axios实例配置

### 基础配置

```typescript
// src/api/request.ts
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 请求拦截器

```typescript
request.interceptors.request.use(
  config => {
    // 添加认证token
    const token = localStorage.getItem('user_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)
```

### 响应拦截器

```typescript
request.interceptors.response.use(
  response => response.data,
  error => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 未授权处理
      localStorage.removeItem('user_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## API模块设计

### 模块文件结构

```typescript
// src/api/modules/user.ts
import { request } from '../request'
import type { LoginParams, UserInfo, ApiResponse } from '../types/api'

export const userApi = {
  // 登录
  login(params: LoginParams): Promise<ApiResponse<{ token: string; user: UserInfo }>> {
    return request.post('/auth/login', params)
  },

  // 获取用户信息
  getUserInfo(): Promise<ApiResponse<UserInfo>> {
    return request.get('/user/info')
  },

  // 更新用户信息
  updateUserInfo(info: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
    return request.put('/user/info', info)
  },
}
```

### 类型定义

```typescript
// src/api/types/api.ts
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 分页参数
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

## 请求方法约定

### CRUD操作

```typescript
// 创建
POST /resources
// 读取（列表）
GET /resources
// 读取（单个）
GET /resources/:id
// 更新
PUT /resources/:id
// 删除
DELETE /resources/:id
```

### 分页查询

```typescript
// 查询参数
GET /products?page=1&pageSize=20&sortBy=price&sortOrder=desc

// 响应格式
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### 批量操作

```typescript
// 批量删除
DELETE /products/batch
Body: { ids: ['id1', 'id2'] }

// 批量更新
PUT /products/batch
Body: { ids: ['id1', 'id2'], data: { status: 'active' } }
```

## 错误处理

### 错误码约定

- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器内部错误

### 错误响应格式

```typescript
{
  "code": 400,
  "message": "参数验证失败",
  "data": {
    "field": "email",
    "reason": "邮箱格式不正确"
  },
  "success": false
}
```

### 前端错误处理

```typescript
try {
  const response = await userApi.login(params)
  if (response.success) {
    // 处理成功
  } else {
    // 处理业务错误
    showToast(response.message)
  }
} catch (error) {
  // 处理网络错误或服务器错误
  console.error('API调用失败:', error)
  showToast('网络异常，请重试')
}
```

## 状态码处理

### 成功状态 (2xx)

- `200`: 标准成功响应
- `201`: 创建成功
- `204`: 无内容（删除成功）

### 客户端错误 (4xx)

- `400`: 验证用户输入
- `401`: 跳转登录页面
- `403`: 显示权限不足提示
- `404`: 显示404页面或提示
- `429`: 请求过于频繁，提示用户等待

### 服务器错误 (5xx)

- `500`: 显示服务器错误提示
- `502/503/504`: 显示服务不可用提示

## 请求优化

### 请求取消

```typescript
import axios from 'axios'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

request.get('/api/data', {
  cancelToken: source.token,
})

// 取消请求
source.cancel('请求已取消')
```

### 请求重试

```typescript
import axiosRetry from 'axios-retry'

axiosRetry(request, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
})
```

### 缓存策略

```typescript
const cache = new Map()

async function getWithCache(url: string, ttl: number = 60000) {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }

  const data = await request.get(url)
  cache.set(url, { data, timestamp: Date.now() })
  return data
}
```

## 安全考虑

### 敏感信息

- 不在URL中传递敏感参数
- 使用POST传递敏感数据
- 启用HTTPS

### 防CSRF

- 使用CSRF token
- 验证请求来源
- 设置合适的CORS策略

### 速率限制

- 实现请求频率限制
- 避免重复请求
- 使用防抖和节流

## 测试

### API Mock

```typescript
// tests/setup.ts
import { vi } from 'vitest'

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}))
```

### API测试示例

```typescript
import { describe, it, expect, vi } from 'vitest'
import { userApi } from '@/api/modules/user'

describe('userApi', () => {
  it('login success', async () => {
    const mockResponse = {
      code: 200,
      message: 'success',
      data: { token: 'test-token', user: { id: '1', name: 'test' } },
      success: true,
    }

    // Mock axios请求
    vi.mocked(request.post).mockResolvedValue(mockResponse)

    const result = await userApi.login({ username: 'test', password: '123456' })
    expect(result).toEqual(mockResponse)
  })
})
```
