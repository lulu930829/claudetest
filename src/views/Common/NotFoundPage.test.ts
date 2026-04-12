import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundPage from './NotFoundPage.vue'

describe('NotFoundPage', () => {
  it('正确渲染组件', () => {
    const wrapper = mount(NotFoundPage)
    expect(wrapper.exists()).toBe(true)
  })

  it('包含必要的元素', () => {
    const wrapper = mount(NotFoundPage)
    // 根据需要添加更多断言
    expect(wrapper.element).toBeDefined()
  })
})
