import { Project, ProjectCategory, TechnologyTag } from "@/types/project";

/**
 * 项目分类数据
 */
export const categories: ProjectCategory[] = [
  {
    id: "web-app",
    name: "Web应用",
    slug: "web-app",
    description: "完整的前端或全栈Web应用项目",
    order: 1
  },
  {
    id: "data-viz",
    name: "数据可视化",
    slug: "data-viz",
    description: "专注于数据分析和可视化的项目",
    order: 2
  },
  {
    id: "ai-ml",
    name: "人工智能",
    slug: "ai-ml",
    description: "人工智能和机器学习相关项目",
    order: 3
  },
  {
    id: "ui-ux",
    name: "UI/UX设计",
    slug: "ui-ux",
    description: "侧重界面设计和用户体验的项目",
    order: 4
  },
  {
    id: "open-source",
    name: "开源贡献",
    slug: "open-source",
    description: "参与的开源项目和贡献",
    order: 5
  }
];

/**
 * 技术标签数据
 */
export const technologies: TechnologyTag[] = [
  { id: "react", name: "React", slug: "react", category: "frontend", color: "blue" },
  { id: "vue", name: "Vue.js", slug: "vue", category: "frontend", color: "green" },
  { id: "next", name: "Next.js", slug: "next", category: "frontend", color: "black" },
  { id: "typescript", name: "TypeScript", slug: "typescript", category: "frontend", color: "blue" },
  { id: "python", name: "Python", slug: "python", category: "backend", color: "yellow" },
  { id: "node", name: "Node.js", slug: "node", category: "backend", color: "green" },
  { id: "ai", name: "AI大模型", slug: "ai", category: "ai", color: "purple" },
  { id: "data-analysis", name: "数据分析", slug: "data-analysis", category: "data", color: "orange" },
  { id: "data-viz", name: "数据可视化", slug: "data-viz", category: "data", color: "red" },
  { id: "ui-ux", name: "UI/UX", slug: "ui-ux", category: "design", color: "pink" },
  { id: "bmi", name: "脑机接口", slug: "bmi", category: "hardware", color: "gray" },
  { id: "harmonyos", name: "鸿蒙ArkTs", slug: "harmonyos", category: "mobile", color: "blue" },
  { id: "tableau", name: "Tableau", slug: "tableau", category: "data", color: "blue" }
];

/**
 * 项目数据
 */
export const projects: Project[] = [
  {
    id: "1",
    title: "华为终端舆情监测分析",
    slug: "huawei-sentiment-analysis",
    summary: "全网监测华为品牌相关信息，预警舆情风险，输出数据报告，支持产品迭代",
    description: `# 华为终端舆情监测分析

## 项目背景
针对华为手机、平板等终端产品，开发实时舆情监测系统，及时发现并预警负面舆情，为产品迭代提供数据支持。

## 技术实现
- 基于Python的多渠道信息采集系统
- 结合大模型的情感分析与分类
- Flask后端API服务
- React前端展示
- 自动化报告生成系统

## 核心功能
- 多渠道舆情采集（社交媒体、新闻、论坛）
- 实时舆情监测与分析
- 舆情态势可视化大屏
- 情感分析与主题提取
- 自动预警机制`,
    thumbnailUrl: "/images/projects/sentiment-analysis-cover.png",
    images: [
      "/images/projects/sentiment-analysis-cover.png",
      "/images/projects/ai-sentiment-cover.png"
    ],
    technologies: ["Python", "AI大模型", "数据分析", "Flask", "React"],
    categories: ["data-viz", "ai-ml"],
    featured: true,
    highlightColor: "from-blue-500 to-indigo-500",
    completionDate: "2023-10-15",
    duration: "6个月",
    role: "数据分析师 & 前端开发",
    client: "华为消费者业务部",
    challenges: [
      "海量数据实时处理",
      "复杂情感分析",
      "多渠道信息整合"
    ],
    solutions: [
      "分布式爬虫架构",
      "基于BERT的情感分析模型",
      "数据仓库设计最佳实践"
    ],
    results: [
      "舆情预警准确率提升30%",
      "负面舆情处理时间缩短50%",
      "为3款产品迭代提供数据支持"
    ],
    order: 1
  },
  {
    id: "2",
    title: "脑机接口灯光控制系统",
    slug: "brain-interface-lighting",
    summary: "通过脑电采集头环监控脑电信号，检测注意力水平，自动调节室内灯光亮度",
    description: `# 脑机接口灯光控制系统

## 项目背景
探索脑机接口在智能家居领域的应用，开发基于脑电信号的智能灯光控制系统，通过检测用户的注意力水平，自动调节灯光亮度和色温。

## 技术实现
- 使用NeuroSky脑电头环采集脑电信号
- Python处理脑电原始数据
- 鸿蒙ArkTs开发智能家居控制App
- 自定义蓝牙通信协议
- 注意力算法模型

## 核心功能
- 脑电信号实时采集
- 注意力水平检测与分析
- 智能灯光自动调节
- 用户数据记录与分析
- 场景模式定制`,
    thumbnailUrl: "/images/projects/brain-interface-cover.png",
    images: [
      "/images/projects/brain-interface-cover.png",
      "/images/projects/smart-home-cover.png"
    ],
    technologies: ["脑机接口", "Python", "鸿蒙ArkTs", "蓝牙通信"],
    categories: ["ai-ml", "web-app"],
    featured: true,
    highlightColor: "from-purple-500 to-pink-500",
    completionDate: "2023-08-20",
    duration: "4个月",
    role: "全栈开发者",
    client: "研究项目",
    challenges: [
      "脑电信号噪音过滤",
      "实时信号处理",
      "跨设备通信稳定性"
    ],
    solutions: [
      "自适应滤波算法",
      "边缘计算优化",
      "稳定性优先的通信协议"
    ],
    results: [
      "注意力检测准确率达85%",
      "灯光响应延迟<200ms",
      "用户体验满意度评分4.8/5"
    ],
    order: 2
  },
  {
    id: "3",
    title: "数据可视化平台",
    slug: "data-visualization",
    summary: "交互式数据可视化平台，实时监控和分析关键业务指标，支持多种图表类型",
    description: `# 数据可视化平台

## 项目背景
为企业开发专业的数据可视化平台，提供直观、交互式的数据展示和分析工具，帮助决策者快速理解数据趋势和洞察。

## 技术实现
- 基于React和TypeScript的前端架构
- ECharts和D3.js实现复杂可视化
- Node.js后端API服务
- PostgreSQL数据库
- 实时数据处理管道

## 核心功能
- 多维数据展示仪表盘
- 实时数据更新与监控
- 自定义图表组件
- 数据钻取与过滤
- 报表导出与分享`,
    thumbnailUrl: "/images/projects/data-visualization-cover.png",
    images: [
      "/images/projects/data-visualization-cover.png"
    ],
    technologies: ["React", "TypeScript", "ECharts", "D3.js", "Node.js"],
    categories: ["data-viz", "web-app"],
    featured: false,
    highlightColor: "from-green-500 to-emerald-500",
    completionDate: "2023-05-10",
    duration: "5个月",
    role: "前端开发工程师",
    client: "某金融科技公司",
    challenges: [
      "大规模数据渲染性能",
      "复杂交互设计",
      "数据准确性保障"
    ],
    solutions: [
      "数据分片与虚拟滚动",
      "组件化交互系统",
      "端到端数据验证"
    ],
    results: [
      "仪表盘加载速度提升60%",
      "用户分析效率提高40%",
      "支持同时展示100+指标"
    ],
    order: 3
  },
  {
    id: "4",
    title: "AI辅助产品设计工具",
    slug: "ai-design-tool",
    summary: "结合大模型和UI设计原则，自动生成界面原型和产品设计方案",
    description: `# AI辅助产品设计工具

## 项目背景
开发AI驱动的产品设计辅助工具，帮助设计师和产品经理快速生成界面原型，提高设计效率和创新能力。

## 技术实现
- 基于Python的后端服务
- OpenAI API集成
- React前端界面
- 设计系统库
- 矢量图形渲染引擎

## 核心功能
- 文本描述生成UI原型
- 智能设计建议
- 设计风格迁移
- 组件库集成
- 协作设计工作流`,
    thumbnailUrl: "/images/projects/ai-design-cover.png",
    images: [
      "/images/projects/ai-design-cover.png"
    ],
    technologies: ["AI", "Python", "React", "UI/UX"],
    categories: ["ai-ml", "ui-ux"],
    featured: false,
    highlightColor: "from-rose-500 to-red-500",
    completionDate: "2023-12-05",
    duration: "3个月",
    role: "全栈开发者 & 产品设计",
    client: "内部创新项目",
    challenges: [
      "AI生成内容质量控制",
      "设计原则的算法实现",
      "用户与AI协作流程"
    ],
    solutions: [
      "多轮反馈优化算法",
      "设计规则引擎",
      "用户中心设计流程"
    ],
    results: [
      "设计效率提升40%",
      "原型设计时间缩短60%",
      "用户满意度达92%"
    ],
    order: 4
  },
  {
    id: "5",
    title: "个人网站与博客系统",
    slug: "personal-website",
    summary: "基于Next.js开发的个人网站和博客系统，展示个人项目、技术博客和专业技能",
    description: `# 个人网站与博客系统

## 项目背景
开发个人品牌网站，以现代化的方式展示个人项目、技术博客和专业技能，提升专业形象和在线影响力。

## 技术实现
- Next.js与React构建
- TypeScript类型安全
- Tailwind CSS样式系统
- Markdown博客引擎
- 响应式设计

## 核心功能
- 项目作品集展示
- 技术博客系统
- 数据可视化仪表盘
- 多主题支持
- SEO优化`,
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    categories: ["web-app", "ui-ux"],
    featured: true,
    highlightColor: "from-blue-500 to-cyan-500",
    completionDate: "2024-04-20",
    duration: "2个月",
    role: "全栈开发者",
    client: "个人项目",
    challenges: [
      "性能优化",
      "内容管理系统",
      "多设备兼容性"
    ],
    solutions: [
      "静态生成与增量静态再生成",
      "基于文件的CMS",
      "移动优先设计方法"
    ],
    results: [
      "页面加载速度<2秒",
      "Google Lighthouse性能分数95+",
      "流畅的多设备体验"
    ],
    order: 5
  },
  {
    id: "6",
    title: "电子商务数据分析系统",
    slug: "ecommerce-analytics",
    summary: "为电子商务平台开发的全面数据分析系统，提供销售预测、客户细分和产品推荐",
    description: `# 电子商务数据分析系统

## 项目背景
为电子商务平台开发数据分析系统，通过数据挖掘和机器学习技术，提供销售预测、客户细分和个性化产品推荐功能。

## 技术实现
- Python数据分析管道
- 机器学习预测模型
- PostgreSQL数据仓库
- Vue.js前端界面
- RESTful API设计

## 核心功能
- 销售趋势预测
- 客户行为分析
- 产品关联规则挖掘
- 实时销售仪表盘
- 自动化报告系统`,
    thumbnailUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop"
    ],
    technologies: ["Python", "机器学习", "Vue.js", "PostgreSQL", "数据分析"],
    categories: ["data-viz", "ai-ml"],
    featured: false,
    highlightColor: "from-indigo-500 to-purple-500",
    completionDate: "2023-07-15",
    duration: "6个月",
    role: "数据科学家",
    client: "某电商平台",
    challenges: [
      "大规模交易数据处理",
      "实时预测模型部署",
      "多源数据整合"
    ],
    solutions: [
      "分布式计算架构",
      "模型服务容器化",
      "ETL管道优化"
    ],
    results: [
      "销售预测准确率提升25%",
      "用户转化率提高15%",
      "产品推荐相关性提升30%"
    ],
    order: 6
  }
];

/**
 * 通过slug获取项目
 */
export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

/**
 * 获取所有项目
 */
export const getAllProjects = (): Project[] => {
  return projects;
};

/**
 * 获取精选项目
 */
export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured);
};

/**
 * 通过分类获取项目
 */
export const getProjectsByCategory = (categorySlug: string): Project[] => {
  return projects.filter(project => project.categories.includes(categorySlug));
};

/**
 * 通过技术标签获取项目
 */
export const getProjectsByTechnology = (technology: string): Project[] => {
  return projects.filter(project => project.technologies.includes(technology));
};

/**
 * 获取相关项目
 */
export const getRelatedProjects = (projectId: string, limit: number = 3): Project[] => {
  const currentProject = projects.find(p => p.id === projectId);
  if (!currentProject) return [];
  
  // 基于类别和技术栈查找相关项目
  const relatedProjects = projects.filter(p => 
    p.id !== projectId && (
      p.categories.some(c => currentProject.categories.includes(c)) ||
      p.technologies.some(t => currentProject.technologies.includes(t))
    )
  );
  
  // 返回指定数量的相关项目
  return relatedProjects.slice(0, limit);
};