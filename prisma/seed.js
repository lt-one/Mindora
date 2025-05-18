// 此文件用于执行Prisma种子脚本
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

// 从 src/lib/data/blog.ts 导入静态数据（注意路径调整和模块系统差异）
// 这是简化的导入，实际项目中可能需要更复杂的处理来共享TS和JS模块间的数据
// 这里我们直接在脚本内部定义一个 minimalTagsMap 来辅助转换
const staticTags = [
  { id: '1', name: 'JavaScript', slug: 'javascript', color: '#f7df1e', count: 6 },
  { id: '2', name: 'TypeScript', slug: 'typescript', color: '#3178c6', count: 5 },
  { id: '3', name: 'React', slug: 'react', color: '#61dafb', count: 7 },
  { id: '4', name: 'Next.js', slug: 'nextjs', color: '#000000', count: 4 },
  { id: '5', name: 'CSS', slug: 'css', color: '#264de4', count: 3 },
  { id: '6', name: 'Tailwind CSS', slug: 'tailwind-css', color: '#06b6d4', count: 5 },
  { id: '7', name: 'D3.js', slug: 'd3js', color: '#f9a03c', count: 2 },
  { id: '8', name: 'ECharts', slug: 'echarts', color: '#aa314d', count: 3 },
  { id: '9', name: '性能优化', slug: '性能优化', color: '#4caf50', count: 2 }, // slug 可能需要调整为英文
  { id: '10', name: '前端架构', slug: '前端架构', color: '#9c27b0', count: 3 }, // slug 可能需要调整为英文
  { id: '11', name: '状态管理', slug: '状态管理', color: '#ff5722', count: 4 }, // slug 可能需要调整为英文
  { id: '12', name: '服务端渲染', slug: '服务端渲染', color: '#03a9f4', count: 2 }, // slug 可能需要调整为英文
];

const tagNameToSlugMap = staticTags.reduce((acc, tag) => {
  acc[tag.name] = tag.slug;
  return acc;
}, {});

const convertTagNamesToSlugs = (tagNames) => {
  if (!Array.isArray(tagNames)) return [];
  return tagNames.map(name => tagNameToSlugMap[name] || name.toLowerCase().replace(/ /g, '-')).filter(slug => slug);
};

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
          tags: JSON.stringify(convertTagNamesToSlugs(post.tags)),
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
          tags: JSON.stringify(convertTagNamesToSlugs(post.tags)),
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