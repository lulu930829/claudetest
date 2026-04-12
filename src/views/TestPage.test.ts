import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TestPage from './TestPage.vue'

describe('TestPage', () => {
  it('正确渲染组件', () => {
    const wrapper = mount(TestPage)
    expect(wrapper.exists()).toBe(true)
  })

  it('包含必要的元素', () => {
    const wrapper = mount(TestPage)
    // 根据需要添加更多断言
    expect(wrapper.element).toBeDefined()
  })
})
