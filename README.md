# Mindora - 个人网站项目

## 项目概述
Mindora是一个功能丰富的个人网站项目，包含多种模块，展示个人作品集、技术博客、数据可视化能力以及前端开发技术。该项目旨在成为个人展示平台，同时也是实用性与美观性并重的Web应用示例。

## 核心功能
- **个人项目展示**：展示个人开发的项目作品集
- **技术博客**：分享前端开发、数据可视化等技术文章
- **数据仪表盘**：展示数据分析和可视化能力
- **Todo应用**：个人任务管理工具
- **好站分享**：优质网站资源收集与推荐

## 技术栈
- **框架**：Next.js 14 (App Router)
- **UI库**：Tailwind CSS, shadcn/ui
- **状态管理**：Zustand
- **数据库**：MySQL (Prisma ORM)
- **部署**：Vercel

## 项目结构
```
mindbreak/
├── prisma/          # 数据库模型定义
├── public/          # 静态资源
└── src/
    ├── app/         # 页面组件 (Next.js App Router结构)
    ├── components/  # UI组件
    ├── lib/         # 工具函数和API
    └── styles/      # 全局样式
```

## 安装与运行
```bash
# 安装依赖
npm install

# 数据库迁移
npx prisma migrate dev

# 开发环境运行
npm run dev

# 构建项目
npm run build

# 生产环境运行
npm start
```

## 特色亮点
1. 采用最新的Next.js 14 App Router架构
2. 结合Server Components和Client Components的最佳实践
3. 响应式设计，支持多种设备浏览
4. 数据可视化展示与交互能力
5. 干净整洁的代码组织和模块化设计

## 许可证
MIT 
