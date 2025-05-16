import { NextRequest, NextResponse } from 'next/server';
import * as blogApi from '@/lib/api/blog';

// 更新接口定义以匹配Next.js 15的类型要求
interface Params {
  slug: string;
}

export async function GET(
  request: NextRequest, 
  { params }: { params: Params }
) {
  try {
    const { slug } = params;
    
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const relatedCount = searchParams.get('related_count');
    
    // 获取文章数据
    const post = await blogApi.getBlogPostBySlug(slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // 获取相关文章
    const relatedPosts = await blogApi.getRelatedBlogPosts(
      slug,
      relatedCount ? parseInt(relatedCount) : 3
    );
    
    return NextResponse.json({
      post,
      relatedPosts,
    }, { status: 200 });
  } catch (error) {
    console.error(`Error in blog post API for slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 