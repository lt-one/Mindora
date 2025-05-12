/**
 * 市场宽度分析API
 * 提供市场整体涨跌幅和强弱指标计算
 */
import { NextRequest, NextResponse } from 'next/server';
import { getKLineData } from '@/lib/data/china-stock-api';
import { HOT_STOCKS } from '@/lib/data/china-stock-api';
import logger from '@/lib/logger';

/**
 * GET: 获取市场宽度数据和RSI指标
 * 查询参数:
 * - days: 天数 (可选，默认30天)
 * - stocks: 要分析的股票代码，逗号分隔 (可选，默认使用HOT_STOCKS)
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const daysParam = searchParams.get('days');
    const stocksParam = searchParams.get('stocks');
    
    const days = daysParam ? parseInt(daysParam, 10) : 30;
    const rsiCalculationPeriod = 14; // 标准RSI周期
    
    let stockSymbols: string[] = [];
    if (stocksParam) {
      stockSymbols = stocksParam.split(',');
    } else {
      stockSymbols = HOT_STOCKS.map(stock => stock.symbol);
    }
    
    logger.info(`开始分析${stockSymbols.length}只股票的${days}天市场宽度数据`);
    
    // 为了计算RSI，我们需要 RSI周期 + days 的数据来确保有足够的历史数据进行平滑平均
    // getKLineData的第二个参数是周期，第三个是数量
    // dailyStats会基于(days + 1)天K线数据产生 `days` 天的涨跌幅数据
    const stockDataPromises = stockSymbols.map(symbol => 
      getKLineData(symbol, 'daily', days + rsiCalculationPeriod) // 获取足够的数据
    );
    
    const stocksData = await Promise.all(stockDataPromises);
    
    const dailyStats = calculateDailyStats(stocksData, days); // 传入days确保dates长度
    
    const rawRsiValues = calculateRSI(dailyStats.avgGains, dailyStats.avgLosses, rsiCalculationPeriod);
    
    // 将RSI值对齐到dates数组的长度，在前面填充null
    const alignedRsiValues: (number | null)[] = [];
    const rsiPaddingCount = dailyStats.dates.length - rawRsiValues.length;

    for (let i = 0; i < rsiPaddingCount; i++) {
      alignedRsiValues.push(null);
    }
    alignedRsiValues.push(...rawRsiValues);
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: {
        dates: dailyStats.dates,
        avgGains: dailyStats.avgGains,
        avgLosses: dailyStats.avgLosses,
        rsi: alignedRsiValues, // 使用对齐后的RSI数组
        stockCount: stockSymbols.length
      },
      timestamp: new Date().toISOString(),
      meta: {
        days,
        rsiPeriod: rsiCalculationPeriod,
        stocksAnalyzed: stockSymbols.length
      }
    });
  } catch (error) {
    // 记录错误
    logger.error('市场宽度分析失败', error);
    
    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        message: '市场宽度分析失败',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * 计算每日的平均涨幅和平均跌幅
 * @param stocksData 多只股票的K线数据
 * @param expectedDays 预期天数
 * @returns 包含日期、平均涨幅和平均跌幅的对象
 */
function calculateDailyStats(stocksData: any[][], expectedDays: number) {
  // 初始化结果
  const result = {
    dates: [] as string[],
    avgGains: [] as number[],
    avgLosses: [] as number[]
  };
  
  // 确定共同的日期范围，从所有股票数据中获取交集
  const dateMap = new Map<string, boolean>();
  
  // 首先标记所有出现的日期
  stocksData.forEach(stockData => {
    if (!stockData || stockData.length <= 1) return; // 跳过无效数据
    
    // 跳过第一天，因为需要用它来计算涨跌幅
    for (let i = 1; i < stockData.length; i++) {
      const date = stockData[i].date;
      dateMap.set(date, true);
    }
  });
  
  // 按日期排序，并截取最近 expectedDays 的数据
  const allSortedDates = Array.from(dateMap.keys()).sort();
  result.dates = allSortedDates.slice(-expectedDays);
  
  // 计算每个日期的平均涨幅和平均跌幅
  result.dates.forEach(date => {
    let totalGain = 0;
    let totalLoss = 0;
    let gainCount = 0;
    let lossCount = 0;
    
    // 遍历每只股票，找到对应日期的涨跌幅
    stocksData.forEach(stockData => {
      if (!stockData || stockData.length <= 1) return; // 跳过无效数据
      
      // 查找当前日期的数据
      const dateIndex = stockData.findIndex(item => item.date === date);
      if (dateIndex <= 0) return; // 日期不存在或是第一天
      
      // 计算涨跌幅
      const currentPrice = stockData[dateIndex].close;
      const prevPrice = stockData[dateIndex - 1].close;
      const change = ((currentPrice - prevPrice) / prevPrice) * 100; // 百分比变化
      
      if (change > 0) {
        totalGain += change;
        gainCount++;
      } else if (change < 0) {
        totalLoss += Math.abs(change); // 取绝对值
        lossCount++;
      }
      // 如果change = 0，既不计入涨幅也不计入跌幅
    });
    
    // 计算平均值
    const avgGain = gainCount > 0 ? totalGain / gainCount : 0;
    const avgLoss = lossCount > 0 ? totalLoss / lossCount : 0;
    
    result.avgGains.push(parseFloat(avgGain.toFixed(2)));
    result.avgLosses.push(parseFloat(avgLoss.toFixed(2)));
  });
  
  return result;
}

/**
 * 使用平均涨幅和平均跌幅计算RSI
 * 基于Wilder's RSI计算方法
 * @param avgGains 平均涨幅数组
 * @param avgLosses 平均跌幅数组
 * @param period RSI周期，默认14
 * @returns RSI值数组
 */
function calculateRSI(avgGains: number[], avgLosses: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  
  if (avgGains.length !== avgLosses.length || avgGains.length < period) {
    return rsi; // 数据不足或不匹配，返回空数组
  }
  
  // 初始化第一个RS值，使用简单平均
  let avgGain = avgGains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
  let avgLoss = avgLosses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;
  
  // 添加第一个RSI值
  if (avgLoss === 0) {
    rsi.push(100);
  } else {
    const rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));
  }
  
  // 计算剩余的RSI值，使用Wilder的平滑方法
  for (let i = period; i < avgGains.length; i++) {
    // 更新平均涨幅和平均跌幅
    avgGain = ((avgGain * (period - 1)) + avgGains[i]) / period;
    avgLoss = ((avgLoss * (period - 1)) + avgLosses[i]) / period;
    
    // 计算RS和RSI
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(parseFloat((100 - (100 / (1 + rs))).toFixed(2)));
    }
  }
  
  return rsi;
} 