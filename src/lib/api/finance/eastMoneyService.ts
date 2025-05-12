/**
 * 东方财富API服务
 * 封装东方财富API的请求和数据处理
 */
import axios from 'axios';
import logger from '@/lib/logger-utils';
import { cache } from '@/lib/api/finance/cacheUtils'; 

// 缓存TTL设置（毫秒）
const CACHE_TTL = {
  STOCK_QUOTE: 5 * 60 * 1000, // 5分钟
  KLINE: 60 * 60 * 1000, // 1小时
  MARKET_INDICES: 5 * 60 * 1000, // 5分钟
  STOCK_LIST: 24 * 60 * 60 * 1000, // 24小时
};

/**
 * 获取股票实时行情数据
 * @param symbol 股票代码，如：'600519'或'000858'
 */
export async function getStockQuote(symbol: string) {
  const cacheKey = `stock_quote_${symbol}`;
  
  // 检查缓存
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // 处理股票代码
    let market = '0'; // 深市
    let code = symbol;
    
    // 如果是6开头，应该是上海的股票
    if (symbol.startsWith('6')) {
      market = '1';
    } else if (symbol.startsWith('sh') || symbol.startsWith('sz')) {
      // 处理带有市场前缀的代码
      market = symbol.startsWith('sh') ? '1' : '0';
      code = symbol.substring(2);
    }
    
    const url = `https://push2.eastmoney.com/api/qt/stock/get`;
    
    const params = {
      secid: `${market}.${code}`,
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      fields: 'f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f127,f199,f128,f193,f196,f194,f195,f197,f80,f280,f281,f282,f284,f285,f286,f287',
      fltt: 2,
      invt: 2
    };
    
    const response = await axios.get(url, { params });
    
    if (response.data && response.data.data) {
      const data = response.data.data;
      
      // 转换数据
      const result = {
        code: data.f57, // 股票代码
        name: data.f58, // 股票名称
        price: data.f43 / 100, // 当前价格，需要除以100
        change: data.f169 / 100, // 涨跌额
        changePercent: data.f170 / 100, // 涨跌幅
        open: data.f46 / 100, // 开盘价
        high: data.f44 / 100, // 最高价
        low: data.f45 / 100, // 最低价
        prevClose: data.f60 / 100, // 昨收价
        volume: data.f47, // 成交量
        amount: data.f48, // 成交额
        turnoverRate: data.f168 / 100, // 换手率
        pe: data.f162, // 市盈率
        pb: data.f167, // 市净率
        marketCap: data.f116, // 总市值
        circulationMarketCap: data.f117, // 流通市值
        time: new Date().toISOString(), // 数据获取时间
      };
      
      // 设置缓存
      cache.set(cacheKey, result, CACHE_TTL.STOCK_QUOTE);
      
      return result;
    }
    
    throw new Error('无法获取股票数据');
  } catch (error) {
    logger.error(`获取股票${symbol}实时行情失败:`, error);
    throw error;
  }
}

/**
 * 获取股票K线数据
 * @param symbol 股票代码，如：'600519'或'000858'
 * @param period 周期类型：'101'(日线), '102'(周线), '103'(月线), 
 *               '104'(5分钟), '105'(15分钟), '106'(30分钟), '107'(60分钟)
 * @param count 获取数量
 */
export async function getKLineData(symbol: string, period = '101', count = 100) {
  const cacheKey = `kline_${symbol}_${period}_${count}`;
  
  // 检查缓存
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // 处理股票代码
    let market = '0'; // 默认为深市
    let code = symbol;
    
    // 如果是6开头，应该是上海的股票
    if (symbol.startsWith('6')) {
      market = '1';
    } else if (symbol.startsWith('sh') || symbol.startsWith('sz')) {
      // 处理带有市场前缀的代码
      market = symbol.startsWith('sh') ? '1' : '0';
      code = symbol.substring(2);
    }
    
    const secid = `${market}.${code}`;
    const url = 'https://push2his.eastmoney.com/api/qt/stock/kline/get';
    
    const params = {
      secid,
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      fields1: 'f1,f2,f3,f4,f5,f6',
      fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
      klt: period,
      fqt: 0, // 不复权
      end: new Date().toISOString().split('T')[0].replace(/-/g, ''), // 使用当前日期作为截止日期
      lmt: count
    };
    
    const response = await axios.get(url, { params });
    
    if (response.data && response.data.data) {
      const data = response.data.data;
      const klines = data.klines || [];
      
      const result = klines.map((line: string) => {
        const [date, open, close, high, low, volume, amount, amplitude, changePercent, change, turnoverRate] = line.split(',');
        
        return {
          date,
          open: parseFloat(open),
          close: parseFloat(close),
          high: parseFloat(high),
          low: parseFloat(low),
          volume: parseFloat(volume),
          amount: parseFloat(amount),
          amplitude: parseFloat(amplitude), // 振幅
          changePercent: parseFloat(changePercent), // 涨跌幅
          change: parseFloat(change), // 涨跌额
          turnoverRate: parseFloat(turnoverRate) // 换手率
        };
      });
      
      // 设置缓存
      cache.set(cacheKey, result, CACHE_TTL.KLINE);
      
      return result;
    }
    
    return [];
  } catch (error) {
    logger.error(`获取股票${symbol}的K线数据失败:`, error);
    throw error;
  }
}

/**
 * 获取股票盘口数据（五档买卖盘）
 * @param symbol 股票代码，如：'600519'或'000858'
 */
export async function getStockOrderBook(symbol: string) {
  try {
    // 处理股票代码
    let market = '0'; // 深市
    let code = symbol;
    
    // 如果是6开头，应该是上海的股票
    if (symbol.startsWith('6')) {
      market = '1';
    } else if (symbol.startsWith('sh') || symbol.startsWith('sz')) {
      // 处理带有市场前缀的代码
      market = symbol.startsWith('sh') ? '1' : '0';
      code = symbol.substring(2);
    }
    
    const secid = `${market}.${code}`;
    const url = 'https://push2.eastmoney.com/api/qt/stock/get';
    
    const params = {
      secid,
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      fields: 'f31,f32,f33,f34,f35,f36,f37,f38,f39,f40,f19,f20,f17,f18,f15,f16,f13,f14,f11,f12',
      invt: 2
    };
    
    const response = await axios.get(url, { params });
    
    if (response.data && response.data.data) {
      const data = response.data.data;
      
      // 构建盘口数据结构
      const result = {
        code: symbol,
        price: data.f43 ? data.f43 / 100 : 0,
        changePercent: data.f170 ? data.f170 / 100 : 0,
        bids: [
          { price: data.f19 / 100, volume: data.f20 }, // 买一
          { price: data.f17 / 100, volume: data.f18 }, // 买二
          { price: data.f15 / 100, volume: data.f16 }, // 买三
          { price: data.f13 / 100, volume: data.f14 }, // 买四
          { price: data.f11 / 100, volume: data.f12 }  // 买五
        ].filter(bid => bid.price > 0),
        asks: [
          { price: data.f31 / 100, volume: data.f32 }, // 卖一
          { price: data.f33 / 100, volume: data.f34 }, // 卖二
          { price: data.f35 / 100, volume: data.f36 }, // 卖三
          { price: data.f37 / 100, volume: data.f38 }, // 卖四
          { price: data.f39 / 100, volume: data.f40 }  // 卖五
        ].filter(ask => ask.price > 0)
      };
      
      return result;
    }
    
    throw new Error('无法获取盘口数据');
  } catch (error) {
    logger.error(`获取股票${symbol}盘口数据失败:`, error);
    throw error;
  }
}

/**
 * 获取指数数据
 */
export async function getMarketIndices() {
  const cacheKey = 'market_indices';
  
  // 检查缓存
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // 主要指数列表
    const indices = [
      { id: '1.000001', name: '上证指数' },
      { id: '0.399001', name: '深证成指' },
      { id: '0.399006', name: '创业板指' },
      { id: '1.000300', name: '沪深300' }
    ];
    
    const url = 'https://push2.eastmoney.com/api/qt/ulist.np/get';
    const params = {
      secids: indices.map(index => index.id).join(','),
      fields: 'f2,f3,f4,f12,f14',
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      fltt: 2
    };
    
    const response = await axios.get(url, { params });
    
    if (response.data && response.data.data && response.data.data.diff) {
      // 添加类型注解
      interface EastMoneyIndexData {
        f2: number; // 价格
        f3: number; // 涨跌幅
        f4: number; // 涨跌额
        f12: string; // 代码
        f14: string; // 名称
      }
      
      const result = response.data.data.diff.map((item: EastMoneyIndexData) => ({
        code: item.f12,
        name: item.f14,
        // 东方财富返回的指数点数放大了100倍，需要除以100显示
        price: item.f2 / 100,
        // 涨跌幅也需要除以100转换为正确的百分比
        changePercent: item.f3 / 100,
        // 涨跌额也需要除以100
        change: item.f4 / 100
      }));
      
      // 设置缓存
      cache.set(cacheKey, result, CACHE_TTL.MARKET_INDICES);
      
      return result;
    }
    
    return [];
  } catch (error) {
    logger.error('获取指数数据失败:', error);
    throw error;
  }
}

/**
 * 获取股票列表
 * @param market 市场类型：'SH'(上海)或'SZ'(深圳)
 */
export async function getStockList(market = 'SH') {
  const cacheKey = `stock_list_${market}`;
  
  // 检查缓存
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // 1: 上证, 0: 深证
    const marketCode = market.toUpperCase() === 'SH' ? '1' : '0';
    const url = 'https://80.push2.eastmoney.com/api/qt/clist/get';
    
    const params = {
      pn: 1, // 页码
      pz: 2000, // 每页数量，设置较大值以获取所有股票
      po: 1, // 排序方向，1: 升序，0: 降序
      np: 1,
      ut: 'bd1d9ddb04089700cf9c27f6f7426281',
      fltt: 2,
      invt: 2,
      fid: 'f3', // 排序字段，f3: 涨跌幅
      fs: `m:${marketCode}`, // 市场筛选
      fields: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152'
    };
    
    const response = await axios.get(url, { params });
    
    if (response.data && response.data.data && response.data.data.diff) {
      // 添加类型注解
      interface EastMoneyStockData {
        f2: number; // 价格
        f3: number; // 涨跌幅
        f4: number; // 涨跌额
        f5: number; // 成交量
        f6: number; // 成交额
        f7: number; // 振幅
        f8: number; // 换手率
        f9: number; // 市盈率
        f12: string; // 股票代码
        f14: string; // 股票名称
        f20: number; // 总市值
        f21: number; // 流通市值
        f23: number; // 市净率
      }
      
      const result = response.data.data.diff.map((item: EastMoneyStockData) => ({
        code: item.f12, // 股票代码
        name: item.f14, // 股票名称
        price: item.f2 / 100, // 当前价格
        change: item.f4 / 100, // 涨跌额
        changePercent: item.f3 / 100, // 涨跌幅
        volume: item.f5, // 成交量
        amount: item.f6, // 成交额
        amplitude: item.f7 / 100, // 振幅
        turnoverRate: item.f8 / 100, // 换手率
        pe: item.f9, // 市盈率
        pb: item.f23, // 市净率
        marketCap: item.f20, // 总市值
        circulationMarketCap: item.f21 // 流通市值
      }));
      
      // 设置缓存
      cache.set(cacheKey, result, CACHE_TTL.STOCK_LIST);
      
      return result;
    }
    
    return [];
  } catch (error) {
    logger.error(`获取${market}市场股票列表失败:`, error);
    throw error;
  }
}

/**
 * 获取股票分时数据
 * @param symbol 股票代码
 */
export async function getTimeSeriesData(symbol: string) {
  try {
    // 处理股票代码
    let market = '0'; // 深市
    let code = symbol;
    
    // 判断是否为指数类型
    const isIndex = symbol.startsWith('sh000') || symbol.startsWith('sz399') || symbol.startsWith('sh000300');
    
    // 如果是6开头，应该是上海的股票
    if (symbol.startsWith('6')) {
      market = '1';
    } else if (symbol.startsWith('sh') || symbol.startsWith('sz')) {
      // 处理带有市场前缀的代码
      market = symbol.startsWith('sh') ? '1' : '0';
      code = symbol.substring(2);
    }
    
    const secid = `${market}.${code}`;
    const url = 'https://push2.eastmoney.com/api/qt/stock/trends2/get';
    
    const params = {
      secid,
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13',
      fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
      iscr: 0,
      ndays: 1
    };
    
    const response = await axios.get(url, { params });
    
    if (response.data && response.data.data && response.data.data.trends) {
      const trends = response.data.data.trends;
      
      // 转换数据格式
      return trends.map((item: string) => {
        const [time, price, avgPrice, change, changePercent, volume, amount] = item.split(',');
        
        // 对于指数类型数据，价格、涨跌额和涨跌幅都需要除以100（东方财富API返回的指数数据放大了100倍）
        if (isIndex) {
          return {
            time,
            price: parseFloat(price) / 100,
            avgPrice: parseFloat(avgPrice) / 100,
            change: parseFloat(change) / 100,
            changePercent: parseFloat(changePercent) / 100, // 涨跌幅百分比也除以100
            volume: parseInt(volume),
            amount: parseFloat(amount)
          };
        } else {
          // 普通股票数据不需要特殊处理
          return {
            time,
            price: parseFloat(price),
            avgPrice: parseFloat(avgPrice),
            change: parseFloat(change),
            changePercent: parseFloat(changePercent),
            volume: parseInt(volume),
            amount: parseFloat(amount)
          };
        }
      });
    }
    
    return [];
  } catch (error) {
    logger.error(`获取股票${symbol}分时数据失败:`, error);
    throw error;
  }
}

/**
 * 获取热门股票数据
 * 根据市值、流通市值、成交量等指标获取热门股票
 */
export async function getHotStocks(count: number = 20) {
  try {
    // 先获取上证和深证的股票列表
    const shStocks = await getStockList('SH');
    const szStocks = await getStockList('SZ');
    
    // 合并列表
    const allStocks = [...shStocks, ...szStocks];
    
    // 按成交额排序
    const sortedStocks = allStocks
      .filter(stock => stock.price > 0) // 过滤掉停牌的股票
      .sort((a, b) => b.amount - a.amount);
    
    // 获取前count只股票
    return sortedStocks.slice(0, count);
  } catch (error) {
    logger.error('获取热门股票失败:', error);
    throw error;
  }
} 