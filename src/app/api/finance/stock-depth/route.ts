import { NextRequest, NextResponse } from 'next/server';
import { getOrderBookDepth } from '@/lib/data/china-stock-api';
import logger from '@/lib/logger';

/**
 * GET: 获取股票盘口深度数据
 * 查询参数:
 * - symbol: 股票代码
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    
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
    
    try {
      // 获取盘口深度数据
      const data = await getOrderBookDepth(symbol);
      
      // 是否为历史数据
      const isHistoricalData = data.isHistoricalData || false;
      
      // 是否有数据
      const hasData = data.bids.length > 0 || data.asks.length > 0;
      
      // 返回数据，包括是否为历史数据的标记
      return NextResponse.json({
        success: true,
        data: {
          bids: data.bids,
          asks: data.asks,
          timestamp: data.timestamp || new Date().toISOString(),
          isHistoricalData
        },
        timestamp: new Date().toISOString(),
        meta: {
          symbol,
          bidCount: data.bids.length,
          askCount: data.asks.length,
          hasData,
          isHistoricalData
        },
        message: !hasData 
          ? `股票${symbol}当前没有可用的盘口深度数据，可能原因：非交易时段或该股票暂无盘口数据` 
          : isHistoricalData 
            ? `由于当前不在交易时段，显示的是${symbol}最后交易时段的盘口数据` 
            : undefined
      });
    } catch (apiError) {
      // 处理API错误
      const errorMessage = (apiError as Error).message || `获取股票${symbol}盘口深度数据失败`;
      logger.warn(`API错误: ${errorMessage}`, apiError);
      
      // 返回空数据而不是错误
      return NextResponse.json({
        success: true,
        data: { 
          bids: [], 
          asks: [],
          isHistoricalData: false
        },
        timestamp: new Date().toISOString(),
        meta: {
          symbol,
          bidCount: 0,
          askCount: 0,
          hasData: false,
          isHistoricalData: false
        },
        message: errorMessage
      });
    }
  } catch (error) {
    // 记录错误
    logger.error('获取盘口深度数据失败', error);
    
    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        message: '获取盘口深度数据失败',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
} 