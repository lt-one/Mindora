// 此文件用于执行Prisma种子脚本
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

/**
 * 创建测试用户
 */
async function seedUser() {
  console.log('开始创建测试用户...');

  // 检查用户是否已存在
  const existingUser = await prisma.user.findFirst({
    where: { id: 'user1' },
  });

  if (existingUser) {
    console.log('测试用户已存在，跳过创建');
    return existingUser;
  }

  // 创建测试用户
  const user = await prisma.user.create({
    data: {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // 注意：实际应用中应使用加密密码
      image: '/images/avatars/default.png',
    },
  });

  console.log('测试用户创建成功');
  return user;
}

/**
 * 创建博客文章
 */
async function seedBlogPosts() {
  const user = await seedUser();
  console.log('开始向数据库添加博客文章...');

  // 示例博客文章数据
  const blogPosts = [
    {
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
          tags: post.tags,
          categories: post.categories,
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
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          tags: post.tags,
          categories: post.categories,
          publishedAt: new Date(post.publishedAt),
          updatedAt: new Date(post.updatedAt || post.publishedAt),
          published: post.status === 'published',
          isFeatured: post.featured,
          viewCount: post.viewCount || 0,
          likeCount: post.likeCount || 0,
          userId: user.id,
        },
      });
      created++;
      console.log(`创建文章: ${post.title}`);
    }
  }

  console.log(`博客文章填充完成! 创建: ${created}, 更新: ${updated}, 跳过: ${skipped}`);
}

async function main() {
  try {
    await seedBlogPosts();
  } catch (error) {
    console.error('种子脚本执行失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('所有种子脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('执行失败:', error);
    process.exit(1);
  }); 