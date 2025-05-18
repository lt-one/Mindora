import { PrismaClient } from '@prisma/client';
import { blogPosts as staticBlogPosts, moreBlogPosts as staticMoreBlogPosts, author as staticAuthor, tags as staticTagsConfig } from '@/lib/data/blog'; // 导入静态标签配置
import { BlogPost as SeedBlogPost } from '@/types/blog';

const prisma = new PrismaClient();

// 创建从标签名到 slug 的映射
const tagNameToSlugMap: { [key: string]: string } = {};
staticTagsConfig.forEach(tag => {
  tagNameToSlugMap[tag.name] = tag.slug;
});

// 将标签名数组转换为 slug 数组的辅助函数
const convertTagNamesToSlugs = (tagNames: string[] | undefined): string[] => {
  if (!Array.isArray(tagNames)) return [];
  return tagNames.map(name => tagNameToSlugMap[name] || name.toLowerCase().replace(/ /g, '-')).filter(slug => slug);
};

/**
 * 将硬编码的博客文章数据添加到数据库中
 */
export async function seedBlogPosts() {
  console.log('开始向数据库添加博客文章...');

  // 合并所有硬编码的博客文章
  const allPosts = [...staticBlogPosts, ...staticMoreBlogPosts];

  try {
    // 创建计数器
    let created = 0;
    let updated = 0;
    const skipped = 0;

    // 检查默认用户是否存在，如不存在则创建
    let defaultUser = await prisma.user.findFirst({
      where: { id: 'user1' },
    });
    
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          id: 'user1',
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123', // 注意：实际应用中应使用加密密码
          image: '/images/avatars/default.png',
        },
      });
      console.log('创建默认用户成功');
    }

    // 对每篇文章进行处理
    for (const post of allPosts) {
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
            tags: JSON.stringify(convertTagNamesToSlugs(post.tags as string[])), // 转换为 slug 数组
            categories: JSON.stringify(post.categories), // 假设 categories 已经是 slug 数组
            publishedAt: new Date(post.publishedAt),
            updatedAt: new Date(post.updatedAt || post.publishedAt),
            published: post.status === 'published',
            isFeatured: post.featured,
            viewCount: post.viewCount || 0,
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
            tags: JSON.stringify(convertTagNamesToSlugs(post.tags as string[])), // 转换为 slug 数组
            categories: JSON.stringify(post.categories), // 假设 categories 已经是 slug 数组
            publishedAt: new Date(post.publishedAt),
            updatedAt: new Date(post.updatedAt || post.publishedAt),
            published: post.status === 'published',
            isFeatured: post.featured,
            viewCount: post.viewCount || 0,
            // 以下字段需要设置默认值
            userId: defaultUser.id, // 使用默认用户ID
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
  }
}

// 如果直接运行此文件，执行种子函数
if (require.main === module) {
  seedBlogPosts()
    .then(() => {
      console.log('种子脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('种子脚本执行失败:', error);
      process.exit(1);
    });
} 