/**
 * 博客分类和标签API路由
 */
import { NextResponse } from 'next/server';
import { getAllBlogTags, getAllBlogCategories } from '@/lib/api/admin/blog';

/**
 * GET: 获取博客分类和标签
 */
export async function GET() {
  try {
    // 并行获取标签和分类
    const [tags, categories] = await Promise.all([
      getAllBlogTags(),
      getAllBlogCategories()
    ]);
    
    return NextResponse.json({ 
      success: true,
      data: { tags, categories } 
    }, { status: 200 });
  } catch (error) {
    console.error('获取分类和标签失败:', error);
    return NextResponse.json(
      { success: false, error: '获取分类和标签失败' },
      { status: 500 }
    );
  }
} 