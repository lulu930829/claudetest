import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App', () => {
  it('正确渲染组件', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('包含必要的元素', () => {
    const wrapper = mount(App)
    // 根据需要添加更多断言
    expect(wrapper.element).toBeDefined()
  })
})
