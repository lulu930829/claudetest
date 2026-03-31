import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types/product'
import { showToast } from 'vant'

export const useCartStore = defineStore('cart', () => {
  // 购物车商品列表
  const items = ref<CartItem[]>([])

  // 是否全选
  const allChecked = ref<boolean>(false)

  // 加载状态
  const loading = ref<boolean>(false)

  // 计算属性
  const totalCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      if (item.checked) {
        return total + (item.price * item.quantity)
      }
      return total
    }, 0)
  })

  const checkedItems = computed(() => {
    return items.value.filter(item => item.checked)
  })

  const checkedCount = computed(() => {
    return items.value.filter(item => item.checked).length
  })

  const isEmpty = computed(() => {
    return items.value.length === 0
  })

  // 初始化购物车（从本地存储）
  const initialize = () => {
    const savedCart = localStorage.getItem('cart_items')
    if (savedCart) {
      try {
        items.value = JSON.parse(savedCart)
        updateAllChecked()
      } catch (error) {
        console.error('解析购物车数据失败:', error)
        localStorage.removeItem('cart_items')
      }
    }
  }

  // 保存到本地存储
  const saveToLocalStorage = () => {
    localStorage.setItem('cart_items', JSON.stringify(items.value))
  }

  // 添加商品到购物车
  const addItem = (product: Product, quantity: number = 1, sku?: any) => {
    const existingItem = items.value.find(item =>
      item.productId === product.id &&
      JSON.stringify(item.sku) === JSON.stringify(sku)
    )

    if (existingItem) {
      // 已存在，增加数量
      existingItem.quantity += quantity
      if (existingItem.quantity > product.stock) {
        existingItem.quantity = product.stock
        showToast('库存不足')
      }
    } else {
      // 新商品
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity,
        sku: sku || {},
        checked: true,
        product
      }
      items.value.push(newItem)
    }

    saveToLocalStorage()
    showToast('添加成功')
  }

  // 更新商品数量
  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      if (quantity < 1) {
        removeItem(itemId)
        return
      }

      // 检查库存
      if (item.product && quantity > item.product.stock) {
        showToast('库存不足')
        item.quantity = item.product.stock
      } else {
        item.quantity = quantity
      }

      saveToLocalStorage()
    }
  }

  // 移除商品
  const removeItem = (itemId: string) => {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveToLocalStorage()
      showToast('移除成功')
    }
  }

  // 批量移除商品
  const removeItems = (itemIds: string[]) => {
    items.value = items.value.filter(item => !itemIds.includes(item.id))
    saveToLocalStorage()
    showToast('移除成功')
  }

  // 清空购物车
  const clearCart = () => {
    items.value = []
    saveToLocalStorage()
  }

  // 切换选中状态
  const toggleCheck = (itemId: string) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.checked = !item.checked
      updateAllChecked()
      saveToLocalStorage()
    }
  }

  // 切换全选
  const toggleAllChecked = () => {
    allChecked.value = !allChecked.value
    items.value.forEach(item => {
      item.checked = allChecked.value
    })
    saveToLocalStorage()
  }

  // 更新全选状态
  const updateAllChecked = () => {
    if (items.value.length === 0) {
      allChecked.value = false
      return
    }
    allChecked.value = items.value.every(item => item.checked)
  }

  // 获取选中的商品（用于下单）
  const getCheckedItems = () => {
    return items.value.filter(item => item.checked)
  }

  // 移除已选中的商品（下单后）
  const removeCheckedItems = () => {
    items.value = items.value.filter(item => !item.checked)
    updateAllChecked()
    saveToLocalStorage()
  }

  // 合并购物车（登录后）
  const mergeCart = (serverItems: CartItem[]) => {
    // 简单的合并策略：本地为主，服务器为辅
    const localMap = new Map(items.value.map(item => [item.productId + JSON.stringify(item.sku), item]))

    serverItems.forEach(serverItem => {
      const key = serverItem.productId + JSON.stringify(serverItem.sku)
      if (!localMap.has(key)) {
        items.value.push(serverItem)
      }
    })

    saveToLocalStorage()
  }

  return {
    // 状态
    items,
    allChecked,
    loading,

    // 计算属性
    totalCount,
    totalPrice,
    checkedItems,
    checkedCount,
    isEmpty,

    // 方法
    initialize,
    addItem,
    updateQuantity,
    removeItem,
    removeItems,
    clearCart,
    toggleCheck,
    toggleAllChecked,
    getCheckedItems,
    removeCheckedItems,
    mergeCart,
  }
})