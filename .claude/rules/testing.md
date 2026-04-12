# 测试规则

本项目使用Vitest进行测试，确保代码质量和功能稳定性。

## 测试框架

### 配置

- **测试框架**: Vitest 4.x
- **测试环境**: jsdom（模拟浏览器环境）
- **UI测试**: @vue/test-utils
- **覆盖率**: @vitest/coverage-v8

### 测试目录结构

```
tests/
├── setup.ts              # 测试环境配置
└── [可选] e2e/          # E2E测试
src/
├── component.vue
├── component.test.ts    # 组件测试
├── store.ts
└── store.test.ts       # Store测试
```

## 测试类型

### 单元测试

- **范围**: 单个函数、组件、Store
- **目标**: 验证独立单元的正确性
- **工具**: Vitest + test-utils

### 组件测试

- **范围**: Vue组件
- **目标**: 验证组件渲染和交互
- **工具**: test-utils + jsdom

### 集成测试

- **范围**: 多个单元的组合
- **目标**: 验证模块间协作
- **工具**: Vitest + 模拟

## 测试编写规范

### 测试文件命名

- 与源文件同名 + `.test.ts`
- 如 `userStore.ts` → `userStore.test.ts`
- Vue组件测试放在单独文件

### 测试结构

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from './user'

describe('user store', () => {
  // 测试套件描述
  beforeEach(() => {
    // 每个测试前的设置
  })

  it('should do something', () => {
    // 测试用例
    expect(result).toBe(expected)
  })

  describe('nested suite', () => {
    // 嵌套测试套件
  })
})
```

### 测试用例命名

- 使用描述性名称
- 遵循 "should ... when ..." 模式
- 避免使用 "test" 开头

### 断言风格

- 使用 `expect()` 语法
- 优先使用具体匹配器
- 避免模糊断言

## 组件测试规范

### 组件导入

```typescript
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'
```

### 渲染测试

```typescript
it('renders correctly', () => {
  const wrapper = mount(MyComponent, {
    props: { title: 'Test' },
  })
  expect(wrapper.text()).toContain('Test')
})
```

### 交互测试

```typescript
it('emits event on click', async () => {
  const wrapper = mount(MyComponent)
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted('click')).toHaveLength(1)
})
```

### 异步测试

```typescript
it('handles async operation', async () => {
  const result = await someAsyncFunction()
  expect(result).toBeDefined()
})
```

## Store测试规范

### Store初始化

```typescript
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})
```

### 状态测试

```typescript
it('has initial state', () => {
  const store = useUserStore()
  expect(store.token).toBe('')
  expect(store.userInfo).toBeNull()
})
```

### 方法测试

```typescript
it('login updates state', async () => {
  const store = useUserStore()
  await store.login({ username: 'test' })
  expect(store.isAuthenticated).toBe(true)
  expect(store.userInfo).toBeDefined()
})
```

## 模拟和桩

### API模拟

```typescript
import { vi } from 'vitest'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
  },
}))
```

### 全局模拟

在 `tests/setup.ts` 中配置全局模拟：

- Vue Router
- localStorage
- window.location
- Vant组件

## 覆盖率要求

### 最低覆盖率

- **语句覆盖率**: 80%
- **分支覆盖率**: 70%
- **函数覆盖率**: 80%
- **行覆盖率**: 80%

### 覆盖率排除

- 第三方库代码
- 类型定义文件
- 配置文件
- 生成的代码

## 测试运行

### 开发时运行

```bash
npm test                   # 运行所有测试
npm test -- --run         # 运行测试（不监听）
npm run test:coverage     # 运行覆盖率测试
npm run test:ui           # 打开测试UI
```

### CI/CD集成

- 每次提交运行测试
- PR合并前要求测试通过
- 覆盖率报告作为合并条件

## 最佳实践

### 测试设计

1. **独立性**: 测试之间不依赖
2. **确定性**: 相同输入产生相同结果
3. **快速**: 测试运行速度快
4. **完整**: 覆盖主要路径和边界情况

### 避免常见问题

- 过度模拟
- 测试实现细节
- 忽略异步测试
- 不清理测试数据
