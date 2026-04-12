# 代码风格规则

本项目遵循统一的代码风格规范，确保代码可读性和一致性。

## 基础规范

### 文件命名

- **Vue组件**: PascalCase，如 `ProductCard.vue`
- **TypeScript文件**: camelCase，如 `userStore.ts`
- **测试文件**: 与源文件同名 + `.test.ts`，如 `userStore.test.ts`
- **工具文件**: 描述性名称，如 `format-price.ts`

### 目录结构

- `src/components/` - 可复用组件
- `src/views/` - 页面组件
- `src/stores/` - Pinia状态存储
- `src/api/` - API模块
- `src/types/` - TypeScript类型定义

## TypeScript规范

### 类型定义

- 优先使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型、交叉类型
- 避免使用 `any`，使用 `unknown` 或具体类型
- 导出必要的类型定义

### 变量和函数

- 使用 `const` 声明常量
- 使用 `let` 声明变量（避免 `var`）
- 函数使用箭头函数语法
- 明确函数返回值类型

### 示例

```typescript
// 良好
interface User {
  id: string
  name: string
  email?: string
}

const fetchUser = async (id: string): Promise<User> => {
  // 实现
}

// 避免
const fetchUser = async id => {
  // 缺少类型
}
```

## Vue 3规范

### 组件结构

1. `<template>` - 模板部分
2. `<script setup>` - 逻辑部分
3. `<style>` - 样式部分

### Composition API

- 使用 `ref` 定义响应式数据
- 使用 `computed` 定义计算属性
- 使用 `watch` 监听变化
- 使用自定义组合式函数封装可复用逻辑

### 组件通信

- 使用 `defineProps` 定义props
- 使用 `defineEmits` 定义事件
- 使用 `provide/inject` 跨组件通信（谨慎使用）

### 示例

```vue
<script setup lang="ts">
  import { ref, computed } from 'vue'

  interface Props {
    title: string
    count?: number
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    (e: 'update:count', value: number): void
  }>()

  const internalCount = ref(props.count || 0)
  const doubledCount = computed(() => internalCount.value * 2)
</script>
```

## 样式规范

### SCSS规范

- 使用嵌套不超过3层
- 使用变量定义颜色、间距等
- 使用mixin封装重复样式
- 遵循BEM命名规范（可选）

### 响应式设计

- 使用Vant提供的响应式工具
- 移动端优先设计
- 测试不同屏幕尺寸

## 代码格式化

### Prettier配置

```json
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "printWidth": 100
}
```

### ESLint规则

- Vue 3推荐规则
- TypeScript严格模式
- 代码质量检查

## 提交前检查

1. 运行 `npm run lint` 检查代码规范
2. 运行 `npm run format` 格式化代码
3. 运行 `npm run type-check` 类型检查
4. 运行 `npm test` 确保测试通过
