/**
 * 中国股票市场数据API中间层
 * 整合新浪财经和东方财富数据源，提供统一的数据获取接口
 */
import * as sinaFinance from '@/lib/api/finance/sinaFinanceService';
import * as eastMoney from '@/lib/api/finance/eastMoneyService';
import logger from '@/lib/logger-utils';
import { processFinancialData, calculateChangePercent } from '@/lib/utils';

// 热门股票列表
export const HOT_STOCKS = [
  { symbol: 'sh600519', name: '贵州茅台' },  // 贵州茅台
  { symbol: 'sh601318', name: '中国平安' },  // 中国平安
  { symbol: 'sh600036', name: '招商银行' },  // 招商银行
  { symbol: 'sh600276', name: '恒瑞医药' },  // 恒瑞医药
  { symbol: 'sz000858', name: '五粮液' },    // 五粮液
  { symbol: 'sh601166', name: '兴业银行' },  // 兴业银行
  { symbol: 'sh600030', name: '中信证券' },  // 中信证券
  { symbol: 'sz000333', name: '美的集团' },  // 美的集团
  { symbol: 'sh601888', name: '中国中免' },  // 中国中免
  { symbol: 'sz300750', name: '宁德时代' },  // 宁德时代
];

// 重要指数列表
export const MAJOR_INDICES = [
  { symbol: 'sh000001', name: '上证指数' },
  { symbol: 'sz399001', name: '深证成指' },
  { symbol: 'sz399006', name: '创业板指' },
  { symbol: 'sh000300', name: '沪深300' },
];

/**
 * 获取大盘指数数据
 * @param source 数据源 ('sina' | 'eastmoney')
 */
export async function getMarketIndices(source: 'sina' | 'eastmoney' = 'sina') {
  try {
    let indicesData;
    
    if (source === 'sina') {
      indicesData = await sinaFinance.getIndicesData();
    } else {
      indicesData = await eastMoney.getMarketIndices();
    }
    
    // 统一处理指数数据，确保在所有地方显示一致
    if (indicesData) {
      Object.entries(indicesData).forEach(([symbol, data]: [string, any]) => {
        // 判断是否为指数
        if (symbol.startsWith('sh000') || symbol.startsWith('sz399')) {
          // 指数缩放因子
          const scalingFactor = 100;
          
          // 对于上证或深证指数，检查当前点位是否需要缩放
          const needsScaling = (data.price || data.currentPoint) > 1000;
          
          if (needsScaling) {
            // 价格处理
            if (data.price) {
              data.price = data.price / scalingFactor;
            }
            if (data.currentPoint) {
              data.currentPoint = data.currentPoint / scalingFactor;
            }
            
            // 处理涨跌额
            if (data.change) {
              data.change = data.change / scalingFactor;
            }
            
            // 处理其他相关数值
            if (data.todayOpen && data.todayOpen > 1000) {
              data.todayOpen = data.todayOpen / scalingFactor;
            }
            if (data.yesterdayClose && data.yesterdayClose > 1000) {
              data.yesterdayClose = data.yesterdayClose / scalingFactor;
            }
            if (data.highPoint && data.highPoint > 1000) {
              data.highPoint = data.highPoint / scalingFactor;
            }
            if (data.lowPoint && data.lowPoint > 1000) {
              data.lowPoint = data.lowPoint / scalingFactor;
            }
          }
          
          // 始终重新计算涨跌幅，确保与当前价格和涨跌额一致
          if (data.yesterdayClose && (data.price || data.currentPoint)) {
            const current = data.price || data.currentPoint;
            // 重新计算涨跌额，确保一致性
            data.change = Number((current - data.yesterdayClose).toFixed(2));
            // 使用统一的函数计算涨跌幅百分比
            data.changePercent = calculateChangePercent(current, data.yesterdayClose);
          } else if (Math.abs(data.changePercent) > 100 && needsScaling) {
            // 如果没有足够的数据重新计算，但涨跌幅异常大，尝试缩放
            data.changePercent = data.changePercent / scalingFactor;
          }
          
          // 严格验证数据一致性 - 确保price和currentPoint一致
          if (data.price && data.currentPoint) {
            // 如果两者都存在但不相等，使用price值统一
            if (Math.abs(data.price - data.currentPoint) > 0.01) {
              data.currentPoint = data.price;
            }
          } else if (data.currentPoint && !data.price) {
            // 如果只有currentPoint，确保price也存在
            data.price = data.currentPoint;
          } else if (data.price && !data.currentPoint) {
            // 如果只有price，确保currentPoint也存在
            data.currentPoint = data.price;
          }
          
          // 验证数据一致性 - 计算的涨跌额
          if (data.price && data.yesterdayClose && data.change) {
            const calculatedChange = Number((data.price - data.yesterdayClose).toFixed(2));
            const discrepancy = Math.abs(calculatedChange - data.change);
            
            // 如果计算的涨跌额与实际涨跌额有较大差异，使用计算值覆盖
            if (discrepancy > 0.01) {
              data.change = calculatedChange;
              data.changePercent = calculateChangePercent(data.price, data.yesterdayClose);
            }
          }
          
          // 对处理后的数据进行统一格式化，确保所有显示位置一致
          data = processFinancialData(data);
          
          // 添加数据源和处理标记
          data.source = source;
          data.isProcessed = true;
        }
      });
      
      // 对整个返回的结果应用processFinancialData处理
      Object.keys(indicesData).forEach(symbol => {
        indicesData[symbol] = processFinancialData(indicesData[symbol]);
      });
      
      // 记录处理后的数据，方便调试
      logger.debug(`处理后的指数数据: ${JSON.stringify(indicesData)}`);
    }
    
    return indicesData;
  } catch (error) {
    logger.error('获取大盘指数数据失败', error);
    throw error;
  }
}

/**
 * 获取股票实时行情
 * @param symbol 股票代码
 * @param source 数据源 ('sina' | 'eastmoney')
 */
export async function getStockQuote(symbol: string, source: 'sina' | 'eastmoney' = 'eastmoney') {
  try {
    if (source === 'sina') {
      return await sinaFinance.getStockRealTimeData(symbol);
    } else {
      // 处理股票代码格式，如将'sh600519'转为'600519'
      const code = symbol.startsWith('sh') || symbol.startsWith('sz') 
        ? symbol.substring(2) 
        : symbol;
      
      return await eastMoney.getStockQuote(code);
    }
  } catch (error) {
    logger.error(`获取股票${symbol}实时行情失败`, error);
    throw error;
  }
}

/**
 * 获取多个股票的实时行情
 * @param symbols 股票代码列表
 * @param source 数据源 ('sina' | 'eastmoney')
 */
export async function getMultipleStockQuotes(symbols: string[], source: 'sina' | 'eastmoney' = 'eastmoney') {
  try {
    if (source === 'sina') {
      return await sinaFinance.getStockRealTimeData(symbols);
    } else {
      // 东方财富API需要单独调用每个股票
      const promises = symbols.map(symbol => {
        // 处理股票代码格式
        const code = symbol.startsWith('sh') || symbol.startsWith('sz') 
          ? symbol.substring(2) 
          : symbol;
        
        return eastMoney.getStockQuote(code)
          .then(data => ({ [symbol]: data }))
          .catch(error => {
            logger.error(`获取股票${symbol}实时行情失败`, error);
            return { [symbol]: null };
          });
      });
      
      const results = await Promise.all(promises);
      // 合并结果，使用显式类型注解解决类型错误
      const mergedResults: Record<string, any> = {};
      for (const result of results) {
        Object.assign(mergedResults, result);
      }
      return mergedResults;
    }
  } catch (error) {
    logger.error('批量获取股票实时行情失败', error);
    throw error;
  }
}

/**
 * 获取K线数据
 * @param symbol 股票代码
 * @param period 周期类型
 * @param count 数据条数
 * @param source 数据源 ('sina' | 'eastmoney')
 */
export async function getKLineData(
  symbol: string, 
  period: 'daily' | 'weekly' | 'monthly' | '5min' | '15min' | '30min' | '60min' = 'daily',
  count: number = 90,
  source: 'sina' | 'eastmoney' = 'eastmoney'
) {
  try {
    if (source === 'sina') {
      // 新浪只支持日K、周K、月K
      if (['daily', 'weekly', 'monthly'].includes(period)) {
        return await sinaFinance.getKLineData(symbol, period);
      } else {
        throw new Error('新浪数据源不支持分钟级别K线数据');
      }
    } else {
      // 东方财富支持更多K线周期
      // 将周期映射为东方财富API的周期代码
      const periodMap: Record<string, string> = {
        'daily': '101',
        'weekly': '102',
        'monthly': '103',
        '5min': '104',
        '15min': '105',
        '30min': '106',
        '60min': '107'
      };
      
      // 处理股票代码格式
      const code = symbol.startsWith('sh') || symbol.startsWith('sz') 
        ? symbol.substring(2) 
        : symbol;
      
      return await eastMoney.getKLineData(code, periodMap[period], count);
    }
  } catch (error) {
    logger.error(`获取股票${symbol}的${period}K线数据失败`, error);
    throw error;
  }
}

/**
 * 获取股票盘口数据（五档买卖盘）
 * @param symbol 股票代码
 */
export async function getStockOrderBook(symbol: string) {
  try {
    // 处理股票代码格式
    const code = symbol.startsWith('sh') || symbol.startsWith('sz') 
      ? symbol.substring(2) 
      : symbol;
    
    return await eastMoney.getStockOrderBook(code);
  } catch (error) {
    logger.error(`获取股票${symbol}盘口数据失败`, error);
    throw error;
  }
}

/**
 * 获取分时图数据
 * @param symbol 股票代码
 */
export async function getTimeSeriesData(symbol: string) {
  try {
    // 直接传递完整的symbol，这样eastMoneyService中的指数类型检测才能正确工作
    return await eastMoney.getTimeSeriesData(symbol);
  } catch (error) {
    logger.error(`获取股票${symbol}分时图数据失败`, error);
    throw error;
  }
}

/**
 * 获取历史交易数据
 * @param symbol 股票代码
 * @param date 日期字符串，格式：'YYYY-MM-DD'
 */
export async function getHistoricalTransactionData(symbol: string, date: string) {
  try {
    return await sinaFinance.getHistoricalTransactionData(symbol, date);
  } catch (error) {
    logger.error(`获取股票${symbol}在${date}的历史交易数据失败`, error);
    throw error;
  }
}

/**
 * 获取热门股票数据
 * @param count 数量
 */
export async function getHotStocks(count: number = 10) {
  try {
    // 获取预定义的热门股票
    const hotStocks = HOT_STOCKS.slice(0, count);
    
    // 获取这些股票的实时数据
    const stockSymbols = hotStocks.map(stock => stock.symbol);
    const quotesData = await getMultipleStockQuotes(stockSymbols);
    
    // 合并股票名称和实时数据
    return hotStocks.map(stock => ({
      ...stock,
      data: quotesData[stock.symbol]
    }));
  } catch (error) {
    logger.error('获取热门股票数据失败', error);
    throw error;
  }
}

/**
 * 获取市场概览数据
 */
export async function getMarketOverview() {
  try {
    // 获取主要指数数据
    const indicesData = await getMarketIndices();
    
    // 获取热门股票数据
    const hotStocksData = await getHotStocks(10);
    
    // 对热门股票数据也进行统一处理
    if (hotStocksData && Array.isArray(hotStocksData)) {
      hotStocksData.forEach((stock, index) => {
        hotStocksData[index] = processFinancialData(stock);
      });
    }
    
    return {
      indices: indicesData,
      hotStocks: hotStocksData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('获取市场概览数据失败', error);
    throw error;
  }
}

/**
 * 计算技术指标 - 简单移动平均线 (SMA)
 * @param klineData K线数据
 * @param period 周期
 * @param valueKey 使用的值字段，默认为收盘价
 */
export function calculateSMA(klineData: any[], period: number, valueKey: string = 'close') {
  const result = [];
  
  for (let i = 0; i < klineData.length; i++) {
    if (i < period - 1) {
      // 数据不足一个周期，填充null
      result.push(null);
    } else {
      // 计算简单移动平均
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += klineData[i - j][valueKey];
      }
      result.push(sum / period);
    }
  }
  
  return result;
}

/**
 * 计算MACD指标
 * @param klineData K线数据
 * @param fastPeriod 快线周期，默认12
 * @param slowPeriod 慢线周期，默认26
 * @param signalPeriod 信号线周期，默认9
 */
export function calculateMACD(
  klineData: any[],
  fastPeriod: number = 12,
  slowPeriod: number = 26, 
  signalPeriod: number = 9
) {
  // 计算EMA
  const calculateEMA = (data: number[], period: number) => {
    const k = 2 / (period + 1);
    const emaData = [];
    let ema = data[0];
    
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        emaData.push(data[0]);
      } else {
        ema = data[i] * k + ema * (1 - k);
        emaData.push(ema);
      }
    }
    
    return emaData;
  };
  
  // 提取收盘价
  const closes = klineData.map(item => item.close);
  
  // 计算快线EMA和慢线EMA
  const emaFast = calculateEMA(closes, fastPeriod);
  const emaSlow = calculateEMA(closes, slowPeriod);
  
  // 计算MACD线 (DIF)
  const dif = emaFast.map((fast, i) => fast - emaSlow[i]);
  
  // 计算信号线 (DEA)
  const dea = calculateEMA(dif, signalPeriod);
  
  // 计算柱状图 (MACD)
  const macd = dif.map((diff, i) => (diff - dea[i]) * 2);
  
  // 返回计算结果
  return {
    dif,
    dea,
    macd
  };
}

/**
 * 计算RSI指标
 * @param klineData K线数据
 * @param period 周期，默认14
 */
export function calculateRSI(klineData: any[], period: number = 14) {
  const closes = klineData.map(item => item.close);
  const rsi = [];
  
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      rsi.push(null);
      continue;
    }
    
    // 只有一个数据点时无法计算
    if (i < period) {
      rsi.push(null);
      continue;
    }
    
    let gains = 0;
    let losses = 0;
    
    // 计算前N天的涨跌
    for (let j = i - period + 1; j <= i; j++) {
      const change = closes[j] - closes[j - 1];
      if (change >= 0) {
        gains += change;
      } else {
        losses -= change; // 取绝对值
      }
    }
    
    // 防止除以0
    if (losses === 0) {
      rsi.push(100);
    } else {
      const rs = gains / losses;
      const rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
    }
  }
  
  return rsi;
} 