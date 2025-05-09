import { NextRequest, NextResponse } from 'next/server';
import { getKLineData, calculateSMA, calculateMACD, calculateRSI } from '@/lib/data/china-stock-api';
import logger from '@/lib/logger';

/**
 * GET: 计算技术指标
 * 查询参数:
 * - symbol: 股票代码
 * - indicator: 技术指标类型 ('sma', 'macd', 'rsi')
 * - period: SMA和RSI的周期参数（可选，默认SMA=20，RSI=14）
 * - source: 数据源（可选，'sina'或'eastmoney'，默认'eastmoney'）
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const indicator = searchParams.get('indicator');
    const period = parseInt(searchParams.get('period') || '0', 10);
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
    
    if (!indicator || !['sma', 'macd', 'rsi'].includes(indicator)) {
      return NextResponse.json(
        { 
          success: false, 
          message: '无效的技术指标类型，支持的类型：sma, macd, rsi' 
        },
        { status: 400 }
      );
    }
    
    // 获取K线数据
    const klineData = await getKLineData(symbol, 'daily', 100, source);
    
    let result;
    
    // 计算相应的技术指标
    switch (indicator) {
      case 'sma':
        // 默认使用20日均线
        const smaPeriod = period || 20;
        result = calculateSMA(klineData, smaPeriod);
        break;
        
      case 'macd':
        result = calculateMACD(klineData);
        break;
        
      case 'rsi':
        // 默认使用14日RSI
        const rsiPeriod = period || 14;
        result = calculateRSI(klineData, rsiPeriod);
        break;
    }
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: {
        indicator,
        values: result,
        klineData, // 同时返回K线数据以便前端绘图
      },
      timestamp: new Date().toISOString(),
      meta: {
        symbol,
        indicator,
        period: period || (indicator === 'sma' ? 20 : indicator === 'rsi' ? 14 : null),
        source
      }
    });
  } catch (error) {
    // 记录错误
    logger.error('计算技术指标失败', error);
    
    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        message: '计算技术指标失败',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
} 