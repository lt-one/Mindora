/**
 * 好站分享API路由
 */
import { NextRequest, NextResponse } from 'next/server';
import { getGoodSites, getGoodSiteCategories, getGoodSiteStats } from '@/lib/api/good-sites';

/**
 * GET请求处理程序
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // 获取查询参数
    const category = searchParams.get('category') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const featured = searchParams.has('featured') 
      ? searchParams.get('featured') === 'true' 
      : undefined;
    const stats = searchParams.has('stats') 
      ? searchParams.get('stats') === 'true' 
      : false;
    const categories = searchParams.has('categories') 
      ? searchParams.get('categories') === 'true' 
      : false;
    
    // 根据请求参数决定返回的数据
    if (stats) {
      const statsData = await getGoodSiteStats();
      return NextResponse.json({ success: true, data: statsData });
    }
    
    if (categories) {
      const categoriesData = await getGoodSiteCategories();
      return NextResponse.json({ success: true, data: categoriesData });
    }
    
    // 获取站点数据
    const sites = await getGoodSites({ category, tag, featured });
    
    return NextResponse.json({
      success: true,
      data: sites,
    });
  } catch (error) {
    console.error('获取好站数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取好站数据失败' },
      { status: 500 }
    );
  }
} 