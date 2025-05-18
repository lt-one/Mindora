/**
 * 股票数据相关函数
 * 包含获取股票行情、多股行情、股票盘口等功能
 */

import * as sinaFinance from '@/lib/api/finance/sinaFinanceService';
import * as eastMoney from '@/lib/api/finance/eastMoneyService';
// @ts-ignore
import logger from '@/lib/logger';
import type { LoggerInterface } from '@/lib/logger';

// 内存缓存实现
const orderBookCache = new Map();

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
    // @ts-ignore
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
            // @ts-ignore
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
    // @ts-ignore
    logger.error('批量获取股票实时行情失败', error);
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
    // @ts-ignore
    logger.error(`获取股票${symbol}盘口数据失败`, error);
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
    // @ts-ignore
    logger.error(`获取股票${symbol}在${date}的历史交易数据失败`, error);
    throw error;
  }
}

/**
 * 获取股票盘口深度数据
 * 当市场闭市时返回最后的有效数据
 * @param symbol 股票代码
 */
export async function getOrderBookDepth(symbol: string) {
  try {
    // 直接获取盘口数据
    const orderBookData = await getStockOrderBook(symbol);

    // 从缓存中获取上一次的有效盘口数据（主要用于判断是否历史数据和填充时间戳）
    const cacheKey = `orderbook_${symbol}`;
    const lastValidData = orderBookCache.get(cacheKey);
    const isHistoricalData = false;

    // 检查获取到的盘口数据是否有效
    if (!orderBookData || (!orderBookData.bids?.length && !orderBookData.asks?.length)) {
      // @ts-ignore
      logger.warn(`股票${symbol}当前没有可用的盘口深度数据，尝试返回最后交易数据`);
      
      // 如果有缓存的历史数据，则使用历史数据
      if (lastValidData && (lastValidData.bids.length > 0 || lastValidData.asks.length > 0)) {
        return {
          ...lastValidData, // 保留历史数据中的 bids, asks, price, symbol
          timestamp: lastValidData.timestamp || new Date().toISOString(), // 确保有时间戳
          isHistoricalData: true // 标记这是历史数据
        };
      }
      
      // 没有实时数据也没有历史数据，返回空结构
      return {
        symbol, // 确保返回股票代码
        price: lastValidData?.price || 0, // 尝试使用历史价格或0
        bids: [],
        asks: [],
        timestamp: new Date().toISOString(),
        isHistoricalData: false
      };
    }
    
    // 获取成功，orderBookData 包含 bids, asks, price
    const result = {
      symbol,
      price: orderBookData.price, // 使用从 getStockOrderBook 获取的价格
      bids: orderBookData.bids || [],
      asks: orderBookData.asks || [],
      timestamp: new Date().toISOString(),
      isHistoricalData: false
    };
    
    // 缓存最新数据
    orderBookCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    // @ts-ignore
    logger.error(`获取股票${symbol}盘口深度数据失败`, error);
    // 即使API调用失败，也尝试从缓存返回历史数据
    const cacheKey = `orderbook_${symbol}`;
    const lastValidData = orderBookCache.get(cacheKey);
    if (lastValidData && (lastValidData.bids.length > 0 || lastValidData.asks.length > 0)) {
      return {
        ...lastValidData,
        timestamp: lastValidData.timestamp || new Date().toISOString(),
        isHistoricalData: true, // 标记这是历史数据，因为实时获取失败
        errorMessage: (error as Error).message // 可以选择性地附加错误信息
      };
    }
    // 如果连历史数据都没有，则抛出错误或返回统一的错误结构
    // 这里选择抛出错误，让上层API路由去处理并返回给前端特定的错误信息和空数据结构
    throw error; 
  }
} 