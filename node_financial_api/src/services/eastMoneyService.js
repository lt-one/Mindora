/**
 * 东方财富API服务
 * 封装东方财富各种股票数据的获取方法
 */
const axios = require('axios');
const dayjs = require('dayjs');

class EastMoneyService {
  /**
   * 获取股票实时行情数据
   * @param {string} symbol 股票代码，如：'600519'或'000858'
   * @returns {Promise<Object>} 股票实时行情数据
   */
  async getStockQuote(symbol) {
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
        return {
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
          time: dayjs().format('YYYY-MM-DD HH:mm:ss') // 数据获取时间
        };
      }
      
      throw new Error('无法获取股票数据');
    } catch (error) {
      console.error(`获取股票${symbol}实时行情失败:`, error);
      throw error;
    }
  }
  
  /**
   * 获取股票K线数据
   * @param {string} symbol 股票代码，如：'600519'或'000858'
   * @param {string} period 周期类型：'101'(日线), '102'(周线), '103'(月线), 
   *                         '104'(5分钟), '105'(15分钟), '106'(30分钟), '107'(60分钟)
   * @param {number} count 获取数量
   * @returns {Promise<Array>} K线数据
   */
  async getKLineData(symbol, period = '101', count = 100) {
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
        end: '20500101',
        lmt: count
      };
      
      const response = await axios.get(url, { params });
      
      if (response.data && response.data.data) {
        const data = response.data.data;
        const klines = data.klines || [];
        
        return klines.map(line => {
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
      }
      
      return [];
    } catch (error) {
      console.error(`获取股票${symbol}的K线数据失败:`, error);
      throw error;
    }
  }
  
  /**
   * 获取分时数据
   * @param {string} symbol 股票代码，如：'600519'或'000858'
   * @returns {Promise<Array>} 分时数据
   */
  async getTimeSeriesData(symbol) {
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
      const url = 'https://push2his.eastmoney.com/api/qt/stock/trends2/get';
      
      const params = {
        secid,
        ut: 'fa5fd1943c7b386f172d6893dbfba10b',
        fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
        ndays: 1,
        iscr: 0
      };
      
      const response = await axios.get(url, { params });
      
      if (response.data && response.data.data) {
        const data = response.data.data;
        const trends = data.trends || [];
        
        // 前收盘价，用于计算涨跌幅
        const preClose = data.preClose || 0;
        
        return trends.map(trend => {
          // 分时数据格式：时间,现价,均价,涨跌额,涨跌幅,成交量,成交额,最高,最低
          const values = trend.split(',');
          
          if (values.length >= 8) {
            const price = parseFloat(values[1]);
            const avgPrice = parseFloat(values[2]);
            
            return {
              time: values[0],
              price,
              avgPrice,
              change: price - preClose, // 涨跌额
              changePercent: ((price - preClose) / preClose * 100).toFixed(2), // 涨跌幅
              volume: parseInt(values[5]),
              amount: parseFloat(values[6]),
              high: parseFloat(values[7]),
              low: parseFloat(values[8])
            };
          }
          
          return null;
        }).filter(item => item !== null);
      }
      
      return [];
    } catch (error) {
      console.error(`获取股票${symbol}的分时数据失败:`, error);
      throw error;
    }
  }
  
  /**
   * 获取股票盘口数据（五档买卖盘）
   * @param {string} symbol 股票代码，如：'600519'或'000858'
   * @returns {Promise<Object>} 盘口数据
   */
  async getStockOrderBook(symbol) {
    try {
      // 获取实时行情，其中包含盘口数据
      const quoteData = await this.getStockQuote(symbol);
      
      // 深入获取详细的五档买卖盘数据
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
        
        // 构建买卖盘数据，并添加安全检查
        const result = {
          ...quoteData,
          asks: [
            { price: data.f39 ? data.f39 / 100 : 0, volume: data.f40 || 0 }, // 卖一
            { price: data.f37 ? data.f37 / 100 : 0, volume: data.f38 || 0 }, // 卖二
            { price: data.f35 ? data.f35 / 100 : 0, volume: data.f36 || 0 }, // 卖三
            { price: data.f33 ? data.f33 / 100 : 0, volume: data.f34 || 0 }, // 卖四
            { price: data.f31 ? data.f31 / 100 : 0, volume: data.f32 || 0 }  // 卖五
          ],
          bids: [
            { price: data.f19 ? data.f19 / 100 : 0, volume: data.f20 || 0 }, // 买一
            { price: data.f17 ? data.f17 / 100 : 0, volume: data.f18 || 0 }, // 买二
            { price: data.f15 ? data.f15 / 100 : 0, volume: data.f16 || 0 }, // 买三
            { price: data.f13 ? data.f13 / 100 : 0, volume: data.f14 || 0 }, // 买四
            { price: data.f11 ? data.f11 / 100 : 0, volume: data.f12 || 0 }  // 买五
          ]
        };
        
        // 过滤掉无效的盘口数据（价格为0的）
        result.asks = result.asks.filter(ask => ask.price > 0);
        result.bids = result.bids.filter(bid => bid.price > 0);
        
        return result;
      }
      
      // 如果无法获取盘口数据，返回一个基本的对象
      return {
        ...quoteData,
        asks: [],
        bids: []
      };
    } catch (error) {
      console.error(`获取股票${symbol}盘口数据失败:`, error);
      // 返回一个基本的对象，而不是抛出错误
      return {
        code: symbol,
        name: '',
        price: 0,
        asks: [],
        bids: []
      };
    }
  }
  
  /**
   * 获取股票列表
   * @param {string} market 市场类型：'SH'(上海)或'SZ'(深圳)
   * @returns {Promise<Array>} 股票列表
   */
  async getStockList(market = 'SH') {
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
        return response.data.data.diff.map(item => ({
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
      }
      
      return [];
    } catch (error) {
      console.error(`获取${market}市场股票列表失败:`, error);
      throw error;
    }
  }
  
  /**
   * 获取大盘指数数据
   * @returns {Promise<Array>} 指数数据
   */
  async getMarketIndices() {
    try {
      const url = 'https://push2.eastmoney.com/api/qt/ulist.np/get';
      
      const params = {
        secids: '1.000001,0.399001,0.399006,1.000300', // 上证指数,深证成指,创业板指,沪深300
        ut: 'fa5fd1943c7b386f172d6893dbfba10b',
        fields: 'f1,f2,f3,f4,f12,f13,f14',
        fltt: 2,
        invt: 2,
        _: Date.now()
      };
      
      const response = await axios.get(url, { params });
      
      if (response.data && response.data.data && response.data.data.diff) {
        return response.data.data.diff.map(item => ({
          code: item.f12, // 指数代码
          name: item.f14, // 指数名称
          price: item.f2 / 100, // 当前点位
          change: item.f4 / 100, // 涨跌额
          changePercent: item.f3 / 100 // 涨跌幅
        }));
      }
      
      return [];
    } catch (error) {
      console.error('获取大盘指数数据失败:', error);
      throw error;
    }
  }
}

module.exports = EastMoneyService; 