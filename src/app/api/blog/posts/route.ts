import { NextRequest, NextResponse } from 'next/server';
import * as blogApi from '@/lib/api/blog';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const latest = searchParams.get('latest');
    const count = searchParams.get('count');
    
    // 如果请求的是计数，返回文章总数
    if (count === 'true') {
      const postCount = await prisma.blogPost.count({
        where: {
          published: true,
        },
      });
      
      return NextResponse.json({
        success: true,
        data: { count: postCount }
      }, { status: 200 });
    }
    
    let posts;
    
    // 根据不同参数调用相应API
    if (featured === 'true') {
      posts = await blogApi.getFeaturedBlogPosts();
    } else if (latest === 'true') {
      posts = await blogApi.getLatestBlogPosts(count ? parseInt(count) : 5);
    } else if (category) {
      posts = await blogApi.getBlogPostsByCategory(category);
    } else if (tag) {
      posts = await blogApi.getBlogPostsByTag(tag);
    } else {
      posts = await blogApi.getAllBlogPosts();
    }
    
    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch (error) {
    console.error('Error in blog posts API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 