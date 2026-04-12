import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterPage from './RegisterPage.vue'

describe('RegisterPage', () => {
  it('正确渲染组件', () => {
    const wrapper = mount(RegisterPage)
    expect(wrapper.exists()).toBe(true)
  })

  it('包含必要的元素', () => {
    const wrapper = mount(RegisterPage)
    // 根据需要添加更多断言
    expect(wrapper.element).toBeDefined()
  })
})
