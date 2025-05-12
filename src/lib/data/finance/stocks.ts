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
    // 获取实时行情数据
    const quoteData = await getStockQuote(symbol);
    
    // 从缓存中获取最后的有效盘口数据
    const cacheKey = `orderbook_${symbol}`;
    let lastValidData = orderBookCache.get(cacheKey);
    let isHistoricalData = false;
    
    // 检查是否有盘口数据
    if (!quoteData || 
        (!quoteData.bid1Price && !quoteData.ask1Price)) {
      // @ts-ignore
      logger.warn(`股票${symbol}当前没有可用的盘口深度数据，尝试返回最后交易数据`);
      
      // 如果有缓存的历史数据，则使用历史数据
      if (lastValidData && (lastValidData.bids.length > 0 || lastValidData.asks.length > 0)) {
        return {
          ...lastValidData,
          isHistoricalData: true // 标记这是历史数据
        };
      }
      
      // 没有历史数据，返回空结构
      return {
        bids: [],
        asks: [],
        isHistoricalData: false
      };
    }
    
    // 整理盘口数据
    const bids = [];
    const asks = [];
    
    // 整理买盘数据
    if (quoteData.bid1Price) bids.push({ price: quoteData.bid1Price, volume: quoteData.bid1Volume || 0 });
    if (quoteData.bid2Price) bids.push({ price: quoteData.bid2Price, volume: quoteData.bid2Volume || 0 });
    if (quoteData.bid3Price) bids.push({ price: quoteData.bid3Price, volume: quoteData.bid3Volume || 0 });
    if (quoteData.bid4Price) bids.push({ price: quoteData.bid4Price, volume: quoteData.bid4Volume || 0 });
    if (quoteData.bid5Price) bids.push({ price: quoteData.bid5Price, volume: quoteData.bid5Volume || 0 });
    
    // 整理卖盘数据
    if (quoteData.ask1Price) asks.push({ price: quoteData.ask1Price, volume: quoteData.ask1Volume || 0 });
    if (quoteData.ask2Price) asks.push({ price: quoteData.ask2Price, volume: quoteData.ask2Volume || 0 });
    if (quoteData.ask3Price) asks.push({ price: quoteData.ask3Price, volume: quoteData.ask3Volume || 0 });
    if (quoteData.ask4Price) asks.push({ price: quoteData.ask4Price, volume: quoteData.ask4Volume || 0 });
    if (quoteData.ask5Price) asks.push({ price: quoteData.ask5Price, volume: quoteData.ask5Volume || 0 });
    
    const result = {
      symbol,
      price: quoteData.price,
      bids,
      asks,
      timestamp: new Date().toISOString(),
      isHistoricalData: false
    };
    
    // 缓存最新数据
    orderBookCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    // @ts-ignore
    logger.error(`获取股票${symbol}盘口深度数据失败`, error);
    throw error;
  }
} 