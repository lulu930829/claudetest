// 商品相关类型定义

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  categoryId: string
  categoryName?: string
  brand?: string
  stock: number
  sales: number
  tags?: string[]
  skus?: ProductSku[]
  specs?: ProductSpec[]
  details?: string // 商品详情HTML
  isHot?: boolean
  isNew?: boolean
  isRecommend?: boolean
  status: 'onSale' | 'offSale' | 'soldOut'
  createTime: string
  updateTime?: string
}

export interface ProductSku {
  id: string
  productId: string
  skuCode: string
  price: number
  originalPrice?: number
  stock: number
  sales?: number
  image?: string
  specs: SkuSpec[] // 规格值组合
}

export interface ProductSpec {
  id: string
  name: string // 规格名，如"颜色"
  values: SpecValue[] // 规格值列表
}

export interface SpecValue {
  id: string
  name: string // 规格值，如"红色"
  image?: string // 规格图片
}

export interface SkuSpec {
  specId: string
  specName: string
  valueId: string
  valueName: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  sku: Record<string, any> // 规格信息
  checked: boolean
  product?: Product // 关联的商品信息
}

export interface Category {
  id: string
  name: string
  icon?: string
  image?: string
  parentId?: string
  level: number
  sort: number
  status: 'enabled' | 'disabled'
  children?: Category[]
}

export interface Brand {
  id: string
  name: string
  logo?: string
  description?: string
  sort: number
  status: 'enabled' | 'disabled'
}

export interface ProductFilter {
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  keyword?: string
  tags?: string[]
  sortBy?: 'price' | 'sales' | 'createTime'
  sortOrder?: 'asc' | 'desc'
  page: number
  pageSize: number
}

export interface ProductListResponse {
  items: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 商品评价
export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number // 1-5
  content?: string
  images?: string[]
  createTime: string
  skuInfo?: string // 购买的商品规格
}

// 商品收藏
export interface ProductFavorite {
  id: string
  productId: string
  userId: string
  createTime: string
  product?: Product
}