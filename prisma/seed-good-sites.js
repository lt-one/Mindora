/**
 * 好站分享数据种子脚本
 */
const { PrismaClient } = require('@prisma/client');

// 实例化Prisma客户端
const prisma = new PrismaClient();

// 模拟数据 - 这些数据基于原始的src/lib/data/good-sites.ts
const mockGoodSites = [
  {
    name: "GitHub",
    url: "https://github.com",
    description: "全球最大的代码托管平台和开发者社区，提供代码管理、版本控制、协作开发等功能。",
    useCases: ["代码托管", "开源协作", "项目管理"],
    recommendReason: "作为开发者必备平台，GitHub不仅是代码仓库，更是学习、分享和协作的社区，可以发现无数优质开源项目。",
    tags: ["开发工具", "免费", "Web应用", "开源项目"],
    category: "开发工具",
    isFree: true,
    hasPremium: false
  },
  {
    name: "Figma",
    url: "https://www.figma.com",
    description: "专业的在线UI设计工具，支持多人实时协作，无需下载即可使用。",
    useCases: ["UI设计", "原型设计", "设计协作"],
    recommendReason: "基于Web的设计工具，实时协作功能极大提高了团队效率，丰富的插件生态使其成为当前最强大的UI设计工具之一。",
    tags: ["设计资源", "免费+付费", "Web应用", "设计工具"],
    category: "设计资源",
    isFree: true,
    hasPremium: true
  },
  {
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "由Mozilla维护的Web技术开放文档，提供全面的HTML、CSS、JavaScript等Web技术教程和参考。",
    useCases: ["前端学习", "技术查询", "开发参考"],
    recommendReason: "最全面、最权威的Web开发文档，详细的API解释和丰富的示例代码让学习和开发变得简单。",
    tags: ["学习平台", "免费", "Web应用", "前端开发", "学习资源"],
    category: "学习平台",
    isFree: true,
    hasPremium: false
  },
  {
    name: "Notion",
    url: "https://www.notion.so",
    description: "多功能笔记和知识管理工具，集文档、数据库、看板、日历等功能于一体。",
    useCases: ["笔记整理", "知识管理", "项目协作"],
    recommendReason: "极其灵活的内容组织方式让它适合几乎所有场景，从个人笔记到团队协作，都能高效完成。",
    tags: ["生产力工具", "免费+付费", "Web应用", "效率工具"],
    category: "生产力工具",
    isFree: true,
    hasPremium: true
  },
  {
    name: "VS Code",
    url: "https://code.visualstudio.com",
    description: "微软开发的免费开源代码编辑器，支持多种编程语言，拥有丰富的插件生态。",
    useCases: ["代码编辑", "程序开发", "Git操作"],
    recommendReason: "轻量级却功能强大的编辑器，丰富的扩展生态让它能适应几乎所有开发场景，对前后端开发者都十分友好。",
    tags: ["开发工具", "免费", "桌面软件", "开源项目"],
    category: "开发工具",
    isFree: true,
    hasPremium: false
  },
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    description: "OpenAI开发的强大AI聊天机器人，能够理解和生成人类语言，辅助解决各种问题。",
    useCases: ["内容创作", "问题解答", "编程辅助"],
    recommendReason: "作为AI对话工具的代表，它在日常学习、工作中能提供多方面的辅助，从写作到编程，都有出色表现。",
    tags: ["生产力工具", "免费+付费", "Web应用", "AI工具", "写作工具"],
    category: "生产力工具",
    isFree: true,
    hasPremium: true
  },
  {
    name: "LeetCode",
    url: "https://leetcode.com",
    description: "专注于编程技能提升的在线平台，提供大量编程题目和竞赛。",
    useCases: ["算法练习", "面试准备", "编程能力提升"],
    recommendReason: "程序员面试必备平台，系统化的题目和详细的解答帮助你提升算法思维和编程能力，尤其是大厂面试的必经之路。",
    tags: ["学习平台", "免费+付费", "Web应用", "学习资源"],
    category: "学习平台",
    isFree: true,
    hasPremium: true
  },
  {
    name: "Unsplash",
    url: "https://unsplash.com",
    description: "高质量免费图片分享平台，提供可商用的专业摄影作品。",
    useCases: ["素材获取", "设计灵感", "内容创作"],
    recommendReason: "完全免费且无需注明来源的高质量图库，每张图片都具有艺术性和专业水准，是设计和内容创作的必备资源。",
    tags: ["设计资源", "免费", "Web应用", "设计工具"],
    category: "设计资源",
    isFree: true,
    hasPremium: false
  },
  {
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "全球最大的程序员问答社区，提供各类编程问题的解答和讨论。",
    useCases: ["问题解决", "知识分享", "编程学习"],
    recommendReason: "几乎所有程序员都会遇到的编程问题都能在这里找到答案，详细的解答和丰富的讨论对深入理解问题很有帮助。",
    tags: ["学习平台", "免费", "Web应用", "开发工具"],
    category: "学习平台",
    isFree: true,
    hasPremium: false
  },
  {
    name: "Coursera",
    url: "https://www.coursera.org",
    description: "全球知名在线教育平台，提供来自顶尖大学和机构的各类课程和专业证书。",
    useCases: ["在线学习", "技能提升", "获取证书"],
    recommendReason: "高质量课程资源覆盖各个领域，从计算机科学到艺术历史应有尽有，且多数课程支持免费旁听。",
    tags: ["学习平台", "免费+付费", "Web应用", "学习资源"],
    category: "学习平台",
    isFree: true,
    hasPremium: true
  }
];

// 分类数据
const categories = [
  "开发工具",
  "设计资源",
  "学习平台",
  "生产力工具",
  "内容创作",
  "数据资源",
  "职业发展",
  "生活实用"
];

// 将好站数据导入数据库
const seedGoodSites = async () => {
  try {
    console.log('开始导入好站数据...');
    
    // 插入或更新站点数据
    for (const site of mockGoodSites) {
      // 检查是否已经存在该站点（基于名称和URL唯一性）
      const existingSite = await prisma.goodSite.findFirst({
        where: {
          OR: [
            { name: site.name },
            { url: site.url }
          ]
        }
      });
      
      // 构建数据库记录
      const siteData = {
        name: site.name,
        url: site.url,
        description: site.description,
        shortDesc: site.description.substring(0, 100) + (site.description.length > 100 ? '...' : ''),
        category: site.category,
        tags: site.tags,
        rating: site.recommendReason ? 4.5 : 4.0, // 基于推荐理由估算一个评分
        screenshots: ["/images/placeholders/site-placeholder.jpg/PlaceImage.png"],
        useCases: site.useCases || [],
        tips: '',
        experience: site.recommendReason || '',
        isFree: site.isFree,
        hasPremium: site.hasPremium,
        relatedSites: [],
        isActive: true,
        featured: false,
        viewCount: 0
      };
      
      if (existingSite) {
        // 更新已存在的记录
        await prisma.goodSite.update({
          where: { id: existingSite.id },
          data: siteData
        });
        console.log(`更新站点: ${site.name}`);
      } else {
        // 创建新记录
        await prisma.goodSite.create({
          data: siteData
        });
        console.log(`创建站点: ${site.name}`);
      }
    }
    
    console.log('好站数据导入完成!');
  } catch (error) {
    console.error('导入好站数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// 执行导入
seedGoodSites(); 