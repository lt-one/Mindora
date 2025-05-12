import { NextResponse } from 'next/server';
import { getMarketOverview } from '@/lib/data/china-stock-api';
import logger from '@/lib/logger';

/**
 * GET: 获取市场概览数据
 * 返回主要指数和热门股票的实时数据
 */
export async function GET() {
  try {
    // 获取市场概览数据
    const data = await getMarketOverview();
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // 记录错误
    logger.error('获取市场概览数据失败', error);
    
    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        message: '获取市场数据失败',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
} 