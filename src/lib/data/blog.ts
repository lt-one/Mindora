import { BlogCategory, BlogTag, BlogPost, BlogAuthor, TOCItem } from '@/types/blog';
import * as blogApi from '@/lib/api/blog';

/**
 * 博客分类数据
 */
export const categories: BlogCategory[] = [
  {
    id: '1',
    name: '前端开发',
    slug: 'frontend-development',
    description: '前端开发相关的技术文章，包括HTML、CSS、JavaScript等',
    order: 1,
    count: 5,
  },
  {
    id: '2',
    name: '数据可视化',
    slug: 'data-visualization',
    description: '数据可视化相关的技术和方法论',
    order: 2,
    count: 3,
  },
  {
    id: '3',
    name: 'React生态',
    slug: 'react-ecosystem',
    description: 'React框架及其相关生态的技术文章',
    order: 3,
    count: 4,
  },
  {
    id: '4',
    name: 'Web性能',
    slug: 'web-performance',
    description: 'Web应用性能优化相关的技术和方法',
    order: 4,
    count: 2,
  },
  {
    id: '5',
    name: '学习笔记',
    slug: 'study-notes',
    description: '技术学习过程中的笔记和总结',
    order: 5,
    count: 3,
  },
  {
    id: '6',
    name: '项目复盘',
    slug: 'project-review',
    description: '项目开发过程中的经验和教训',
    order: 6,
    count: 2,
  },
];

/**
 * 博客标签数据
 */
export const tags: BlogTag[] = [
  { id: '1', name: 'JavaScript', slug: 'javascript', color: '#f7df1e', count: 6 },
  { id: '2', name: 'TypeScript', slug: 'typescript', color: '#3178c6', count: 5 },
  { id: '3', name: 'React', slug: 'react', color: '#61dafb', count: 7 },
  { id: '4', name: 'Next.js', slug: 'nextjs', color: '#000000', count: 4 },
  { id: '5', name: 'CSS', slug: 'css', color: '#264de4', count: 3 },
  { id: '6', name: 'Tailwind CSS', slug: 'tailwind-css', color: '#06b6d4', count: 5 },
  { id: '7', name: 'D3.js', slug: 'd3js', color: '#f9a03c', count: 2 },
  { id: '8', name: 'ECharts', slug: 'echarts', color: '#aa314d', count: 3 },
  { id: '9', name: '性能优化', slug: '性能优化', color: '#4caf50', count: 2 },
  { id: '10', name: '前端架构', slug: '前端架构', color: '#9c27b0', count: 3 },
  { id: '11', name: '状态管理', slug: '状态管理', color: '#ff5722', count: 4 },
  { id: '12', name: '服务端渲染', slug: '服务端渲染', color: '#03a9f4', count: 2 },
];

/**
 * 博客作者数据
 */
export const author: BlogAuthor = {
  name: 'Mindora',
  avatar: '/images/avatars/avatar.png',
  bio: '前端开发者，热爱数据可视化和交互设计，致力于创造优美且实用的web应用。',
  social: {
    github: 'https://github.com/Mindora',
    website: 'https://Mindora.top',
  },
};

/**
 * 文章目录示例
 */
const tocExample1: TOCItem[] = [
  {
    id: 'introduction',
    text: '引言',
    level: 2,
  },
  {
    id: 'what-is-nextjs',
    text: 'Next.js是什么',
    level: 2,
    children: [
      {
        id: 'key-features',
        text: '核心特性',
        level: 3,
      },
      {
        id: 'comparison',
        text: '与其他框架的比较',
        level: 3,
      },
    ],
  },
  {
    id: 'getting-started',
    text: '开始使用Next.js',
    level: 2,
    children: [
      {
        id: 'installation',
        text: '安装与项目设置',
        level: 3,
      },
      {
        id: 'project-structure',
        text: '项目结构介绍',
        level: 3,
      },
    ],
  },
  {
    id: 'routing',
    text: 'Next.js路由系统',
    level: 2,
  },
  {
    id: 'data-fetching',
    text: '数据获取策略',
    level: 2,
  },
  {
    id: 'deployment',
    text: '部署Next.js应用',
    level: 2,
  },
  {
    id: 'conclusion',
    text: '总结与展望',
    level: 2,
  },
];

/**
 * 博客文章数据
 */
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Next.js 14深度解析：新特性与最佳实践',
    slug: 'nextjs-14-deep-dive',
    excerpt: '详细探讨Next.js 14的新特性、性能优化以及最佳实践，帮助开发者构建更高效、更可靠的React应用。',
    content: `
# Next.js 14深度解析：新特性与最佳实践

Next.js 14带来了许多令人兴奋的新特性和改进，本文将深入探讨这些变化，并分享如何在实际项目中应用这些最佳实践。

## 服务器组件和客户端组件

Next.js 14进一步完善了React服务器组件的实现，使开发者能够更灵活地控制组件的渲染位置。

## App Router的进一步优化

App Router现在更加稳定和高效，本文深入讨论了其架构改进。

## Server Actions的增强

Server Actions得到了显著的增强，使表单处理和服务器交互变得更加简单和安全。

## 更智能的缓存策略

Next.js 14改进了缓存机制，使开发者能够更精细地控制数据和页面的缓存策略。
    `,
    coverImage: '/images/blog/nextjs-14/cover.jpg',
    publishedAt: '2023-10-28T17:00:00Z',
    updatedAt: '2023-10-30T09:15:00Z',
    author: author,
    categories: ['frontend-development', 'react-ecosystem'],
    tags: ['Next.js', 'React', '前端框架', 'App Router'],
    featured: true,
    status: 'published',
    readingTime: '12分钟',
    viewCount: 2460,
    toc: [],
    relatedPosts: ['2', '9'],
    contentType: 'article',
    seo: {
      title: 'Next.js 14完全指南：新特性、性能优化与最佳实践',
      description: '深入解析Next.js 14的核心更新内容，包括服务器组件、App Router优化、缓存策略和性能提升，以及在实际项目中的最佳应用方式。',
      keywords: 'Next.js 14, React服务器组件, App Router, 前端框架, Server Actions',
    },
  },
  {
    id: '2',
    title: '使用React Hooks和TypeScript构建类型安全的应用',
    slug: 'type-safe-apps-with-react-hooks-and-typescript',
    excerpt: '本文探讨如何结合React Hooks和TypeScript的强大功能，构建类型安全、可维护性高的前端应用，减少运行时错误。',
    content: `
# 使用React Hooks和TypeScript构建类型安全的应用

TypeScript与React Hooks的结合为前端开发带来了前所未有的类型安全和开发体验。本文将详细讲解如何在React项目中充分利用TypeScript和Hooks构建可靠的应用。

## 常见的类型问题

在JavaScript中，许多错误只有在运行时才会被发现，而TypeScript可以在编译时捕获这些问题。

## 为React组件添加类型

TypeScript允许我们为组件的props和state添加类型定义，提高代码可靠性。

## 使用泛型增强自定义Hook

自定义Hook配合TypeScript的泛型，可以创建灵活且类型安全的可复用逻辑。

## 类型安全的状态管理

结合TypeScript和状态管理库，可以构建类型安全的全局状态管理解决方案。
    `,
    coverImage: '/images/blog/PlaceImage.png',
    publishedAt: '2023-09-15T10:00:00Z',
    updatedAt: '2023-09-18T14:30:00Z',
    author: author,
    categories: ['frontend-development', 'react-ecosystem'],
    tags: ['React', 'TypeScript', '状态管理'],
    featured: false,
    status: 'published',
    readingTime: '12分钟',
    viewCount: 890,
    toc: [],
    relatedPosts: ['1', '3'],
    contentType: 'tutorial',
    seo: {
      title: 'React与TypeScript完美结合：构建类型安全的现代Web应用',
      description: '探索React Hooks与TypeScript的协同使用，掌握构建类型安全、可维护性高的前端应用的核心技巧。',
      keywords: 'React Hooks, TypeScript, 类型安全, 前端开发, 状态管理',
    },
  },
  {
    id: '3',
    title: '数据可视化设计原则：从理论到实践',
    slug: 'data-visualization-design-principles',
    excerpt: '探索数据可视化的核心设计原则，从认知心理学到视觉语法，帮助你创建有效、准确且美观的数据可视化作品。',
    content: `
# 数据可视化设计原则：从理论到实践

数据可视化不仅是技术，更是艺术。本文探讨数据可视化的核心设计原则，以及如何将这些原则应用到实际项目中。

## 数据可视化的目的

了解可视化的根本目的是传达信息、发现模式和讲述数据故事。

## 认知与感知原则

探讨视觉认知的基本原理，包括预注意特性、格式塔原则等。

## 数据墨水比

遵循Edward Tufte的"数据墨水比"原则，消除图表垃圾，增强数据表达。

## 色彩使用策略

正确使用色彩来编码数据，避免常见的色彩使用误区。

## 交互设计考量

在可视化中添加适当的交互元素，增强用户参与度和理解深度。
    `,
    coverImage: '/images/blog/PlaceImage.png',
    publishedAt: '2023-08-22T08:30:00Z',
    updatedAt: '2023-08-25T16:15:00Z',
    author: author,
    categories: ['data-visualization'],
    tags: ['数据可视化', 'D3.js', 'ECharts', '设计原则'],
    featured: true,
    status: 'published',
    readingTime: '10分钟',
    viewCount: 1540,
    toc: [],
    relatedPosts: ['7', '8'],
    contentType: 'article',
    seo: {
      title: '数据可视化设计指南：核心原则与实战技巧',
      description: '深入解析数据可视化的设计原则和最佳实践，从视觉认知到交互设计，全方位提升可视化作品的表达效果。',
      keywords: '数据可视化, 设计原则, 视觉编码, 认知心理学, 交互设计',
    },
  },
];

// 添加更多文章
export const moreBlogPosts: BlogPost[] = [
  {
    id: '4',
    title: 'CSS Grid和Flexbox：现代布局技术完全指南',
    slug: 'css-grid-and-flexbox-complete-guide',
    excerpt: '详细解析CSS Grid和Flexbox的使用方法、最佳实践和常见陷阱，帮助你掌握现代Web布局技术。',
    content: '这里是关于CSS Grid和Flexbox的详细内容...',
    coverImage: '/images/blog/PlaceImage.png',
    publishedAt: '2023-07-18T14:00:00Z',
    updatedAt: '2023-07-20T09:45:00Z',
    author: author,
    categories: ['frontend-development'],
    tags: ['CSS', 'Flexbox', 'CSS Grid', '响应式设计'],
    featured: false,
    status: 'published',
    readingTime: '15分钟',
    viewCount: 2350,
    toc: [],
    contentType: 'tutorial',
  },
  {
    id: '5',
    title: 'Web性能优化：关键渲染路径详解',
    slug: 'web-performance-critical-rendering-path',
    excerpt: '深入解析浏览器的关键渲染路径，探讨如何通过优化HTML、CSS和JavaScript提升页面加载速度和用户体验。',
    content: '这里是关于Web性能优化的详细内容...',
    coverImage: '/images/blog/PlaceImage.png',
    publishedAt: '2023-06-30T11:20:00Z',
    updatedAt: '2023-07-05T16:30:00Z',
    author: author,
    categories: ['web-performance'],
    tags: ['性能优化', '前端架构', 'JavaScript'],
    featured: false,
    status: 'published',
    readingTime: '11分钟',
    viewCount: 1890,
    toc: [],
    relatedPosts: ['8'],
    contentType: 'article',
  },
  {
    id: '6',
    title: 'React性能优化实战：从理论到实践',
    slug: 'react-performance-optimization-in-practice',
    excerpt: '探讨React应用常见的性能问题及其解决方案，包括组件渲染优化、状态管理效率和懒加载等实用技巧。',
    content: '这里是关于React性能优化的详细内容...',
    coverImage: '/images/blog/PlaceImage.png',
    publishedAt: '2023-06-12T09:15:00Z',
    updatedAt: '2023-06-15T14:20:00Z',
    author: author,
    categories: ['react-ecosystem', 'web-performance'],
    tags: ['React', '性能优化', '状态管理'],
    featured: false,
    status: 'published',
    readingTime: '13分钟',
    viewCount: 2120,
    toc: [],
    relatedPosts: ['2', '5'],
    contentType: 'article',
  },
  {
    id: '7',
    title: 'D3.js入门到精通：数据驱动的可视化开发',
    slug: 'd3js-data-visualization-fundamentals',
    excerpt: '全面介绍D3.js的核心概念、使用方法和实战技巧，帮助前端开发者快速掌握这一强大的数据可视化库。',
    content: '这里是关于D3.js的详细内容...',
    coverImage: '/images/blog/PlaceImage.png',
    publishedAt: '2023-05-25T10:40:00Z',
    updatedAt: '2023-05-28T16:50:00Z',
    author: author,
    categories: ['data-visualization'],
    tags: ['D3.js', '数据可视化', 'JavaScript', 'SVG'],
    featured: false,
    status: 'published',
    readingTime: '18分钟',
    viewCount: 1650,
    toc: [],
    relatedPosts: ['3', '8'],
    contentType: 'tutorial',
  },
  {
    id: '8',
    title: '响应式数据仪表盘设计与实现',
    slug: 'responsive-data-dashboard-design',
    excerpt: '从设计到实现，详解如何打造响应式数据仪表盘，包括布局策略、组件设计和数据处理方案。',
    content: '这里是关于数据仪表盘设计的详细内容...',
    coverImage: '/images/blog/PlaceImage.png',
    publishedAt: '2023-05-08T08:30:00Z',
    updatedAt: '2023-05-10T11:25:00Z',
    author: author,
    categories: ['data-visualization', 'frontend-development'],
    tags: ['数据可视化', 'ECharts', 'CSS Grid', '响应式设计'],
    featured: false,
    status: 'published',
    readingTime: '14分钟',
    viewCount: 1780,
    toc: [],
    relatedPosts: ['3', '4', '7'],
    contentType: 'case-study',
  },
  {
    id: '9',
    title: '我的Next.js项目架构实践',
    slug: 'my-nextjs-project-architecture',
    excerpt: '分享个人在构建中大型Next.js项目时的架构设计、文件组织和最佳实践，以及项目演进过程中的经验教训。',
    content: '这里是关于Next.js项目架构的详细内容...',
    coverImage: '/images/blog/PlaceImage.png',
    publishedAt: '2023-04-20T15:10:00Z',
    updatedAt: '2023-04-22T09:35:00Z',
    author: author,
    categories: ['project-review', 'react-ecosystem'],
    tags: ['Next.js', 'React', '前端架构', '项目管理'],
    featured: false,
    status: 'published',
    readingTime: '16分钟',
    viewCount: 2450,
    toc: [],
    relatedPosts: ['1', '10'],
    contentType: 'case-study',
  },
  {
    id: '10',
    title: 'Tailwind CSS实战：从怀疑到热爱',
    slug: 'tailwind-css-in-action',
    excerpt: '记录我从最初对Tailwind CSS的怀疑到完全接纳的心路历程，分享在实际项目中的应用经验和最佳实践。',
    content: '这里是关于Tailwind CSS的详细内容...',
    coverImage: '/images/blog/PlaceImage.png',
    publishedAt: '2023-04-05T13:45:00Z',
    updatedAt: '2023-04-08T10:20:00Z',
    author: author,
    categories: ['frontend-development', 'study-notes'],
    tags: ['Tailwind CSS', 'CSS', '前端架构'],
    featured: false,
    status: 'published',
    readingTime: '9分钟',
    viewCount: 1920,
    toc: [],
    relatedPosts: ['4'],
    contentType: 'article',
  },
];

// 合并所有博客文章
export const allBlogPosts: BlogPost[] = [...blogPosts, ...moreBlogPosts];

/**
 * 获取所有博客文章
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return blogApi.getAllBlogPosts();
}

/**
 * 获取特定分类的博客文章
 */
export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  return blogApi.getBlogPostsByCategory(categorySlug);
}

/**
 * 获取特定标签的博客文章
 */
export async function getBlogPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  return blogApi.getBlogPostsByTag(tagSlug);
}

/**
 * 根据slug获取单篇博客文章
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return blogApi.getBlogPostBySlug(slug);
}

/**
 * 获取精选博客文章
 */
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  return blogApi.getFeaturedBlogPosts();
}

/**
 * 获取最新的博客文章
 */
export async function getLatestBlogPosts(count: number = 5): Promise<BlogPost[]> {
  return blogApi.getLatestBlogPosts(count);
}

/**
 * 获取相关博客文章
 */
export async function getRelatedBlogPosts(postSlug: string, count: number = 3): Promise<BlogPost[]> {
  return blogApi.getRelatedBlogPosts(postSlug, count);
}

/**
 * 获取博客归档数据
 */
export async function getBlogArchives(): Promise<{[year: string]: {[month: string]: BlogPost[]}}> {
  return blogApi.getBlogArchives();
}

/**
 * 获取所有标签（带有文章计数）
 */
export async function getTagsWithCount(): Promise<BlogTag[]> {
  return blogApi.getBlogTagsWithCount();
}

/**
 * 获取所有分类（带有文章计数）
 */
export async function getCategoriesWithCount(): Promise<BlogCategory[]> {
  return blogApi.getBlogCategoriesWithCount();
} 