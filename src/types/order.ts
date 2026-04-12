// 订单相关类型定义

export interface OrderItem {
  id: string
  productId: string
  productName: string
  image?: string
  price: number
  quantity: number
  skuInfo?: string // 商品规格信息
  totalAmount?: number
}

export interface OrderInfo {
  id: string
  orderNo: string
  userId: string
  totalAmount: number
  discountAmount?: number
  shippingFee?: number
  actualAmount: number
  itemCount: number
  status: OrderStatus
  paymentMethod?: PaymentMethodType
  paymentTime?: string
  shippingTime?: string
  receiveTime?: string
  createTime: string
  updateTime?: string
  items: OrderItem[]
  address?: OrderAddress
  remark?: string
}

export interface OrderAddress {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  postalCode?: string
}

export type OrderStatus =
  | 'pending' // 待支付
  | 'paid' // 已支付
  | 'shipped' // 已发货
  | 'received' // 已收货
  | 'completed' // 已完成
  | 'cancelled' // 已取消
  | 'refunding' // 退款中
  | 'refunded' // 已退款

export type PaymentMethodType = 'wechat' | 'alipay' | 'balance' | 'cash'

export interface PaymentMethod {
  value: PaymentMethodType
  name: string
  icon: string
  color?: string
}

export interface PaymentResult {
  success: boolean
  message: string
  orderNo?: string
  paymentTime?: string
  transactionId?: string
  errorCode?: string
}

export interface PaymentParams {
  orderId: string
  paymentMethod: PaymentMethodType
  amount: number
  openid?: string // 微信支付需要
  buyerId?: string // 支付宝支付需要
}

// 微信支付参数
export interface WechatPaymentParams {
  appId: string
  timestamp: string
  nonceStr: string
  package: string
  signType: 'MD5' | 'HMAC-SHA256'
  paySign: string
}

// 支付宝支付参数
export interface AlipayPaymentParams {
  orderStr: string
  paymentType?: string
}

// 创建订单参数
export interface CreateOrderParams {
  items: {
    productId: string
    skuId?: string
    quantity: number
  }[]
  addressId: string
  couponId?: string
  remark?: string
}

// 订单查询参数
export interface OrderQueryParams {
  status?: OrderStatus
  page: number
  pageSize: number
  startTime?: string
  endTime?: string
  keyword?: string
}

// 订单列表响应
export interface OrderListResponse {
  items: OrderInfo[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 退款申请
export interface RefundApplyParams {
  orderId: string
  reason: string
  amount?: number
  images?: string[]
}

// 退款信息
export interface RefundInfo {
  id: string
  orderId: string
  refundNo: string
  amount: number
  reason: string
  status: 'pending' | 'processing' | 'success' | 'failed'
  createTime: string
  completeTime?: string
  transactionId?: string
}
