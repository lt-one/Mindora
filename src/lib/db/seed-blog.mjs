// 使用ESM模块语法
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 硬编码博客文章数据（简化版示例）
const blogPosts = [
  {
    id: '1',
    title: 'Next.js 14深度解析：新特性与最佳实践',
    slug: 'nextjs-14-deep-dive',
    excerpt: 'Next.js 14带来了哪些改进？本文深度解析其新特性、性能优化和开发体验提升，并提供实用的最佳实践指南。',
    content: '# Next.js 14深度解析：新特性与最佳实践\n\n这是一篇关于Next.js 14的文章内容...',
    coverImage: '/images/blog/nextjs-14/cover.jpg',
    status: 'published',
    publishedAt: '2023-10-28T09:00:00Z',
    updatedAt: '2023-10-30T11:30:00Z',
    featured: true,
    viewCount: 1250,
    likeCount: 78,
    categories: ['frontend-development', 'react-ecosystem'],
    tags: ['React', 'Next.js', '服务端渲染', '前端架构']
  },
  {
    id: '2',
    title: 'TypeScript与React：完美结合的前端开发体验',
    slug: 'typescript-with-react',
    excerpt: '探索TypeScript如何提升React开发体验，从类型安全到开发效率，全方位解析TS+React的最佳实践。',
    content: '# TypeScript与React：完美结合的前端开发体验\n\n这是一篇关于TypeScript和React的文章内容...',
    coverImage: '/images/blog/typescript-react/cover.jpg',
    status: 'published',
    publishedAt: '2023-09-15T10:00:00Z',
    updatedAt: '2023-09-18T14:20:00Z',
    featured: false,
    viewCount: 980,
    likeCount: 45,
    categories: ['frontend-development', 'react-ecosystem'],
    tags: ['TypeScript', 'React', '前端架构', '状态管理']
  }
];

/**
 * 将硬编码的博客文章数据添加到数据库中
 */
async function seedBlogPosts() {
  console.log('开始向数据库添加博客文章...');

  try {
    // 创建计数器
    let created = 0;
    let updated = 0;
    let skipped = 0;

    // 对每篇文章进行处理
    for (const post of blogPosts) {
      // 检查文章是否已经存在（通过slug检查）
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
      });

      if (existingPost) {
        // 如果文章已存在则更新
        await prisma.blogPost.update({
          where: { id: existingPost.id },
          data: {
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            tags: JSON.stringify(post.tags), // 将数组转换为JSON字符串
            categories: JSON.stringify(post.categories), // 将数组转换为JSON字符串
            publishedAt: new Date(post.publishedAt),
            updatedAt: new Date(post.updatedAt || post.publishedAt),
            published: post.status === 'published',
            isFeatured: post.featured,
            viewCount: post.viewCount || 0,
            likeCount: post.likeCount || 0,
          },
        });
        updated++;
        console.log(`更新文章: ${post.title}`);
      } else {
        // 如果文章不存在则创建
        await prisma.blogPost.create({
          data: {
            id: post.id,
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            tags: JSON.stringify(post.tags), // 将数组转换为JSON字符串
            categories: JSON.stringify(post.categories), // 将数组转换为JSON字符串
            publishedAt: new Date(post.publishedAt),
            updatedAt: new Date(post.updatedAt || post.publishedAt),
            published: post.status === 'published',
            isFeatured: post.featured,
            viewCount: post.viewCount || 0,
            likeCount: post.likeCount || 0,
            // 以下字段需要设置默认值
            userId: "user1", // 假设有一个默认用户ID
          },
        });
        created++;
        console.log(`创建文章: ${post.title}`);
      }
    }

    console.log(`博客文章填充完成! 创建: ${created}, 更新: ${updated}, 跳过: ${skipped}`);
    return { created, updated, skipped };
  } catch (error) {
    console.error('填充博客文章时出错:', error);
    throw error;
  } finally {
    // 关闭Prisma连接
    await prisma.$disconnect();
  }
}

// 执行种子函数
seedBlogPosts()
  .then(() => {
    console.log('种子脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('种子脚本执行失败:', error);
    process.exit(1);
  }); 