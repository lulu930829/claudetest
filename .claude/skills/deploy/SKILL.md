# 部署技能

自动化项目部署流程，支持多环境、多阶段的部署策略。

## 技能描述

自动化执行构建、测试、部署流程，确保部署的质量和可靠性。

## 触发条件

- 手动命令 `/project:deploy`
- PR合并到特定分支
- 定时部署任务
- 紧急修复部署

## 部署环境

### 开发环境 (development)

- **目标**: 快速验证新功能
- **分支**: `develop` 或 `feature/*`
- **流程**: 自动构建 + 部署
- **验证**: 基本功能测试
- **回滚**: 自动回滚机制

### 预发布环境 (staging)

- **目标**: 集成测试和验收
- **分支**: `staging` 或 `release/*`
- **流程**: 构建 + 人工验证
- **验证**: 完整测试套件
- **审批**: 需要人工确认

### 生产环境 (production)

- **目标**: 正式发布
- **分支**: `main` 或 `master`
- **流程**: 分阶段部署 + 监控
- **验证**: 全面测试 + 监控
- **审批**: 需要多重确认

## 部署流程

### 阶段1: 前置检查

```bash
# 1.1 代码状态检查
git status --porcelain

# 1.2 分支验证
git branch --show-current

# 1.3 依赖检查
npm ci --only=production

# 1.4 环境验证
node --version
npm --version
```

### 阶段2: 质量保证

```bash
# 2.1 代码检查
npm run lint
npm run type-check

# 2.2 测试执行
npm test
npm run test:coverage

# 2.3 安全扫描
npm audit
npx snyk test

# 2.4 构建验证
npm run build -- --dry-run
```

### 阶段3: 构建阶段

```bash
# 3.1 清理工作区
rm -rf dist/ coverage/

# 3.2 安装依赖
npm ci

# 3.3 运行测试
npm run test:coverage

# 3.4 生产构建
npm run build

# 3.5 生成构建报告
npx bundlesize
```

### 阶段4: 部署准备

```bash
# 4.1 版本标记
npm version patch --no-git-tag-version

# 4.2 生成变更日志
npx conventional-changelog -p angular -i CHANGELOG.md -s

# 4.3 创建部署包
tar -czf deploy-$(date +%Y%m%d-%H%M%S).tar.gz dist/

# 4.4 备份当前版本
backup-current-version.sh
```

### 阶段5: 部署执行

```bash
# 5.1 停止当前服务
pm2 stop mall-app || true

# 5.2 部署新版本
rsync -avz dist/ user@server:/var/www/mall-app/

# 5.3 安装生产依赖
cd /var/www/mall-app && npm ci --only=production

# 5.4 启动服务
pm2 start ecosystem.config.js

# 5.5 健康检查
curl -f http://localhost:3000/health || exit 1
```

### 阶段6: 后置验证

```bash
# 6.1 服务状态检查
pm2 status

# 6.2 功能验证
npx playwright test --project=smoke

# 6.3 性能测试
npx lighthouse http://localhost:3000 --output=json

# 6.4 监控配置
configure-monitoring.sh
```

## 部署策略

### 蓝绿部署

```yaml
strategy: blue-green
steps:
  - deploy-green: 部署到绿色环境
  - health-check: 健康检查
  - switch-traffic: 切换流量
  - monitor: 监控指标
  - cleanup-blue: 清理蓝色环境
```

### 金丝雀发布

```yaml
strategy: canary
steps:
  - deploy-canary: 部署金丝雀版本
  - route-percentage: 路由5%流量
  - monitor-metrics: 监控关键指标
  - increase-traffic: 逐步增加流量
  - full-release: 全量发布
```

### 滚动更新

```yaml
strategy: rolling
steps:
  - batch-1: 更新第一批实例
  - health-check-1: 健康检查
  - batch-2: 更新第二批实例
  - health-check-2: 健康检查
  - complete: 完成更新
```

## 配置管理

### 环境配置

```json
{
  "development": {
    "apiBaseUrl": "http://localhost:8080",
    "enableDebug": true,
    "logLevel": "debug"
  },
  "staging": {
    "apiBaseUrl": "https://api.staging.example.com",
    "enableDebug": false,
    "logLevel": "info"
  },
  "production": {
    "apiBaseUrl": "https://api.example.com",
    "enableDebug": false,
    "logLevel": "warn"
  }
}
```

### 部署配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'mall-app',
      script: 'npm',
      args: 'run preview',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
```

## 错误处理

### 部署失败处理

```bash
# 检测失败
if [ $? -ne 0 ]; then
  echo "部署失败，执行回滚"
  rollback-deployment.sh
  send-alert.sh "部署失败"
  exit 1
fi
```

### 健康检查失败

```bash
# 重试机制
MAX_RETRIES=3
RETRY_DELAY=5

for i in $(seq 1 $MAX_RETRIES); do
  if curl -f http://localhost:3000/health; then
    echo "健康检查通过"
    break
  fi
  sleep $RETRY_DELAY
done
```

### 自动回滚

```bash
# 回滚脚本
rollback-deployment.sh() {
  echo "执行回滚..."
  pm2 stop mall-app
  restore-backup.sh
  pm2 start mall-app
  echo "回滚完成"
}
```

## 监控和告警

### 部署监控

```yaml
monitoring:
  metrics:
    - deployment_duration
    - build_success_rate
    - rollback_count
    - error_rate_5min
  alerts:
    - deployment_failed
    - health_check_failed
    - performance_degradation
```

### 日志收集

```bash
# 部署日志
log-deployment.sh() {
  echo "$(date): 开始部署 $VERSION" >> /var/log/deployments.log
  # ... 部署过程
  echo "$(date): 部署完成 $VERSION" >> /var/log/deployments.log
}
```

## 权限控制

### 部署权限

```json
{
  "development": {
    "requireApproval": false,
    "allowedUsers": ["developers"],
    "autoDeploy": true
  },
  "staging": {
    "requireApproval": true,
    "allowedUsers": ["qa", "developers"],
    "autoDeploy": false
  },
  "production": {
    "requireApproval": true,
    "allowedUsers": ["devops", "managers"],
    "requireReview": true
  }
}
```

## 报告和通知

### 部署报告

```markdown
# 部署报告: v1.2.3

环境: production
时间: 2026-04-06 14:30:00
持续时间: 8分32秒
状态: ✅ 成功

关键指标:

- 构建时间: 2分15秒
- 测试通过率: 100%
- 覆盖率: 85%
- 包大小: 1.2MB

更改内容:

- 新增用户个人中心页面
- 修复购物车数量更新问题
- 优化图片加载性能

监控链接: https://grafana.example.com/dashboard/deployments
```

### 通知渠道

- Slack: 部署状态通知
- Email: 部署报告
- SMS: 关键警报
- Dashboard: 实时状态

## 最佳实践

### 部署清单

- [ ] 代码审查完成
- [ ] 测试全部通过
- [ ] 安全扫描通过
- [ ] 性能基准测试
- [ ] 回滚计划准备
- [ ] 团队通知发送
- [ ] 监控配置就绪

### 优化建议

1. **增量部署**: 只部署变更的文件
2. **并行构建**: 多阶段并行执行
3. **缓存优化**: 复用构建缓存
4. **镜像构建**: 使用Docker镜像
5. **基础设施即代码**: 自动化环境配置
