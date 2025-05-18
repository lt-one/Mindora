import { NextRequest, NextResponse } from 'next/server';
import { getKLineData, calculateSMA, calculateMACD, calculateRSI } from '@/lib/data/china-stock-api';

/**
 * 计算股票的平均涨幅和平均跌幅
 * @param klineData K线数据
 * @param period 计算周期
 * @returns 包含平均涨幅和平均跌幅的对象
 */
function calculateGainsAndLosses(klineData: any[], period: number = 14) {
  const avgGains: number[] = [];
  const avgLosses: number[] = [];
  const closes = klineData.map(item => item.close);
  
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      avgGains.push(0);
      avgLosses.push(0);
      continue;
    }
    
    // 当前收盘价与前一天相比的变化
    const change = closes[i] - closes[i - 1];
    const changePercent = (change / closes[i - 1]) * 100;
    
    // 分别记录涨幅和跌幅
    if (change >= 0) {
      avgGains.push(parseFloat(changePercent.toFixed(2)));
      avgLosses.push(0);
    } else {
      avgGains.push(0);
      avgLosses.push(parseFloat(Math.abs(changePercent).toFixed(2)));
    }
  }
  
  return {
    dailyGains: avgGains,
    dailyLosses: avgLosses,
    // 计算RSI期间的平均涨幅和平均跌幅
    avgGains: calculateSmoothAverage(avgGains, period),
    avgLosses: calculateSmoothAverage(avgLosses, period),
  };
}

/**
 * 计算平滑平均值 (Wilder's Smoothing Method)
 * @param data 数据数组
 * @param period 周期
 * @returns 平滑后的平均值数组
 */
function calculateSmoothAverage(data: number[], period: number) {
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      // 前N个数据点使用简单平均
      if (i === period - 1) {
        const avg = data.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
        result.push(parseFloat(avg.toFixed(2)));
      } else {
        result.push(0); // 数据不足时填充0
      }
    } else {
      // 使用Wilder的平滑方法
      const prevAvg = result[i - 1];
      const currentVal = data[i];
      const avg = ((prevAvg * (period - 1)) + currentVal) / period;
      result.push(parseFloat(avg.toFixed(2)));
    }
  }
  
  return result;
}

/**
 * GET: 计算技术指标
 * 查询参数:
 * - symbol: 股票代码
 * - indicator: 技术指标类型 ('sma', 'macd', 'rsi')
 * - period: SMA和RSI的周期参数（可选，默认SMA=20，RSI=14）
 * - source: 数据源（可选，'sina'或'eastmoney'，默认'eastmoney'）
 * - forceRefresh: 是否强制刷新数据（可选，默认false）
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const indicator = searchParams.get('indicator');
    const period = parseInt(searchParams.get('period') || '0', 10);
    const source = searchParams.get('source') as 'sina' | 'eastmoney' || 'eastmoney';
    const forceRefresh = searchParams.get('forceRefresh') === 'true';
    
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
    // 根据不同的period参数决定获取的数据数量和周期类型
    let klineCount = 250; // 默认获取更多数据，确保有足够的历史数据
    const klinePeriod: 'daily' | 'weekly' | 'monthly' | '60min' | '30min' | '15min' | '5min' = 'daily'; // 默认使用日K
    
    // 对于RSI，可以根据周期参数调整获取的数据量
    if (indicator === 'rsi' && period) {
      // 确保获取足够的数据计算RSI
      klineCount = Math.max(period * 10, 250); // 至少获取RSI周期的10倍数据量
    }
    
    // 获取K线数据
    const klineData = await getKLineData(symbol, klinePeriod, klineCount, source, forceRefresh);
    
    let result: any;
    const extraData = {};
    
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
        const rsiResult = calculateRSI(klineData, rsiPeriod);
        
        // 从计算结果中提取各个指标数据
        const rsiValues = rsiResult.map((item: any) => item.rsi);
        const avgGains = rsiResult.map((item: any) => item.avgGain);
        const avgLosses = rsiResult.map((item: any) => item.avgLoss);
        
        // 将结果组织为期望的格式
        result = rsiResult.map((item: any, index: number) => ({
          date: item.date,
          time: item.time,
          rsi: item.rsi,
          avgGain: item.avgGain,
          avgLoss: item.avgLoss
        }));
        break;
    }
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: {
        indicator,
        values: result,
        klineData, // 同时返回K线数据以便前端绘图
        ...extraData
      },
      timestamp: new Date().toISOString(),
      meta: {
        symbol,
        indicator,
        period: period || (indicator === 'sma' ? 20 : indicator === 'rsi' ? 14 : null),
        source,
        refreshed: forceRefresh
      }
    });
  } catch (error) {
    // 返回错误响应，不使用日志记录
    console.error('计算技术指标失败', error);
    
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