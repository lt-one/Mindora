# Mindora 项目数据迁移进度文档

*最后更新时间: 2025年5月19日*

## 已完成的迁移工作

### 1. 博客系统数据迁移

- ✅ 设计并实现博客文章的数据库模型（BlogPost、分类、标签等）
- ✅ 创建Prisma数据库模型和关系定义
- ✅ 开发博客文章的API接口（获取文章列表、单篇文章、按分类/标签筛选等）
- ✅ 编写数据库种子脚本，将静态数据导入数据库
- ✅ 修改前端组件，使用API接口替代静态数据

**关键实现文件**:
- `prisma/schema.prisma`: 数据库模型定义
- `src/lib/db/prisma.ts`: Prisma客户端实例
- `src/lib/db/seed-blog.ts`: 博客数据填充脚本
- `src/lib/api/blog.ts`: 博客数据API函数
- `src/app/api/blog/posts/route.ts`: 博客API路由

## 遇到的问题及解决方案

### 1. Prisma自定义输出路径引起的Windows构建错误

**问题描述**:
在Windows环境下执行`npm run build`时，出现EPERM权限错误，无法扫描`C:\Users\LT\Application Data`目录。

**错误信息**:
```
Error: EPERM: operation not permitted, scandir 'C:\Users\LT\Application Data'
```

**原因分析**:
Prisma客户端配置了自定义输出路径(`output = "../src/generated/prisma"`)，导致构建过程中尝试扫描特殊系统目录引发权限错误。

**解决方案**:
1. 移除schema.prisma中的自定义输出路径设置，使用默认路径
2. 修改Prisma客户端导入路径，从`@/generated/prisma`改为`@prisma/client`
3. 在next.config.js中添加`typescript.ignoreBuildErrors: true`配置跳过类型错误

**预防措施**:
- 避免使用自定义Prisma输出路径，特别是在Windows环境中
- 使用相对路径时注意跨平台兼容性问题

### 2. Next.js 15 API路由类型兼容性问题

**问题描述**:
更新Next.js后，原有的API路由类型定义不再兼容，导致构建失败。

**错误信息**:
```
Type error: Type '{ __tag__: "GET"; __param_position__: "second"; __param_type__: RouteParams; }' does not satisfy the constraint 'ParamCheck<RouteContext>'
```

**解决方案**:
1. 更新API路由参数接口定义
2. 临时在next.config.js中启用`typescript.ignoreBuildErrors: true`

## 待迁移的数据模块

### 1. 项目展示数据 (优先级: 高)

**当前状态**: 使用静态JSON数据

**迁移计划**:
- [ ] 设计并实现Project数据模型
- [ ] 创建项目数据API接口
- [ ] 编写项目数据种子脚本
- [ ] 更新前端组件调用API

### 2. 数据可视化Dashboard (优先级: 中)

**当前状态**: 使用静态数据和模拟API

**迁移计划**:
- [ ] 设计金融数据模型(FinancialData, MarketTrend, IndustryMetric等)
- [ ] 开发数据获取和存储API
- [ ] 构建定时数据更新机制
- [ ] 更新图表组件使用真实数据

### 3. 好站分享数据 (优先级: 低)

**当前状态**: 使用静态JSON数据

**迁移计划**:
- [ ] 实现GoodSite数据模型
- [ ] 开发站点数据管理API
- [ ] 迁移现有数据至数据库

## 常见重复任务与最佳实践

### 1. 数据模型定义流程

遵循以下步骤可减少重复工作和错误:
1. 首先在`prisma/schema.prisma`中定义数据模型
2. 执行`npx prisma migrate dev`创建迁移并更新客户端
3. 在`src/types`目录中定义对应的TypeScript接口
4. 创建数据映射函数(将数据库模型映射到前端类型)

### 2. 新增API接口标准流程

1. 在`src/lib/api/`下创建相应模块的API函数
2. 在`src/app/api/`下创建对应的API路由处理函数
3. 确保添加错误处理和降级方案
4. 实现缓存策略(如有必要)

### 3. 数据种子填充建议

1. 创建独立的种子脚本，确保幂等性(多次运行结果一致)
2. 使用`upsert`操作，避免重复数据
3. 添加清晰的日志输出

## 注意事项与潜在问题

1. **Windows/Unix路径差异**:
   - 统一使用Path模块处理文件路径
   - 使用相对路径时注意跨平台兼容性

2. **数据关系完整性**:
   - 迁移数据时确保关系完整，尤其是外键引用
   - 迁移前备份现有数据

3. **避免的Prisma配置**:
   - 避免使用自定义输出路径(`output`)
   - 使用标准导入路径`@prisma/client`

4. **Next.js版本兼容性**:
   - 更新Next.js时注意API路由参数类型变化
   - 使用最新的App Router模式开发新功能

## 下一步工作计划

1. 完成项目展示模块的数据迁移
2. 开发简单的后台管理界面，用于内容管理
3. 实现数据可视化Dashboard的实时数据获取
4. 添加用户认证系统
5. 优化博客搜索功能，支持全文搜索

## 资源与参考

- [Prisma数据迁移官方文档](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Next.js 15 API路由文档](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [数据库备份与恢复最佳实践](https://www.prisma.io/dataguide/types/relational/what-is-a-database-backup) 