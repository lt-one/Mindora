/**
 * 博客文章管理API路由 - 单篇文章操作
 */
import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/api/admin/blog';

interface Params {
  params: {
    id: string
  }
}

/**
 * GET: 获取单篇博客文章
 */
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const postId = params.id;
    const post = await getBlogPostById(postId);
    
    if (!post) {
      return NextResponse.json(
        { error: '找不到博客文章' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('获取博客文章详情失败:', error);
    return NextResponse.json(
      { error: '获取文章详情失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT: 更新博客文章
 */
export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    const data = await request.json();
    
    // 验证必需字段
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json(
        { error: '标题、slug和内容为必填字段' },
        { status: 400 }
      );
    }
    
    // 更新文章
    const postId = params.id;
    const updatedPost = await updateBlogPost(postId, data);
    
    return NextResponse.json({ post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('更新博客文章失败:', error);
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 删除博客文章
 */
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const postId = params.id;
    const success = await deleteBlogPost(postId);
    
    if (!success) {
      return NextResponse.json(
        { error: '删除博客文章失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: '博客文章已成功删除' },
      { status: 200 }
    );
  } catch (error) {
    console.error('删除博客文章失败:', error);
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    );
  }
} 