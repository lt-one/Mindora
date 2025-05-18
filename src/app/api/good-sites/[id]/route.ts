/**
 * 单个好站API路由
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { incrementSiteViewCount } from '@/lib/api/good-sites';

/**
 * GET请求处理程序 - 获取单个站点信息
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 获取站点数据
    const site = await prisma.goodSite.findUnique({
      where: { id },
    });
    
    if (!site) {
      return NextResponse.json(
        { success: false, error: '站点不存在' },
        { status: 404 }
      );
    }
    
    // 异步增加访问计数，不等待结果
    incrementSiteViewCount(id).catch(err => 
      console.error(`访问计数更新失败: ${err.message}`)
    );
    
    const responseData = {
      id: site.id,
      name: site.name,
      url: site.url,
      description: site.description,
      shortDesc: site.shortDesc,
      logo: '',
      useCases: site.useCases,
      experience: site.experience,
      tags: site.tags,
      screenshots: site.screenshots,
      category: site.category,
      isFree: site.isFree,
      hasPremium: site.hasPremium,
      rating: site.rating,
      featured: site.featured,
      viewCount: site.viewCount,
      relatedSites: site.relatedSites,
      tips: site.tips,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt
    };
    
    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('获取站点数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取站点数据失败' },
      { status: 500 }
    );
  }
} 