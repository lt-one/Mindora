import { prisma } from '@/lib/db';
import { BlogPost, BlogCategory, BlogTag, BlogAuthor } from '@/types/blog';
import { categories, tags, author } from '@/lib/data/blog';

/**
 * 将Prisma数据模型转换为前端BlogPost类型
 */
function mapBlogPostFromDB(post: any): BlogPost {
  // 解析JSON字段
  const categories = typeof post.categories === 'string'
    ? JSON.parse(post.categories as string) 
    : (post.categories || []);
  
  const tags = typeof post.tags === 'string'
    ? JSON.parse(post.tags as string)
    : (post.tags || []);
  
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content,
    coverImage: post.coverImage || '/images/blog/PlaceImage.png',
    publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
    updatedAt: post.updatedAt?.toISOString() || new Date().toISOString(),
    author: author, // 暂时使用静态作者数据
    categories: categories, // 已正确解析的分类数组
    tags: tags, // 已正确解析的标签数组
    featured: post.isFeatured || false,
    status: post.published ? 'published' : 'draft',
    readingTime: `${Math.ceil(post.content.length / 1000)}分钟`, // 简单估算
    viewCount: post.viewCount || 0,
    toc: [], // 需要从内容生成，目前保持空
    relatedPosts: [], // 暂时保持空，后续可以实现关联文章逻辑
    contentType: post.contentType || 'article',
  };
}

/**
 * 获取所有博客文章
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        // 可添加其他条件，如只获取已发布的文章
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
    
    return posts.map(mapBlogPostFromDB);
  } catch (error) {
    console.error('Error getting all blog posts:', error);
    // 如果数据库操作失败，返回静态数据作为降级方案
    const { allBlogPosts } = await import('@/lib/data/blog');
    return allBlogPosts;
  }
}

/**
 * 获取特定分类的博客文章
 */
export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  try {
    // 查找分类名称
    const category = categories.find(c => c.slug === categorySlug);
    if (!category) return [];

    // 获取所有已发布的博客文章
    const allPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
    });
    
    // 在应用层面过滤包含特定分类的文章
    const filteredPosts = allPosts.filter((post: any) => {
      // 解析JSON字段
      const postCategories = typeof post.categories === 'string'
        ? JSON.parse(post.categories as string)
        : post.categories;
      
      // 检查是否包含指定分类
      return Array.isArray(postCategories) && 
        postCategories.includes(categorySlug);
    });
    
    return filteredPosts.map(mapBlogPostFromDB);
  } catch (error) {
    console.error(`Error getting blog posts by category ${categorySlug}:`, error);
    // 降级方案
    const { allBlogPosts } = await import('@/lib/data/blog');
    return allBlogPosts.filter(post => post.categories.includes(categorySlug));
  }
}

/**
 * 获取特定标签的博客文章
 */
export async function getBlogPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  try {
    // 首先根据slug找到标签名称
    const tag = tags.find(t => t.slug === tagSlug);
    if (!tag) return [];
    
    // 获取所有已发布的博客文章
    const allPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
    });
    
    // 在应用层面过滤包含特定标签的文章
    const filteredPosts = allPosts.filter((post: any) => {
      // 解析JSON字段
      const postTags = typeof post.tags === 'string'
        ? JSON.parse(post.tags as string)
        : post.tags;
      
      // 检查是否包含指定标签
      return Array.isArray(postTags) && 
        postTags.includes(tag.name);
    });
    
    return filteredPosts.map(mapBlogPostFromDB);
  } catch (error) {
    console.error(`Error getting blog posts by tag ${tagSlug}:`, error);
    // 降级方案
    const { allBlogPosts } = await import('@/lib/data/blog');
    const tag = tags.find(t => t.slug === tagSlug);
    if (!tag) return [];
    return allBlogPosts.filter(post => post.tags.includes(tag.name));
  }
}

/**
 * 根据slug获取单篇博客文章
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug: slug,
      },
    });
    
    if (!post) return null;
    
    // 增加浏览次数
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });
    
    return mapBlogPostFromDB(post);
  } catch (error) {
    console.error(`Error getting blog post by slug ${slug}:`, error);
    // 降级方案
    const { allBlogPosts } = await import('@/lib/data/blog');
    return allBlogPosts.find(post => post.slug === slug) || null;
  }
}

/**
 * 获取精选博客文章
 */
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        isFeatured: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
    
    return posts.map(mapBlogPostFromDB);
  } catch (error) {
    console.error('Error getting featured blog posts:', error);
    // 降级方案
    const { allBlogPosts } = await import('@/lib/data/blog');
    return allBlogPosts.filter(post => post.featured);
  }
}

/**
 * 获取最新的博客文章
 */
export async function getLatestBlogPosts(count: number = 5): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: count,
    });
    
    return posts.map(mapBlogPostFromDB);
  } catch (error) {
    console.error(`Error getting latest ${count} blog posts:`, error);
    // 降级方案
    const { allBlogPosts } = await import('@/lib/data/blog');
    return [...allBlogPosts]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, count);
  }
}

/**
 * 获取相关博客文章
 */
export async function getRelatedBlogPosts(postSlug: string, count: number = 3): Promise<BlogPost[]> {
  try {
    // 先获取当前文章
    const currentPost = await prisma.blogPost.findUnique({
      where: { slug: postSlug },
      select: {
        id: true,
        categories: true,
        tags: true,
      },
    });

    if (!currentPost) return [];

    // 将JSON字段解析为实际的JavaScript数组
    const categories = typeof currentPost.categories === 'string' 
      ? JSON.parse(currentPost.categories as string) 
      : currentPost.categories;
    
    const tags = typeof currentPost.tags === 'string'
      ? JSON.parse(currentPost.tags as string)
      : currentPost.tags;

    // 获取所有已发布的博客文章
    const allPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        slug: { not: postSlug }, // 排除当前文章
      },
    });

    // 在应用层面过滤相关文章
    const relatedPosts = allPosts.filter((post: any) => {
      // 解析文章的分类和标签
      const postCategories = typeof post.categories === 'string'
        ? JSON.parse(post.categories as string)
        : post.categories;
      
      const postTags = typeof post.tags === 'string'
        ? JSON.parse(post.tags as string)
        : post.tags;

      // 检查是否有任何重叠的分类或标签
      const hasRelatedCategory = Array.isArray(categories) && Array.isArray(postCategories) &&
        categories.some(cat => postCategories.includes(cat));
      
      const hasRelatedTag = Array.isArray(tags) && Array.isArray(postTags) &&
        tags.some(tag => postTags.includes(tag));

      return hasRelatedCategory || hasRelatedTag;
    });

    // 按照阅读量排序，返回指定数量的文章
    return relatedPosts
      .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, count)
      .map(mapBlogPostFromDB);
  } catch (error) {
    console.error(`Error getting related posts for ${postSlug}:`, error);
    // 降级方案
    const { getRelatedBlogPosts: getRelatedBlogPostsStatic } = await import('@/lib/data/blog');
    return getRelatedBlogPostsStatic(postSlug, count);
  }
}

/**
 * 获取博客归档数据
 */
export async function getBlogArchives(): Promise<{[year: string]: {[month: string]: BlogPost[]}}> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
    
    const archives: {[year: string]: {[month: string]: BlogPost[]}} = {};
    
    posts.map(mapBlogPostFromDB).forEach((post: BlogPost) => {
      const date = new Date(post.publishedAt);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      
      if (!archives[year]) {
        archives[year] = {};
      }
      
      if (!archives[year][month]) {
        archives[year][month] = [];
      }
      
      archives[year][month].push(post);
    });
    
    return archives;
  } catch (error) {
    console.error('Error getting blog archives:', error);
    // 降级方案
    const { getBlogArchives: getBlogArchivesStatic } = await import('@/lib/data/blog');
    return getBlogArchivesStatic();
  }
} 