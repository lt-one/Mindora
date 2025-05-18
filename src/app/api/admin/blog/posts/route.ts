/**
 * 博客文章管理API路由
 */
import { NextRequest, NextResponse } from 'next/server';
import { createBlogPost, getAllBlogPostsForAdmin, getDraftBlogPosts } from '@/lib/api/admin/blog';
import { prisma } from '@/lib/db/prisma';

/**
 * GET: 获取博客文章列表（包括草稿）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const draftsOnly = searchParams.get('drafts') === 'true';
    
    let posts;
    if (draftsOnly) {
      posts = await getDraftBlogPosts();
    } else {
      posts = await getAllBlogPostsForAdmin();
    }
    
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('博客文章管理API错误:', error);
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    );
  }
}

/**
 * POST: 创建新博客文章
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 验证必需字段
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json(
        { error: '标题、slug和内容为必填字段' },
        { status: 400 }
      );
    }
    
    // 获取一个有效的用户ID（当没有指定作者时使用）
    let userId = data.authorId;
    
    if (!userId) {
      const adminUser = await prisma.user.findFirst({
        where: {
          role: 'admin',
        },
        select: {
          id: true,
        }
      });
      
      if (!adminUser) {
        return NextResponse.json(
          { error: '找不到有效的管理员用户' },
          { status: 500 }
        );
      }
      
      userId = adminUser.id;
    }
    
    const post = await createBlogPost(data, userId);
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('创建博客文章失败:', error);
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    );
  }
} 