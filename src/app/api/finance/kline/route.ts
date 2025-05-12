import { NextRequest, NextResponse } from 'next/server';
import { getKLineData } from '@/lib/data/china-stock-api';
import logger from '@/lib/logger';

/**
 * GET: 获取股票K线数据
 * 查询参数:
 * - symbol: 股票代码
 * - period: 周期类型('daily', 'weekly', 'monthly', '5min', '15min', '30min', '60min')
 * - count: 获取数量（可选，默认90）
 * - source: 数据源（可选，'sina'或'eastmoney'，默认'eastmoney'）
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' | '5min' | '15min' | '30min' | '60min' || 'daily';
    const count = parseInt(searchParams.get('count') || '90', 10);
    const source = searchParams.get('source') as 'sina' | 'eastmoney' || 'eastmoney';
    
    // 参数验证
    if (!symbol) {
      return NextResponse.json(
        { 
          success: false, 
          message: '缺少股票代码参数' 
        },
        { status: 400 }
      );
    }
    
    // 获取K线数据
    const data = await getKLineData(symbol, period, count, source);
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      meta: {
        symbol,
        period,
        count,
        source
      }
    });
  } catch (error) {
    // 记录错误
    logger.error('获取K线数据失败', error);
    
    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        message: '获取K线数据失败',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
} 