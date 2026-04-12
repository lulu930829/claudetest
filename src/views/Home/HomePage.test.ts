import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from './HomePage.vue'

describe('HomePage', () => {
  it('正确渲染组件', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.exists()).toBe(true)
  })

  it('包含必要的元素', () => {
    const wrapper = mount(HomePage)
    // 根据需要添加更多断言
    expect(wrapper.element).toBeDefined()
  })
})
