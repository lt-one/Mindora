import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote, getMultipleStockQuotes } from '@/lib/data/china-stock-api';
import logger from '@/lib/logger';

/**
 * GET: 获取股票行情数据
 * 查询参数:
 * - symbol: 股票代码（单个或多个，用逗号分隔）
 * - source: 数据源（可选，'sina'或'eastmoney'，默认'eastmoney'）
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const symbolParam = searchParams.get('symbol');
    const source = (searchParams.get('source') as 'sina' | 'eastmoney') || 'eastmoney';
    
    // 参数验证
    if (!symbolParam) {
      return NextResponse.json(
        { 
          success: false, 
          message: '缺少股票代码参数' 
        },
        { status: 400 }
      );
    }
    
    // 处理多个股票代码的情况
    if (symbolParam.includes(',')) {
      const symbols = symbolParam.split(',').map(s => s.trim());
      const data = await getMultipleStockQuotes(symbols, source);
      
      return NextResponse.json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      });
    } 
    // 处理单个股票代码的情况
    else {
      const data = await getStockQuote(symbolParam, source);
      
      return NextResponse.json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // 记录错误
    logger.error('获取股票行情数据失败', error);
    
    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        message: '获取股票行情数据失败',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
} 