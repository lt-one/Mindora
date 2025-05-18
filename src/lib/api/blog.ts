import { TOCItem } from '@/types/blog';
import { prisma } from '@/lib/db';
import { BlogPost, BlogCategory, BlogTag, BlogAuthor } from '@/types/blog';
import { categories, tags, author } from '@/lib/data/blog';
import { parseTOC } from '@/lib/markdown-utils';

/**
 * 将Prisma数据模型转换为前端BlogPost类型
 */
function mapBlogPostFromDB(post: any): BlogPost {
  try {
    // 如果post为null或undefined，返回fallback数据
    if (!post) {
      console.warn('mapBlogPostFromDB: 收到空数据');
      return {
        id: 'fallback-1',
        title: '占位文章',
        slug: 'placeholder-post',
        excerpt: '此文章为临时占位内容',
        content: '# 占位内容\n\n此文章为临时占位内容，将在数据库正常加载后替换。',
        coverImage: '/images/blog/PlaceImage.png',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: author,
        categories: [],
        tags: [],
        featured: false,
        status: 'published',
        readingTime: '1分钟',
        viewCount: 0,
        toc: [],
        relatedPosts: [],
        contentType: 'article',
      };
    }
    
    // 解析JSON字段 - 更健壮地处理
    let postCategories: string[] = [];
    try {
      if (typeof post.categories === 'string') {
        postCategories = JSON.parse(post.categories as string);
      } else if (Array.isArray(post.categories)) {
        postCategories = post.categories;
      }
    } catch (e) {
      console.warn('解析博客文章分类时出错:', e);
    }
    
    let postTags: string[] = [];
    try {
      if (typeof post.tags === 'string') {
        postTags = JSON.parse(post.tags as string);
      } else if (Array.isArray(post.tags)) {
        postTags = post.tags;
      }
    } catch (e) {
      console.warn('解析博客文章标签时出错:', e);
    }
    
    // 处理作者信息
    let authorInfo: BlogAuthor;
    
    if (post.user) {
      // 如果有关联的用户信息，使用它
      authorInfo = {
        id: post.user.id,
        name: post.user.name,
        avatar: post.user.image || '/images/avatars/default.png',
        bio: post.user.bio || '',
        email: post.user.email
      };
    } else {
      // 使用静态作者数据作为后备
      authorInfo = author;
    }
    
    // 文章内容长度检查
    const content = post.content || '';
    
    // 计算阅读时间
    const readingTime = content 
      ? `${Math.max(1, Math.ceil(content.length / 1000))}分钟`
      : '1分钟';
    
    // 从内容中生成目录结构
    console.log(`[TOC] 开始解析文章"${post.title}"的目录结构`);
    console.log(`[TOC] 内容前50个字符: ${content.substring(0, 50)}...`);
    
    // 确保内容是Markdown格式，如果内容不是Markdown格式，尝试格式化成Markdown
    let markdownContent = content;
    if (content.indexOf('#') === -1 && content.indexOf('<h') !== -1) {
      console.log('[TOC] 内容中未找到Markdown标题，但找到了HTML标题，将进行格式转换');
      // 没有Markdown标题但有HTML标题，尝试转换
      // 注意：这只是一个简单的转换，可能不适用于所有情况
      markdownContent = content;
    }
    
    // 确保文章至少有一个标题
    if (!markdownContent.match(/^\s*#+ |^\s*<h[1-6]/m)) {
      console.log('[TOC] 文章内容中未找到任何标题格式，将添加默认标题');
      markdownContent = `# ${post.title}\n\n${markdownContent}`;
    }
    
    const toc = parseTOC(markdownContent);
    console.log(`[TOC] 解析完成，生成了${toc.length}个顶级标题项`);
    if (toc.length > 0) {
      console.log(`[TOC] 第一个标题: ${toc[0].text} (id: ${toc[0].id}, level: ${toc[0].level})`);
    } else {
      console.warn('[TOC] 警告：未生成任何目录项');
    }
    
    return {
      id: post.id,
      title: post.title || '无标题文章',
      slug: post.slug || `post-${post.id}`,
      excerpt: post.excerpt || '',
      content: content,
      coverImage: post.coverImage || '/images/blog/PlaceImage.png',
      publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
      updatedAt: post.updatedAt?.toISOString() || new Date().toISOString(),
      author: authorInfo,
      categories: postCategories,
      tags: postTags,
      featured: post.isFeatured || false,
      status: post.published ? 'published' : 'draft',
      readingTime: readingTime,
      viewCount: post.viewCount || 0,
      toc: toc, // 使用从内容中提取的目录
      relatedPosts: [], // 暂时保持空，后续可以实现关联文章逻辑
      contentType: post.contentType || 'article',
    };
  } catch (error) {
    console.error('映射博客文章数据时出错:', error);
    // 返回fallback数据
    return {
      id: `error-${Date.now()}`,
      title: '数据加载错误',
      slug: 'error-loading-post',
      excerpt: '加载文章数据时出错',
      content: '# 数据加载错误\n\n尝试获取文章数据时发生错误，请稍后再试。',
      coverImage: '/images/blog/PlaceImage.png',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: author,
      categories: [],
      tags: [],
      featured: false,
      status: 'published',
      readingTime: '1分钟',
      viewCount: 0,
      toc: [],
      relatedPosts: [],
      contentType: 'article',
    };
  }
}

// 导出该函数供管理API使用
export { mapBlogPostFromDB };

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
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true
          }
        }
      }
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
    // 获取所有已发布的博客文章
    const allPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true
          }
        }
      }
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
    // 获取所有已发布的博客文章
    const allPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true
          }
        }
      }
    });
    
    // 在应用层面过滤包含特定标签的文章 (现在是 tagSlug)
    const filteredPosts = allPosts.filter((dbPost: any) => {
      // 解析JSON字段
      const postTags = typeof dbPost.tags === 'string'
        ? JSON.parse(dbPost.tags as string)
        : dbPost.tags;
      
      // 检查是否包含指定标签 slug
      return Array.isArray(postTags) && 
        postTags.includes(tagSlug);
    });
    
    return filteredPosts.map(mapBlogPostFromDB);
  } catch (error) {
    console.error(`Error getting blog posts by tag ${tagSlug}:`, error);
    // 降级方案
    const { allBlogPosts, tags: staticTagsFallback } = await import('@/lib/data/blog');
    return allBlogPosts.filter(post => 
      (post.tags as string[]).includes(tagSlug)
    );
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
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true
          }
        }
      }
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
    console.log('正在获取精选博客文章...');
    
    // 检查是否存在isFeatured字段
    const dbInfo = await prisma.blogPost.findFirst();
    const hasIsFeatured = dbInfo && 'isFeatured' in dbInfo;
    
    let posts;
    if (hasIsFeatured) {
      // 如果数据库中有isFeatured字段，使用它进行查询
      posts = await prisma.blogPost.findMany({
        where: {
          published: true,
          isFeatured: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              bio: true
            }
          }
        }
      });
    } else {
      // 如果没有isFeatured字段，获取指定数量的最新文章作为特色文章
      posts = await prisma.blogPost.findMany({
        where: {
          published: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: 4, // 取前4篇文章作为精选
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              bio: true
            }
          }
        }
      });
    }
    
    console.log(`获取到 ${posts.length} 篇精选博客文章`);
    return posts.map(mapBlogPostFromDB);
  } catch (error) {
    console.error('获取精选博客文章失败:', error);
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
    console.log(`正在获取最新 ${count} 篇博客文章...`);
    
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: count,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true
          }
        }
      }
    });
    
    console.log(`获取到 ${posts.length} 篇最新博客文章`);
    return posts.map(mapBlogPostFromDB);
  } catch (error) {
    console.error(`获取最新 ${count} 篇博客文章失败:`, error);
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

/**
 * 获取所有博客标签及其使用次数
 * @returns 带有次数信息的标签对象数组
 */
export async function getBlogTagsWithCount(): Promise<BlogTag[]> {
  try {
    // 获取所有博客文章
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        tags: true,
      },
    });
    
    // 创建标签及其计数的映射
    const tagCount: Record<string, number> = {};
    
    posts.forEach(post => {
      const tags = typeof post.tags === 'string'
        ? JSON.parse(post.tags as string)
        : post.tags || [];
      
      if (Array.isArray(tags)) {
        tags.forEach((tag: string) => {
          if (tagCount[tag]) {
            tagCount[tag]++;
          } else {
            tagCount[tag] = 1;
          }
        });
      }
    });
    
    // 将标签映射转换为标签对象数组
    const tagsWithCount: BlogTag[] = Object.entries(tagCount).map(([name, count], index) => {
      // 创建slug (将标签名称转换为小写，空格替换为连字符)
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      
      // 为标签生成一个随机颜色
      const colors = ['#f7df1e', '#3178c6', '#61dafb', '#000000', '#264de4', '#06b6d4', 
                      '#f9a03c', '#aa314d', '#4caf50', '#9c27b0', '#ff5722', '#03a9f4'];
      const color = colors[index % colors.length];
      
      return {
        id: (index + 1).toString(),
        name,
        slug,
        count,
        color
      };
    });
    
    // 按文章数量排序（降序）
    return tagsWithCount.sort((a, b) => (b.count || 0) - (a.count || 0));
  } catch (error) {
    console.error('获取博客标签及计数失败:', error);
    // 降级方案，返回静态定义的标签数据
    const { tags: staticTags } = await import('@/lib/data/blog');
    return staticTags;
  }
}

/**
 * 获取所有博客分类及其使用次数
 * @returns 带有次数信息的分类对象数组
 */
export async function getBlogCategoriesWithCount(): Promise<BlogCategory[]> {
  try {
    // 获取所有博客文章
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        categories: true,
      },
    });
    
    // 创建分类及其计数的映射
    const categoryCount: Record<string, number> = {};
    
    posts.forEach(post => {
      const categories = typeof post.categories === 'string'
        ? JSON.parse(post.categories as string)
        : post.categories || [];
      
      if (Array.isArray(categories)) {
        categories.forEach((category: string) => {
          if (categoryCount[category]) {
            categoryCount[category]++;
          } else {
            categoryCount[category] = 1;
          }
        });
      }
    });
    
    // 将分类映射转换为分类对象数组
    const categoriesWithCount: BlogCategory[] = Object.entries(categoryCount).map(([slug, count], index) => {
      // 创建显示名称 (将slug转换为更易读的格式)
      const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      return {
        id: (index + 1).toString(),
        name,
        slug,
        description: `关于${name}的文章集合`,
        count,
        order: index + 1
      };
    });
    
    // 按文章数量排序（降序）
    return categoriesWithCount.sort((a, b) => (b.count || 0) - (a.count || 0));
  } catch (error) {
    console.error('获取博客分类及计数失败:', error);
    // 降级方案，返回静态定义的分类数据
    const { categories: staticCategories } = await import('@/lib/data/blog');
    return staticCategories;
  }
} 