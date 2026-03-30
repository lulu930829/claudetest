# 商城App - 前端项目

基于 Vue 3 构建的现代电商平台前端应用，提供完整的购物体验。

## 📋 项目概述

这是一个使用 Vue 3 开发的商城应用前端项目，包含用户认证、商品浏览、购物车、订单管理等核心电商功能。项目采用现代化的前端技术栈，注重性能、用户体验和代码质量。

## 🚀 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5.x
- **语言**: TypeScript 5.x
- **UI 组件库**: Element Plus 或 Vant (可根据需求选择)
- **状态管理**: Pinia 2.x
- **路由管理**: Vue Router 4.x
- **HTTP 客户端**: Axios
- **样式方案**: Sass/SCSS + CSS Modules
- **代码规范**: ESLint + Prettier
- **Git 钩子**: Husky + lint-staged

## ✨ 功能特性

### 🛒 商品模块
- 商品列表展示（分类、排序、筛选）
- 商品详情页（图片轮播、规格选择、评价查看）
- 商品搜索（关键字搜索、联想搜索）
- 商品收藏与分享

### 🛍️ 购物流程
- 购物车管理（增删改查、数量调整）
- 多种结算方式（在线支付、货到付款）
- 收货地址管理（增删改查、默认地址设置）
- 订单管理（下单、支付、取消、退款）

### 👤 用户中心
- 用户注册/登录（手机号、微信、QQ）
- 个人信息管理（头像、昵称、密码修改）
- 我的订单（全部、待付款、待发货、待收货、已完成）
- 我的收藏、浏览历史、优惠券

### 🎯 其他功能
- 首页个性化推荐
- 促销活动专区（限时抢购、团购）
- 消息通知（系统通知、订单状态）
- 多端适配（PC、移动端响应式）

## 📁 项目结构

```
src/
├── api/                    # API 接口封装
│   ├── modules/           # 模块化接口
│   └── request.ts         # Axios 配置
├── assets/                # 静态资源
│   ├── images/           # 图片资源
│   ├── styles/           # 全局样式
│   └── fonts/            # 字体文件
├── components/            # 公共组件
│   ├── common/           # 通用组件
│   ├── business/         # 业务组件
│   └── layout/           # 布局组件
├── composables/           # 组合式函数
│   ├── useCart.ts        # 购物车逻辑
│   ├── useUser.ts        # 用户逻辑
│   └── useProduct.ts     # 商品逻辑
├── router/                # 路由配置
│   └── index.ts          # 路由定义
├── stores/                # Pinia 状态管理
│   ├── cart.ts           # 购物车状态
│   ├── user.ts           # 用户状态
│   └── product.ts        # 商品状态
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数
├── views/                 # 页面组件
│   ├── Home/             # 首页
│   ├── Product/          # 商品相关页面
│   ├── Cart/             # 购物车页面
│   ├── Order/            # 订单相关页面
│   └── User/             # 用户中心页面
├── App.vue                # 根组件
└── main.ts                # 应用入口
```

## 🛠️ 环境要求

- Node.js >= 18.x
- npm >= 9.x 或 yarn >= 1.22.x 或 pnpm >= 8.x

## 📦 安装与运行

### 1. 克隆项目
```bash
git clone <repository-url>
cd mall-app-frontend
```

### 2. 安装依赖
```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install
```

### 3. 环境配置
复制环境变量示例文件并配置：
```bash
cp .env.example .env
```
编辑 `.env` 文件，配置 API 地址等环境变量。

### 4. 启动开发服务器
```bash
# 开发环境
npm run dev

# 或指定端口
npm run dev -- --port 3000
```

### 5. 构建生产版本
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📝 脚本说明

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行代码检查
- `npm run lint:fix` - 自动修复代码格式问题
- `npm run type-check` - 运行 TypeScript 类型检查
- `npm run test` - 运行单元测试
- `npm run test:e2e` - 运行端到端测试

## 🔧 配置说明

### 环境变量
项目支持以下环境变量：
- `VITE_API_BASE_URL` - API 基础地址
- `VITE_APP_TITLE` - 应用标题
- `VITE_UPLOAD_URL` - 文件上传地址
- `VITE_WEBSOCKET_URL` - WebSocket 地址

### Vite 配置
Vite 配置文件位于 `vite.config.ts`，可配置：
- 代理设置（解决跨域）
- 别名路径（@ -> src）
- 构建优化选项
- 插件配置

## 🧪 测试

### 单元测试
使用 Vitest + Vue Test Utils 进行单元测试：
```bash
npm run test
```

### 端到端测试
使用 Cypress 进行端到端测试：
```bash
npm run test:e2e
```

## 📱 多端适配

项目采用响应式设计，支持：
- **PC 端**: 屏幕宽度 >= 1200px
- **平板端**: 屏幕宽度 768px ~ 1199px
- **移动端**: 屏幕宽度 < 768px

使用 CSS Media Queries 和 Flexbox/Grid 布局实现自适应。

## 🚢 部署

### 静态文件部署
构建后的文件位于 `dist` 目录，可部署到：
- Nginx / Apache
- 云存储（阿里云 OSS、腾讯云 COS）
- GitHub Pages / Vercel / Netlify

### Docker 部署
提供 Dockerfile 和 docker-compose.yml 支持容器化部署：
```bash
# 构建镜像
docker build -t mall-app-frontend .

# 运行容器
docker run -p 80:80 mall-app-frontend
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 ESLint + Prettier 统一代码风格
- 遵循 Vue 3 官方风格指南
- 提交前运行 `npm run lint` 检查代码

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目维护者: [你的名字]
- 邮箱: [你的邮箱]
- 问题反馈: [GitHub Issues](<repository-url>/issues)

## 🙏 致谢

- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端工具
- [Element Plus](https://element-plus.org/) / [Vant](https://vant-ui.github.io/vant/) - UI 组件库
- 所有为本项目贡献代码的开发者

---

**Happy Coding!** 🚀