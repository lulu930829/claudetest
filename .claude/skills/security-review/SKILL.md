# 安全审查技能

自动执行代码安全审查，识别潜在的安全漏洞和风险。

## 技能描述

自动扫描项目代码，检查安全最佳实践、识别潜在漏洞、提供修复建议。

## 触发条件

- 代码提交前
- PR审查时
- 手动触发 `/project:review --security`
- 定期自动扫描

## 检查范围

### 1. 依赖安全

- 检查已知漏洞依赖 (npm audit)
- 验证依赖版本安全性
- 检查许可证合规性

### 2. 代码安全

- XSS漏洞检查
- SQL注入风险
- 命令注入风险
- 路径遍历漏洞
- 不安全的反序列化

### 3. 身份验证和授权

- 硬编码凭证检查
- 不安全的会话管理
- 权限绕过风险
- JWT安全配置

### 4. 数据安全

- 敏感信息泄露（API密钥、密码等）
- 不安全的存储
- 缺乏数据验证
- 日志中的敏感信息

### 5. 配置安全

- 不安全的环境配置
- CORS配置错误
- 缺少安全头部
- 调试模式启用

### 6. 前端安全

- DOM型XSS
- CSP配置
- 点击劫持防护
- 混合内容检查

## 检查工具

### 自动化工具

```bash
# 依赖安全检查
npm audit
npx snyk test

# 代码安全检查
npx eslint-plugin-security
npx nodejsscan

# 敏感信息检查
npx detect-secrets
npx trufflehog
```

### 自定义检查规则

```javascript
// 安全检查规则示例
const securityRules = {
  'no-eval': '禁止使用eval()',
  'no-inner-html': '谨慎使用innerHTML',
  'secure-random': '使用安全的随机数生成器',
  'https-only': '生产环境强制HTTPS',
}
```

## 检查流程

### 1. 准备阶段

- 收集项目信息
- 分析技术栈
- 确定检查重点

### 2. 扫描阶段

- 运行自动化工具
- 执行自定义检查
- 收集扫描结果

### 3. 分析阶段

- 评估风险等级
- 验证漏洞真实性
- 确定修复优先级

### 4. 报告阶段

- 生成安全报告
- 提供修复建议
- 建议预防措施

## 风险等级

### 高风险（立即修复）

- 远程代码执行漏洞
- 身份验证绕过
- 敏感数据泄露
- SQL注入

### 中风险（计划修复）

- XSS漏洞
- CSRF保护缺失
- 不安全的直接对象引用
- 安全配置错误

### 低风险（建议改进）

- 信息泄露风险
- 缺少安全头部
- 不安全的依赖版本
- 日志记录不足

## 修复建议

### 立即措施

```javascript
// 不安全示例
localStorage.setItem('token', userToken)

// 安全改进
// 1. 使用HttpOnly cookies
// 2. 实现适当的会话管理
// 3. 添加令牌刷新机制
```

### 架构改进

- 实现输入验证层
- 添加输出编码
- 实施最小权限原则
- 启用安全日志

### 配置优化

```javascript
// 安全配置示例
const securityConfig = {
  cors: {
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  },
  headers: {
    'Content-Security-Policy': "default-src 'self'",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
  },
}
```

## 报告格式

### 摘要报告

```
安全审查报告
============
项目: mall-app-frontend
时间: 2026-04-06
扫描文件: 42
发现问题: 8

风险分布:
- 高风险: 1
- 中风险: 3
- 低风险: 4
```

### 详细报告

```markdown
## 高风险问题

### 问题1: 硬编码API密钥

**文件**: `src/api/request.ts:23`
**风险**: 敏感信息泄露
**修复建议**: 使用环境变量
**代码**: `const API_KEY = 'sk_live_123456'`

## 中风险问题

### 问题2: 缺少输入验证

**文件**: `src/views/User/RegisterPage.vue:45`
**风险**: SQL注入/XSS
**修复建议**: 添加输入验证和输出编码
```

## 集成方式

### Git Hooks

```bash
# pre-commit hook
npx security-review --staged

# pre-push hook
npx security-review --changed
```

### CI/CD集成

```yaml
# GitHub Actions
- name: Security Scan
  run: npx security-review
  continue-on-error: true
```

### 定期扫描

```json
// package.json
{
  "scripts": {
    "security": "security-review --full",
    "security:daily": "security-review --cron"
  }
}
```

## 自定义配置

### 忽略规则

```json
{
  "ignore": ["**/test/**", "**/node_modules/**", "特定误报规则"]
}
```

### 严重性调整

```json
{
  "severity": {
    "no-console": "low",
    "no-eval": "high"
  }
}
```

## 后续操作

### 修复验证

- 验证修复的有效性
- 重新扫描确认修复
- 更新安全基线

### 监控和预警

- 设置安全监控
- 配置实时警报
- 定期审查日志

### 团队培训

- 安全编码培训
- 最佳实践分享
- 漏洞案例学习
