# 个人网站搭建方案（优化版）

## 一、技术栈选择
### 前端
- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS + shadcn/ui
- **状态管理**：Zustand (按功能模块拆分)
- **数据可视化**：ECharts (动态导入)

### 后端
- **框架**：Node.js + Express + Server Actions
- **语言**：TypeScript
- **数据库**：MySQL
- **ORM**：Prisma
- **API类型**：RESTful API + Server Actions

### 部署
- **前端**：Vercel
- **后端API**：Vercel Serverless Functions（备选：阿里云）
- **数据库**：阿里云数据库服务

## 二、网站架构设计

### 1. 项目结构（App Router优化）
```
MindBreak/
├── app/                     # Next.js App Router结构
│   ├── layout.tsx           # 全局布局
│   ├── page.tsx             # 首页
│   ├── blog/                # 博客相关路由
│   │   ├── page.tsx         # 博客列表页
│   │   ├── [slug]/          # 博客详情动态路由
│   │   │   └── page.tsx     # 博客详情页面
│   ├── projects/            # 项目展示路由
│   ├── dashboard/           # 数据仪表盘路由
│   │   ├── page.tsx         # 主仪表盘页面
│   │   ├── layout.tsx       # 仪表盘共享布局
│   │   └── [category]/      # 分类数据详情页
│   │       └── page.tsx     # 特定类别数据页面
│   ├── todo/                # Todo应用路由
│   ├── about/               # 关于页面路由
│   ├── contact/             # 联系页面路由
│   └── api/                 # API路由处理
│       └── financial-data/  # 金融数据API
│           └── route.ts     # API路由处理器
├── components/              # 组件目录
│   ├── ui/                  # 通用UI组件
│   ├── blog/                # 博客相关组件
│   ├── projects/            # 项目相关组件
│   ├── charts/              # 数据可视化图表组件
│   │   ├── LineChart.tsx    # 时间序列数据折线图
│   │   ├── BarChart.tsx     # 分类比较数据柱状图
│   │   └── PieChart.tsx     # 占比数据饼图
│   ├── DataGrid.tsx         # 详细数据表格组件
│   ├── todo/                # Todo应用组件
│   └── layout/              # 布局相关组件
│       └── Sidebar.tsx      # 导航侧边栏
├── lib/                     # 工具函数
│   ├── db/                  # 数据库相关
│   ├── utils/               # 通用工具
│   └── api/                 # API相关函数
├── public/                  # 静态资源
├── styles/                  # 全局样式
└── types/                   # TypeScript类型定义
```

### 2. 数据库设计
- User（用户信息）
- Project（项目展示）
- BlogPost（博客文章）
- TodoItem（待办事项）
- ExternalData（外部数据）
  - FinancialData（金融数据）
  - MarketTrends（市场趋势）
  - IndustryMetrics（行业指标）

## 三、功能模块实现方案

### 1. 首页模块
- 部分预渲染（PPR）：静态部分立即展示，动态内容流式加载
- 使用服务端组件获取个人信息数据，减少客户端JavaScript
- 添加平滑滚动和微动效，使用客户端组件包装交互部分

### 2. 项目展示模块
- 静态生成（SSG）+ ISR（24小时刷新一次）
- 卡片式布局展示项目，使用Image组件优化图片加载
- 使用React Server Components获取项目数据，减少客户端负担
- 筛选功能使用客户端组件，保持URL状态同步

### 3. 博客系统
- 静态生成（SSG）+ ISR（60分钟刷新）
- Markdown编辑器动态导入（可使用react-markdown）
- 文章分类与标签系统使用服务端组件获取数据
- 评论功能使用Suspense流式传输，保证主要内容快速加载
- 使用Route Handlers和Server Actions处理评论提交

### 4. Todo List功能
- 混合渲染：服务端组件初始数据获取 + 客户端交互
- 使用客户端组件处理交互逻辑：
  - 添加、编辑、删除待办事项
  - 拖拽排序
  - 状态切换（完成/未完成）
- 使用Server Actions处理数据持久化
- 本地存储+数据库同步，使用SWR进行数据缓存和重验证
- 扩展功能：
  - 分类管理
  - 截止日期提醒
  - 优先级设置

### 5. 关于我页面
- 静态生成（SSG）
- 个人简历组件化设计
- 技能展示使用动态导入的ECharts，减少初始加载大小
- 教育背景与工作经验时间线
- 兴趣爱好展示

### 6. 联系页面
- 静态页面 + 客户端表单交互
- 联系表单使用Server Actions处理提交
- 社交媒体链接展示

### 7. 数据仪表盘与可视化
- 数据获取系统（使用公共API和静态数据）
- 定时更新（使用Vercel ISR和Revalidation）
- 数据处理流程：
  1. 通过API获取外部数据
  2. 数据格式转换与处理
  3. 存储到MySQL数据库
- 前端可视化组件结构：
  - `components/charts/LineChart.tsx` - 时间序列数据展示
  - `components/charts/BarChart.tsx` - 分类比较数据展示
  - `components/charts/PieChart.tsx` - 占比数据展示
  - `components/DataGrid.tsx` - 详细数据表格展示
- 页面组件结构：
  - `app/dashboard/page.tsx` - 主仪表盘，集成各图表
  - `app/dashboard/[category]/page.tsx` - 特定类别数据详情
- 数据筛选使用客户端组件，保持URL状态同步

### 8. 数据流设计
- **数据获取流程**：
  1. 前端组件初始化并调用API（使用SWR或React Query）
  2. API端点（如`app/api/financial-data/route.ts`）从外部源获取并处理数据
  3. 前端接收数据并更新状态，触发组件重渲染
- **数据刷新策略**：
  - 使用SWR的自动重验证进行周期性数据刷新
  - 添加手动刷新按钮供用户主动更新数据
  - 对于实时性要求高的数据，考虑使用数据轮询或WebSocket连接
- **错误处理机制**：
  - API级别错误捕获与日志记录
  - 前端错误边界处理组件级错误
  - 用户友好的错误提示与重试机制

## 四、性能优化策略

### 1. 图片优化
- 使用Next.js的Image组件优化图片加载
- 实现模糊占位符和响应式尺寸
- 适当设置优先级，优化关键图片加载

### 2. 代码分割与懒加载
- 动态导入大型组件，减少初始加载体积
- 为懒加载组件添加加载状态
- 延迟加载非首屏数据可视化和编辑器组件

### 3. 第三方脚本优化
- 使用next/script的策略属性控制脚本加载时机
- 分析工具脚本设置为afterInteractive
- 非关键脚本延迟加载

### 4. 服务端组件与客户端组件划分
- **服务端组件**（默认）：数据获取、静态内容展示、SEO相关内容
- **客户端组件**：添加'use client'指令，用于交互性强的功能（表单、Todo交互等）

### 5. 状态管理优化
- 按功能模块拆分Zustand store
- 创建专用store处理UI状态（暗黑模式等）
- 创建专用store处理业务逻辑（Todo等）

## 五、开发流程

1. **项目初始化**：使用App Router结构搭建Next.js项目
2. **数据库设计**：定义数据模型，建立Prisma Schema
3. **API设计**：设计RESTful API端点和Server Actions
4. **页面渲染策略设计**：确定每个页面的最佳渲染策略
5. **前端页面开发**：按功能模块逐个实现
6. **后端接口实现**：配合前端需求开发接口
7. **数据获取系统开发**：实现API集成和数据处理
8. **性能优化**：图片优化、代码分割、缓存策略优化
9. **整合测试**：全面测试功能
10. **部署上线**：Vercel部署前端，阿里云或Vercel Functions部署后端

## 六、Next.js配置优化

- **部分预渲染**：开启PPR功能提升首屏体验
- **图片优化**：配置CDN域名和现代图片格式
- **静态资源缓存**：设置长期缓存策略
- **包导入优化**：配置optimizePackageImports优化大型库导入
- **开发体验**：使用Turbopack提升开发速度

## 七、组件设计原则

- **职责单一**：每个组件只负责一个功能，避免过度复杂
- **可复用性**：设计通用组件供多个页面使用
- **可测试性**：组件设计便于单元测试
- **状态隔离**：合理划分客户端/服务端组件，避免不必要的状态传递
- **性能优化**：组件级别的代码分割与懒加载

## 八、特色功能
- 暗黑模式支持 (使用Next.js主题支持)
- 国际化支持（中/英）(使用next-intl)
- SEO优化 (使用Next.js内置的元数据API)
- 响应式设计，适配各种设备
- 渐进式Web应用（PWA）支持 