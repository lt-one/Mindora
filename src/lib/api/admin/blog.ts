/**
 * 博客文章管理API函数
 */
import { prisma } from '@/lib/db/prisma';
import { BlogPost, BlogPostCreateInput, BlogPostUpdateInput } from '@/types/blog';
import { mapBlogPostFromDB } from '@/lib/api/blog';

/**
 * 创建新博客文章
 * @param data 文章数据
 * @param userId 创建者ID
 * @returns 创建的博客文章
 */
export async function createBlogPost(data: BlogPostCreateInput, userId: string): Promise<BlogPost> {
  try {
    // 确保tags和categories是数组形式，并且正确序列化为JSON字符串
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const categories = Array.isArray(data.categories) ? data.categories : [];
    
    // 准备数据，确保JSON字段正确格式化
    const createData = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || '',
      tags: JSON.stringify(tags),
      categories: JSON.stringify(categories),
      published: data.status === 'published',
      isFeatured: data.featured || false,
      publishedAt: data.status === 'published' ? new Date() : null,
      userId: data.authorId || userId, // 使用指定的作者ID或当前用户ID
    };
    
    console.log('创建博客文章:', createData);
    
    const post = await prisma.blogPost.create({
      data: createData,
    });
    
    return mapBlogPostFromDB(post);
  } catch (error) {
    console.error('创建博客文章失败:', error);
    throw new Error('创建博客文章失败');
  }
}

/**
 * 更新博客文章
 * @param id 文章ID
 * @param data 更新的数据
 * @returns 更新后的博客文章
 */
export async function updateBlogPost(id: string, data: BlogPostUpdateInput): Promise<BlogPost> {
  try {
    // 查找文章是否存在
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });
    
    if (!existingPost) {
      throw new Error('博客文章不存在');
    }
    
    // 准备更新数据
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.authorId !== undefined) updateData.userId = data.authorId; // 更新作者ID
    
    if (data.tags !== undefined) {
      updateData.tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags;
    }
    
    if (data.categories !== undefined) {
      updateData.categories = Array.isArray(data.categories) ? JSON.stringify(data.categories) : data.categories;
    }
    
    if (data.status !== undefined) {
      updateData.published = data.status === 'published';
      
      // 如果从草稿变为已发布，更新发布时间
      if (data.status === 'published' && !existingPost.published) {
        updateData.publishedAt = new Date();
      }
    }
    
    if (data.featured !== undefined) updateData.isFeatured = data.featured;
    
    // 执行更新
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });
    
    return mapBlogPostFromDB(updatedPost);
  } catch (error) {
    console.error('更新博客文章失败:', error);
    throw new Error('更新博客文章失败');
  }
}

/**
 * 删除博客文章
 * @param id 文章ID
 * @returns 操作是否成功
 */
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    await prisma.blogPost.delete({
      where: { id },
    });
    
    return true;
  } catch (error) {
    console.error('删除博客文章失败:', error);
    return false;
  }
}

/**
 * 获取博客文章草稿
 * @returns 博客文章草稿列表
 */
export async function getDraftBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: false,
      },
      orderBy: {
        updatedAt: 'desc',
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
    console.error('获取博客草稿失败:', error);
    return [];
  }
}

/**
 * 根据ID获取博客文章
 * @param id 文章ID
 * @returns 博客文章或null
 */
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        id: id,
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
    
    return mapBlogPostFromDB(post);
  } catch (error) {
    console.error(`获取博客文章(ID:${id})失败:`, error);
    return null;
  }
}

/**
 * 获取所有博客文章（包含草稿，仅管理员使用）
 * @returns 所有博客文章
 */
export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        updatedAt: 'desc',
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
    console.error('获取所有博客文章失败:', error);
    return [];
  }
}

/**
 * 获取所有现有的博客标签
 * @returns 标签列表
 */
export async function getAllBlogTags(): Promise<string[]> {
  try {
    // 获取所有博客文章
    const posts = await prisma.blogPost.findMany({
      select: {
        tags: true,
      },
    });
    
    // 提取所有标签并去重
    const allTags = new Set<string>();
    
    posts.forEach(post => {
      const tags = typeof post.tags === 'string'
        ? JSON.parse(post.tags as string)
        : post.tags || [];
      
      tags.forEach((tag: string) => allTags.add(tag));
    });
    
    return Array.from(allTags).sort();
  } catch (error) {
    console.error('获取博客标签失败:', error);
    return [];
  }
}

/**
 * 获取所有现有的博客分类
 * @returns 分类列表
 */
export async function getAllBlogCategories(): Promise<string[]> {
  try {
    // 获取所有博客文章
    const posts = await prisma.blogPost.findMany({
      select: {
        categories: true,
      },
    });
    
    // 提取所有分类并去重
    const allCategories = new Set<string>();
    
    posts.forEach(post => {
      const categories = typeof post.categories === 'string'
        ? JSON.parse(post.categories as string)
        : post.categories || [];
      
      categories.forEach((category: string) => allCategories.add(category));
    });
    
    return Array.from(allCategories).sort();
  } catch (error) {
    console.error('获取博客分类失败:', error);
    return [];
  }
}

/**
 * 获取所有可用的作者列表
 * @returns 作者列表
 */
export async function getAllAuthors() {
  try {
    const authors = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return authors;
  } catch (error) {
    console.error('获取作者列表失败:', error);
    return [];
  }
} 