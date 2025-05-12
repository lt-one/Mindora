import { SiteCardProps } from "@/components/good-sites/SiteCard";

// 为站点数据添加占位图URL - 使用本地路径而非外部URL
const getPlaceholderUrl = (name: string) => {
  // 使用本地图片路径
  return `/images/placeholders/site-placeholder.jpg/PlaceImage.png`;
};

export const siteCategories = [
  "开发工具",
  "设计资源",
  "学习平台",
  "生产力工具",
  "内容创作",
  "数据资源",
  "职业发展",
  "生活实用"
];

export const siteTags = [
  "免费",
  "付费",
  "免费+付费",
  "Web应用",
  "桌面软件",
  "移动应用",
  "浏览器插件",
  "AI工具",
  "开源项目",
  "前端开发",
  "后端开发",
  "设计工具",
  "学习资源",
  "效率工具",
  "写作工具"
];

export const goodSites: SiteCardProps[] = [
  {
    name: "GitHub",
    url: "https://github.com",
    logo: "",
    description: "全球最大的代码托管平台和开发者社区，提供代码管理、版本控制、协作开发等功能。",
    useCases: ["代码托管", "开源协作", "项目管理"],
    recommendReason: "作为开发者必备平台，GitHub不仅是代码仓库，更是学习、分享和协作的社区，可以发现无数优质开源项目。",
    tags: ["开发工具", "免费", "Web应用", "开源项目"],
    screenshot: getPlaceholderUrl("GitHub"),
    category: "开发工具"
  },
  {
    name: "Figma",
    url: "https://www.figma.com",
    logo: "",
    description: "专业的在线UI设计工具，支持多人实时协作，无需下载即可使用。",
    useCases: ["UI设计", "原型设计", "设计协作"],
    recommendReason: "基于Web的设计工具，实时协作功能极大提高了团队效率，丰富的插件生态使其成为当前最强大的UI设计工具之一。",
    tags: ["设计资源", "免费+付费", "Web应用", "设计工具"],
    screenshot: getPlaceholderUrl("Figma"),
    category: "设计资源"
  },
  {
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    logo: "",
    description: "由Mozilla维护的Web技术开放文档，提供全面的HTML、CSS、JavaScript等Web技术教程和参考。",
    useCases: ["前端学习", "技术查询", "开发参考"],
    recommendReason: "最全面、最权威的Web开发文档，详细的API解释和丰富的示例代码让学习和开发变得简单。",
    tags: ["学习平台", "免费", "Web应用", "前端开发", "学习资源"],
    screenshot: getPlaceholderUrl("MDN Web Docs"),
    category: "学习平台"
  },
  {
    name: "Notion",
    url: "https://www.notion.so",
    logo: "",
    description: "多功能笔记和知识管理工具，集文档、数据库、看板、日历等功能于一体。",
    useCases: ["笔记整理", "知识管理", "项目协作"],
    recommendReason: "极其灵活的内容组织方式让它适合几乎所有场景，从个人笔记到团队协作，都能高效完成。",
    tags: ["生产力工具", "免费+付费", "Web应用", "效率工具"],
    screenshot: getPlaceholderUrl("Notion"),
    category: "生产力工具"
  },
  {
    name: "Vercel",
    url: "https://vercel.com",
    logo: "",
    description: "面向前端开发者的云平台，提供静态站点和Serverless Functions的托管服务。",
    useCases: ["网站部署", "前端托管", "Serverless开发"],
    recommendReason: "极简的部署流程和出色的性能优化，让前端开发者能专注于代码而非基础设施，GitHub集成更是无缝。",
    tags: ["开发工具", "免费+付费", "Web应用", "前端开发"],
    screenshot: getPlaceholderUrl("Vercel"),
    category: "开发工具"
  },
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    logo: "",
    description: "OpenAI开发的强大AI聊天机器人，能够理解和生成人类语言，辅助解决各种问题。",
    useCases: ["内容创作", "问题解答", "编程辅助"],
    recommendReason: "作为AI对话工具的代表，它在日常学习、工作中能提供多方面的辅助，从写作到编程，都有出色表现。",
    tags: ["生产力工具", "免费+付费", "Web应用", "AI工具", "写作工具"],
    screenshot: getPlaceholderUrl("ChatGPT"),
    category: "生产力工具"
  },
  {
    name: "CodePen",
    url: "https://codepen.io",
    logo: "",
    description: "前端代码在线编辑和分享平台，支持HTML、CSS、JavaScript实时预览。",
    useCases: ["代码实验", "前端案例", "灵感获取"],
    recommendReason: "即开即用的在线编辑器让前端开发变得简单，同时也是寻找灵感和学习他人代码的绝佳平台。",
    tags: ["开发工具", "免费+付费", "Web应用", "前端开发"],
    screenshot: getPlaceholderUrl("CodePen"),
    category: "开发工具"
  },
  {
    name: "Coursera",
    url: "https://www.coursera.org",
    logo: "",
    description: "全球知名在线教育平台，提供来自顶尖大学和机构的各类课程和专业证书。",
    useCases: ["在线学习", "技能提升", "获取证书"],
    recommendReason: "高质量课程资源覆盖各个领域，从计算机科学到艺术历史应有尽有，且多数课程支持免费旁听。",
    tags: ["学习平台", "免费+付费", "Web应用", "学习资源"],
    screenshot: getPlaceholderUrl("Coursera"),
    category: "学习平台"
  },
  {
    name: "Unsplash",
    url: "https://unsplash.com",
    logo: "",
    description: "高质量免费图片分享平台，提供可商用的专业摄影作品。",
    useCases: ["素材获取", "设计灵感", "内容创作"],
    recommendReason: "完全免费且无需注明来源的高质量图库，每张图片都具有艺术性和专业水准，是设计和内容创作的必备资源。",
    tags: ["设计资源", "免费", "Web应用", "设计工具"],
    screenshot: getPlaceholderUrl("Unsplash"),
    category: "设计资源"
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com",
    logo: "",
    description: "设计师作品展示与发现平台，收集了全球顶尖设计师的UI、插画、动效等作品。",
    useCases: ["设计灵感", "作品展示", "设计趋势"],
    recommendReason: "设计界的Instagram，可以欣赏到最新的设计趋势和创意，对设计师极具启发性，也是寻找优秀设计师的绝佳渠道。",
    tags: ["设计资源", "免费+付费", "Web应用", "设计工具"],
    screenshot: getPlaceholderUrl("Dribbble"),
    category: "设计资源"
  },
  {
    name: "VS Code",
    url: "https://code.visualstudio.com",
    logo: "",
    description: "微软开发的免费开源代码编辑器，支持多种编程语言，拥有丰富的插件生态。",
    useCases: ["代码编辑", "程序开发", "Git操作"],
    recommendReason: "轻量级却功能强大的编辑器，丰富的扩展生态让它能适应几乎所有开发场景，对前后端开发者都十分友好。",
    tags: ["开发工具", "免费", "桌面软件", "开源项目"],
    screenshot: getPlaceholderUrl("VS Code"),
    category: "开发工具"
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com",
    logo: "",
    description: "功能类优先的CSS框架，提供了大量预定义的类来构建自定义用户界面。",
    useCases: ["前端开发", "快速原型", "UI实现"],
    recommendReason: "改变了CSS开发的传统思路，直接在HTML中应用样式类，大大提高了开发效率，尤其适合快速构建定制化界面。",
    tags: ["开发工具", "免费", "前端开发", "开源项目"],
    screenshot: getPlaceholderUrl("Tailwind CSS"),
    category: "开发工具"
  },
  {
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    logo: "",
    description: "全球最大的程序员问答社区，提供各类编程问题的解答和讨论。",
    useCases: ["问题解决", "知识分享", "编程学习"],
    recommendReason: "几乎所有程序员都会遇到的编程问题都能在这里找到答案，详细的解答和丰富的讨论对深入理解问题很有帮助。",
    tags: ["学习平台", "免费", "Web应用", "开发工具"],
    screenshot: getPlaceholderUrl("Stack Overflow"),
    category: "学习平台"
  },
  {
    name: "LeetCode",
    url: "https://leetcode.com",
    logo: "",
    description: "专注于编程技能提升的在线平台，提供大量编程题目和竞赛。",
    useCases: ["算法练习", "面试准备", "编程能力提升"],
    recommendReason: "程序员面试必备平台，系统化的题目和详细的解答帮助你提升算法思维和编程能力，尤其是大厂面试的必经之路。",
    tags: ["学习平台", "免费+付费", "Web应用", "学习资源"],
    screenshot: getPlaceholderUrl("LeetCode"),
    category: "学习平台"
  },
  {
    name: "Behance",
    url: "https://www.behance.net",
    logo: "",
    description: "Adobe旗下的创意作品展示平台，汇集了全球设计师、艺术家的优秀作品。",
    useCases: ["作品集展示", "创意灵感", "设计学习"],
    recommendReason: "比Dribbble更全面的创意展示平台，作品更完整，涵盖平面设计、UI/UX、摄影等多个领域，非常适合深入学习设计案例。",
    tags: ["设计资源", "免费", "Web应用", "设计工具"],
    screenshot: getPlaceholderUrl("Behance"),
    category: "设计资源"
  },
  {
    name: "Trello",
    url: "https://trello.com",
    logo: "",
    description: "基于看板的项目管理工具，通过卡片和列表可视化管理任务和项目进度。",
    useCases: ["项目管理", "任务跟踪", "团队协作"],
    recommendReason: "直观的看板视图让项目管理变得简单有趣，拖拽操作和灵活的自定义选项非常适合个人和小团队使用。",
    tags: ["生产力工具", "免费+付费", "Web应用", "效率工具"],
    screenshot: getPlaceholderUrl("Trello"),
    category: "生产力工具"
  },
  {
    name: "Canva",
    url: "https://www.canva.com",
    logo: "",
    description: "在线平面设计工具，提供大量模板和素材，无需专业技能即可创建精美设计。",
    useCases: ["图形设计", "社媒素材", "演示文稿"],
    recommendReason: "降低了设计门槛，即使没有专业设计背景也能快速创建精美的设计作品，适合内容创作者和市场营销人员使用。",
    tags: ["设计资源", "免费+付费", "Web应用", "设计工具"],
    screenshot: getPlaceholderUrl("Canva"),
    category: "设计资源"
  },
  {
    name: "Midjourney",
    url: "https://www.midjourney.com",
    logo: "",
    description: "AI图像生成工具，通过文本描述创建高质量的艺术图像和插画。",
    useCases: ["图像生成", "创意设计", "概念艺术"],
    recommendReason: "生成的图像质量极高，艺术感强，特别适合概念设计和创意探索，可以快速将想法可视化。",
    tags: ["设计资源", "付费", "AI工具", "创作工具"],
    screenshot: getPlaceholderUrl("Midjourney"),
    category: "内容创作"
  },
  {
    name: "freeCodeCamp",
    url: "https://www.freecodecamp.org",
    logo: "",
    description: "免费开源的编程学习平台，提供互动课程和项目实践。",
    useCases: ["编程学习", "实战项目", "技能认证"],
    recommendReason: "完全免费且高质量的编程教育资源，通过实际项目学习各种Web开发技术，非常适合自学者和编程初学者。",
    tags: ["学习平台", "免费", "Web应用", "学习资源"],
    screenshot: getPlaceholderUrl("freeCodeCamp"),
    category: "学习平台"
  },
  {
    name: "Obsidian",
    url: "https://obsidian.md",
    logo: "",
    description: "基于本地Markdown文件的知识管理工具，支持双向链接和强大的插件系统。",
    useCases: ["笔记管理", "知识库构建", "研究整理"],
    recommendReason: "独特的知识图谱和双向链接功能让笔记之间建立关联，形成网状知识体系，本地存储保证了数据安全和隐私。",
    tags: ["生产力工具", "免费+付费", "桌面软件", "效率工具"],
    screenshot: getPlaceholderUrl("Obsidian"),
    category: "生产力工具"
  },
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com",
    logo: "",
    description: "发现新产品和创新应用的平台，每天推出新的科技产品和工具。",
    useCases: ["产品发现", "市场调研", "创业灵感"],
    recommendReason: "了解最新科技趋势和创新产品的绝佳平台，常常能发现解决特定问题的新工具，对产品经理和创业者尤其有价值。",
    tags: ["生产力工具", "免费", "Web应用", "效率工具"],
    screenshot: getPlaceholderUrl("Product Hunt"),
    category: "职业发展"
  },
  {
    name: "Draw.io",
    url: "https://app.diagrams.net",
    logo: "",
    description: "免费开源的在线绘图工具，可用于创建流程图、UML图、架构图等。",
    useCases: ["流程图设计", "原型图绘制", "架构设计"],
    recommendReason: "完全免费且功能强大的绘图工具，支持多种图表类型，界面简洁易用，支持云存储集成，是技术文档和项目规划的得力助手。",
    tags: ["开发工具", "免费", "Web应用", "设计工具"],
    screenshot: getPlaceholderUrl("Draw.io"),
    category: "开发工具"
  },
  {
    name: "Hugging Face",
    url: "https://huggingface.co",
    logo: "",
    description: "AI模型和数据集的开源平台，提供大量预训练模型和工具。",
    useCases: ["AI模型使用", "NLP应用", "AI研究"],
    recommendReason: "AI领域的GitHub，提供了海量开源模型和数据集，极大降低了AI应用的开发门槛，对NLP和机器学习开发者尤为重要。",
    tags: ["开发工具", "免费+付费", "Web应用", "AI工具"],
    screenshot: getPlaceholderUrl("Hugging Face"),
    category: "开发工具"
  },
  {
    name: "Kaggle",
    url: "https://www.kaggle.com",
    logo: "",
    description: "数据科学竞赛平台和社区，提供大量公开数据集和机器学习教程。",
    useCases: ["数据竞赛", "数据集获取", "机器学习学习"],
    recommendReason: "数据科学学习的最佳平台之一，通过参与竞赛提升实战能力，丰富的数据集和笔记本资源对数据分析和机器学习项目极有帮助。",
    tags: ["数据资源", "免费", "Web应用", "学习资源"],
    screenshot: getPlaceholderUrl("Kaggle"),
    category: "数据资源"
  },
  {
    name: "Replit",
    url: "https://replit.com",
    logo: "",
    description: "在线代码编辑器和开发环境，支持多种编程语言，无需本地配置。",
    useCases: ["在线编程", "快速原型", "代码分享"],
    recommendReason: "即开即用的在线IDE，无需配置本地环境就能编写和运行代码，非常适合学习、教学和快速验证想法。",
    tags: ["开发工具", "免费+付费", "Web应用", "前端开发"],
    screenshot: getPlaceholderUrl("Replit"),
    category: "开发工具"
  },
  {
    name: "Awwwards",
    url: "https://www.awwwards.com",
    logo: "",
    description: "展示全球最优秀网站设计的平台，评选和表彰创新的网页设计作品。",
    useCases: ["网站灵感", "设计趋势", "创意参考"],
    recommendReason: "汇集了世界上最具创意和前沿的网站设计，是寻找网页设计灵感和了解最新设计趋势的绝佳场所。",
    tags: ["设计资源", "免费+付费", "Web应用", "设计工具"],
    screenshot: getPlaceholderUrl("Awwwards"),
    category: "设计资源"
  },
  {
    name: "Designspiration",
    url: "https://www.designspiration.com",
    logo: "",
    description: "视觉设计灵感搜索引擎，提供海量高质量设计作品参考。",
    useCases: ["设计灵感", "色彩参考", "创意发现"],
    recommendReason: "专注于高质量视觉设计作品的分享，可以基于颜色、主题等进行搜索，帮助设计师找到创作灵感。",
    tags: ["设计资源", "免费", "Web应用", "设计工具"],
    screenshot: getPlaceholderUrl("Designspiration"),
    category: "设计资源"
  },
  {
    name: "ColorHunt",
    url: "https://colorhunt.co",
    logo: "",
    description: "精选配色方案分享平台，提供时尚流行的色彩组合。",
    useCases: ["配色方案", "色彩灵感", "UI设计"],
    recommendReason: "简洁易用的配色工具，收集了大量精美的色彩组合，能快速找到适合各种设计项目的现代流行配色。",
    tags: ["设计资源", "免费", "Web应用", "设计工具"],
    screenshot: getPlaceholderUrl("ColorHunt"),
    category: "设计资源"
  },
  {
    name: "FigJam",
    url: "https://www.figma.com/figjam",
    logo: "",
    description: "Figma推出的在线协作白板工具，专为团队头脑风暴和设计规划设计。",
    useCases: ["协作白板", "头脑风暴", "用户流程图"],
    recommendReason: "结合了Figma的易用性和实时协作特性，让远程团队能轻松进行创意讨论、流程规划和设计思考。",
    tags: ["设计资源", "免费+付费", "Web应用", "设计工具", "协作工具"],
    screenshot: getPlaceholderUrl("FigJam"),
    category: "设计资源"
  },
  {
    name: "Pinterest",
    url: "https://www.pinterest.com",
    logo: "",
    description: "视觉内容发现和收藏平台，提供各类创意灵感和设计参考。",
    useCases: ["灵感收集", "创意探索", "设计参考"],
    recommendReason: "强大的视觉灵感来源，算法能精准推荐相关内容，对设计师、内容创作者和任何需要创意灵感的人都非常有价值。",
    tags: ["设计资源", "免费", "Web应用", "效率工具", "灵感平台"],
    screenshot: getPlaceholderUrl("Pinterest"),
    category: "内容创作"
  }
]; 