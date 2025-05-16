# Mindora - 个人博客与数据可视化平台

![Mindora](public/images/blog/PlaceImage.png)

Mindora是一个基于Next.js 15构建的个人知识分享与数据可视化平台，集成了博客系统、数据dashboard和项目展示功能。

## 主要功能

### 博客系统
- 支持Markdown格式的文章内容
- 分类和标签系统，便于内容组织和检索
- 响应式设计，适配各种设备
- 文章搜索功能
- 相关文章推荐

### 数据可视化Dashboard
- 中国股市数据实时展示
- 技术分析指标图表
- 热门股票监控
- 自适应数据刷新

### 项目展示
- 个人项目集合展示
- 技术栈标签
- 项目详情与案例分析

### 其他功能
- 待办事项管理
- 优质网站分享
- 影评与书评平台

## 技术栈

- **前端框架**: Next.js 15, React 18
- **样式**: Tailwind CSS, Shadcn UI
- **数据库**: MySQL (通过Prisma ORM)
- **部署**: Vercel
- **数据可视化**: ECharts, D3.js
- **认证**: 自定义认证系统

## 本地开发

### 前提条件
- Node.js 18+
- MySQL数据库

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/lt-one/Mindora.git
cd Mindora
```

2. 安装依赖
```bash
npm install
```

3. 环境配置
创建`.env`文件并配置以下环境变量:
```
DATABASE_URL="mysql://username:password@localhost:3306/mindora_db"
```

4. 数据库迁移与种子数据
```bash
npx prisma migrate dev
node seed-blog-script.js
```

5. 启动开发服务器
```bash
npm run dev
```

6. 构建生产版本
```bash
npm run build
npm start
```

## 项目结构

```
mindora_main/
├── prisma/               # Prisma ORM配置和迁移
├── public/               # 静态资源
│   ├── images/           # 图片资源
│   └── svg-images/       # SVG图像
├── src/
│   ├── app/              # Next.js应用路由
│   │   ├── api/          # API路由
│   │   ├── blog/         # 博客页面
│   │   ├── dashboard/    # 数据仪表盘
│   │   └── ...
│   ├── components/       # React组件
│   │   ├── blog/         # 博客相关组件
│   │   ├── charts/       # 图表组件
│   │   └── ...
│   ├── lib/              # 工具函数和业务逻辑
│   │   ├── api/          # API相关功能
│   │   ├── data/         # 数据处理
│   │   └── db/           # 数据库相关
│   └── types/            # TypeScript类型定义
└── ... 配置文件
```

## 贡献指南

欢迎贡献代码或提出建议，具体步骤：
1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交变更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

MIT License

## 联系方式

如有问题，请通过GitHub Issues或Pull Requests提出。 
