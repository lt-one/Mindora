/**
 * 新浪财经API服务
 * 封装新浪财经API的请求和数据处理
 */
import axios from 'axios';
import logger from '@/lib/logger-utils';
import { cache } from '@/lib/api/finance/cacheUtils';

// 缓存TTL设置（毫秒）
const CACHE_TTL = {
  STOCK_REALTIME: 5 * 60 * 1000, // 5分钟
  KLINE: 60 * 60 * 1000, // 1小时
  INDICES: 5 * 60 * 1000, // 5分钟
  HISTORICAL: 24 * 60 * 60 * 1000, // 24小时
};

/**
 * 获取单只或多只股票的实时数据
 * @param symbols 单个股票代码或股票代码数组，需包含市场前缀，如：'sh600519'或['sh600519', 'sz000858']
 */
export async function getStockRealTimeData(symbols: string | string[]) {
  // 处理单个股票的情况
  const symbolsArray = Array.isArray(symbols) ? symbols : [symbols];
  const cacheKey = `sina_realtime_${symbolsArray.join('_')}`;
  
  // 检查缓存
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // 构建URL
    const params = symbolsArray.join(',');
    const url = `https://hq.sinajs.cn/list=${params}`;
    
    // 请求头，防止反爬
    const headers = {
      Referer: 'https://finance.sina.com.cn',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    const response = await axios.get(url, { headers });
    const data = response.data;
    
    // 解析数据
    const result: Record<string, any> = {};
    
    // 新浪返回的是JSONP形式的字符串，需要解析
    const lines = data.split('\n').filter((line: string) => line.trim() !== '');
    
    for (const line of lines) {
      // 解析形如 var hq_str_sh600519="贵州茅台,1799.000,1800.000,1808.000,1815.000,..." 的字符串
      const match = line.match(/var hq_str_([a-z0-9]+)="(.*)";/);
      if (match && match.length === 3) {
        const symbol = match[1];
        const values = match[2].split(',');
        
        // 深市和沪市的数据结构略有不同，这里统一处理
        const stockData: any = {
          name: values[0],
          open: parseFloat(values[1]),
          prevClose: parseFloat(values[2]),
          price: parseFloat(values[3]),
          high: parseFloat(values[4]),
          low: parseFloat(values[5]),
          volume: parseInt(values[8], 10),
          amount: parseFloat(values[9]),
          date: values[30] || values[values.length - 4] || '',
          time: values[31] || values[values.length - 3] || ''
        };
        
        // 处理买卖盘数据（如果有）
        if (values.length > 30) {
          stockData.bid1Volume = parseInt(values[10], 10);
          stockData.bid1Price = parseFloat(values[11]);
          stockData.bid2Volume = parseInt(values[12], 10);
          stockData.bid2Price = parseFloat(values[13]);
          stockData.bid3Volume = parseInt(values[14], 10);
          stockData.bid3Price = parseFloat(values[15]);
          stockData.bid4Volume = parseInt(values[16], 10);
          stockData.bid4Price = parseFloat(values[17]);
          stockData.bid5Volume = parseInt(values[18], 10);
          stockData.bid5Price = parseFloat(values[19]);
          
          stockData.ask1Volume = parseInt(values[20], 10);
          stockData.ask1Price = parseFloat(values[21]);
          stockData.ask2Volume = parseInt(values[22], 10);
          stockData.ask2Price = parseFloat(values[23]);
          stockData.ask3Volume = parseInt(values[24], 10);
          stockData.ask3Price = parseFloat(values[25]);
          stockData.ask4Volume = parseInt(values[26], 10);
          stockData.ask4Price = parseFloat(values[27]);
          stockData.ask5Volume = parseInt(values[28], 10);
          stockData.ask5Price = parseFloat(values[29]);
        }
        
        result[symbol] = stockData;
      }
    }
    
    // 设置缓存
    cache.set(cacheKey, result, CACHE_TTL.STOCK_REALTIME);
    
    // 如果只请求了一个股票，直接返回该股票数据
    if (!Array.isArray(symbols)) {
      return result[symbolsArray[0]];
    }
    
    return result;
  } catch (error) {
    logger.error('获取新浪股票实时数据失败:', error);
    throw error;
  }
}

/**
 * 获取K线数据
 * @param symbol 股票代码，需包含市场前缀，如：'sh600519'
 * @param type K线类型: 'daily'日K, 'weekly'周K, 'monthly'月K
 */
export async function getKLineData(symbol: string, type = 'daily') {
  const cacheKey = `sina_kline_${symbol}_${type}`;
  
  // 检查缓存
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // 映射K线类型参数
    const scaleMap: Record<string, string> = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month'
    };
    
    const scale = scaleMap[type] || 'day';
    
    // 构建URL，新浪K线接口
    const url = `https://quotes.sina.cn/cn/api/jsonp_v2.php/var%20${symbol}_${scale}line=/CN_MarketDataService.getKLineData`;
    
    const params = {
      symbol,
      scale,
      ma: 'no',
      datalen: 90 // 获取90条数据
    };
    
    // 请求头，防止反爬
    const headers = {
      Referer: 'https://finance.sina.com.cn',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    const response = await axios.get(url, { params, headers });
    
    // 解析JSONP响应
    const data = response.data;
    const jsonMatch = data.match(/var.*?=\s*(\[.*\])/);
    
    if (jsonMatch && jsonMatch.length > 1) {
      const jsonData = JSON.parse(jsonMatch[1]);
      
      // 设置缓存
      cache.set(cacheKey, jsonData, CACHE_TTL.KLINE);
      
      return jsonData;
    }
    
    return [];
  } catch (error) {
    logger.error(`获取新浪${symbol}的K线数据失败:`, error);
    throw error;
  }
}

/**
 * 获取指数实时数据
 */
export async function getIndicesData() {
  const cacheKey = 'sina_indices_data';
  
  // 检查缓存
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // 主要指数列表：上证指数、深证成指、创业板指、沪深300
    const indices = ['sh000001', 'sz399001', 'sz399006', 'sh000300'];
    const url = `https://hq.sinajs.cn/list=${indices.join(',')}`;
    
    // 请求头，防止反爬
    const headers = {
      Referer: 'https://finance.sina.com.cn',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    const response = await axios.get(url, { headers });
    const data = response.data;
    
    // 解析数据
    const result: Record<string, any> = {};
    
    // 处理每行数据
    const lines = data.split('\n').filter((line: string) => line.trim() !== '');
    
    for (const line of lines) {
      const match = line.match(/var hq_str_([a-z0-9]+)="(.*)";/);
      if (match && match.length === 3) {
        const symbol = match[1];
        const values = match[2].split(',');
        
        result[symbol] = {
          name: values[0],
          todayOpen: parseFloat(values[1]),
          yesterdayClose: parseFloat(values[2]),
          currentPoint: parseFloat(values[3]),
          highPoint: parseFloat(values[4]),
          lowPoint: parseFloat(values[5]),
          volume: parseInt(values[8], 10),
          amount: parseFloat(values[9]),
          date: values[30] || '',
          time: values[31] || ''
        };
        
        // 计算涨跌和涨跌幅
        result[symbol].change = result[symbol].currentPoint - result[symbol].yesterdayClose;
        result[symbol].changePercent = (result[symbol].change / result[symbol].yesterdayClose) * 100;
      }
    }
    
    // 设置缓存
    cache.set(cacheKey, result, CACHE_TTL.INDICES);
    
    return result;
  } catch (error) {
    logger.error('获取新浪指数数据失败:', error);
    throw error;
  }
}

/**
 * 获取历史交易数据
 * @param symbol 股票代码，需包含市场前缀，如：'sh600519'
 * @param date 日期字符串，格式：'YYYY-MM-DD'
 */
export async function getHistoricalTransactionData(symbol: string, date: string) {
  const cacheKey = `sina_historical_${symbol}_${date}`;
  
  // 检查缓存
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // 提取市场和代码
    const market = symbol.substring(0, 2);
    const code = symbol.substring(2);
    
    // 处理日期格式
    const formattedDate = date.replace(/-/g, '');
    
    // 构建URL
    let url = '';
    if (market === 'sh') {
      url = `https://market.finance.sina.com.cn/transHis.php?symbol=${symbol}&date=${date}`;
    } else {
      url = `https://market.finance.sina.com.cn/transHis.php?symbol=${symbol}&date=${date}`;
    }
    
    // 请求头，防止反爬
    const headers = {
      Referer: 'https://finance.sina.com.cn',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    const response = await axios.get(url, { headers });
    const html = response.data;
    
    // 简单解析HTML表格数据，更复杂的情况可能需要使用cheerio等库
    const result: any[] = [];
    
    // 简单的正则匹配提取表格数据
    const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/gi;
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    
    const tables = html.match(tableRegex);
    if (tables && tables.length > 0) {
      const transactionTable = tables[0];
      let row;
      let rowIndex = 0;
      
      while ((row = rowRegex.exec(transactionTable)) !== null) {
        if (rowIndex > 0) { // 跳过表头
          const cells = row[1].match(cellRegex);
          if (cells && cells.length >= 6) {
            result.push({
              time: cells[0].replace(/<[^>]*>/g, '').trim(),
              price: parseFloat(cells[1].replace(/<[^>]*>/g, '').trim()),
              change: cells[2].replace(/<[^>]*>/g, '').trim(),
              volume: parseInt(cells[3].replace(/<[^>]*>/g, '').replace(/,/g, '').trim(), 10),
              amount: parseFloat(cells[4].replace(/<[^>]*>/g, '').replace(/,/g, '').trim()),
              type: cells[5].replace(/<[^>]*>/g, '').trim()
            });
          }
        }
        rowIndex++;
      }
    }
    
    // 设置缓存
    cache.set(cacheKey, result, CACHE_TTL.HISTORICAL);
    
    return result;
  } catch (error) {
    logger.error(`获取${symbol}在${date}的历史交易数据失败:`, error);
    throw error;
  }
} 