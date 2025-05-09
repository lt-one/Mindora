/**
 * 新浪财经API服务
 * 封装新浪财经各种股票数据的获取方法
 */
const axios = require('axios');
const iconv = require('iconv-lite');

class SinaFinanceService {
  /**
   * 获取实时股票数据
   * @param {string|string[]} symbols 股票代码，如：'sh600519'或者['sh600519', 'sz000858']
   * @returns {Promise<Object>} 股票实时数据
   */
  async getStockRealTimeData(symbols) {
    try {
      // 将输入规范化为数组
      const symbolsArray = Array.isArray(symbols) ? symbols : [symbols];
      
      // 构建URL
      const url = `https://hq.sinajs.cn/list=${symbolsArray.join(',')}`;
      
      // 发送请求，并设置Referer绕过新浪的限制
      const response = await axios.get(url, {
        headers: {
          'Referer': 'https://finance.sina.com.cn'
        },
        responseType: 'arraybuffer'
      });
      
      // 解码GBK编码的响应
      const data = iconv.decode(response.data, 'gbk');
      
      // 处理返回结果
      return this.parseStockData(data, symbolsArray);
    } catch (error) {
      console.error('获取实时股票数据失败:', error);
      throw error;
    }
  }

  /**
   * 解析股票数据
   * @param {string} data 原始数据
   * @param {string[]} symbols 股票代码数组
   * @returns {Object} 解析后的数据
   */
  parseStockData(data, symbols) {
    const lines = data.split('\n');
    const result = {};
    
    symbols.forEach((symbol, index) => {
      if (lines[index] && lines[index].length > 0) {
        const line = lines[index];
        // 提取var hq_str_sh600519="贵州茅台,..."中的内容
        const match = line.match(/var hq_str_(.+)="(.*)";/);
        
        if (match && match[2]) {
          const values = match[2].split(',');
          if (values.length >= 33) {
            const stockCode = match[1];
            
            // 股票数据字段映射
            result[stockCode] = {
              name: values[0],
              open: parseFloat(values[1]),
              prevClose: parseFloat(values[2]),
              price: parseFloat(values[3]),
              high: parseFloat(values[4]),
              low: parseFloat(values[5]),
              bid: parseFloat(values[6]),
              ask: parseFloat(values[7]),
              volume: parseInt(values[8]),
              amount: parseFloat(values[9]),
              bid1Volume: parseInt(values[10]),
              bid1Price: parseFloat(values[11]),
              bid2Volume: parseInt(values[12]),
              bid2Price: parseFloat(values[13]),
              bid3Volume: parseInt(values[14]),
              bid3Price: parseFloat(values[15]),
              bid4Volume: parseInt(values[16]),
              bid4Price: parseFloat(values[17]),
              bid5Volume: parseInt(values[18]),
              bid5Price: parseFloat(values[19]),
              ask1Volume: parseInt(values[20]),
              ask1Price: parseFloat(values[21]),
              ask2Volume: parseInt(values[22]),
              ask2Price: parseFloat(values[23]),
              ask3Volume: parseInt(values[24]),
              ask3Price: parseFloat(values[25]),
              ask4Volume: parseInt(values[26]),
              ask4Price: parseFloat(values[27]),
              ask5Volume: parseInt(values[28]),
              ask5Price: parseFloat(values[29]),
              date: values[30],
              time: values[31]
            };
          }
        }
      }
    });
    
    return result;
  }
  
  /**
   * 获取K线数据（使用新浪财经API获取K线数据）
   * @param {string} symbol 股票代码，如：'sh600519'
   * @param {string} period 周期类型：'daily'(日线), 'weekly'(周线), 'monthly'(月线)
   * @param {number} count 获取数量
   * @returns {Promise<Array>} K线数据
   */
  async getKLineData(symbol, period = 'daily', count = 100) {
    try {
      // 确保股票代码格式正确
      const formattedSymbol = this.formatSymbolForKLine(symbol);
      
      // 根据周期类型设置参数
      let scale = 240;
      switch (period) {
        case 'weekly':
          scale = 1680; // 7*240 = 1680 分钟
          break;
        case 'monthly':
          scale = 7200; // 30*240 = 7200 分钟
          break;
        default:
          scale = 240; // 日K线为 240 分钟
          break;
      }
      
      // 构建URL (使用新浪另一个K线接口)
      const url = `https://quotes.sina.cn/cn/api/json_v2.php/CN_MarketDataService.getKLineData`;
      
      const params = {
        symbol: formattedSymbol,
        scale,
        ma: 'no',
        datalen: count
      };
      
      const response = await axios.get(url, { 
        params,
        headers: {
          'Referer': 'https://finance.sina.com.cn'
        }
      });
      
      // 返回的是JSON格式数据
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error(`获取${symbol}的K线数据失败:`, error);
      throw error;
    }
  }
  
  /**
   * 格式化股票代码，用于K线接口
   * @param {string} symbol 股票代码
   * @returns {string} 格式化后的股票代码
   */
  formatSymbolForKLine(symbol) {
    if (symbol.startsWith('sh') || symbol.startsWith('sz')) {
      return symbol;
    }
    
    return symbol.startsWith('6') ? `sh${symbol}` : `sz${symbol}`;
  }
  
  /**
   * 获取指数实时数据
   * @returns {Promise<Object>} 指数实时数据
   */
  async getIndicesData() {
    try {
      // 常用指数代码
      const indices = ['sh000001', 'sz399001', 'sz399006', 'sh000300'];
      return await this.getStockRealTimeData(indices);
    } catch (error) {
      console.error('获取指数数据失败:', error);
      throw error;
    }
  }
  
  /**
   * 获取股票历史交易数据
   * @param {string} symbol 股票代码
   * @param {string} date 日期，格式：YYYY-MM-DD
   * @returns {Promise<Array>} 历史交易数据
   */
  async getHistoricalTransactionData(symbol, date) {
    try {
      // 确保股票代码格式正确，且移除sh/sz前缀
      let code = symbol;
      if (symbol.startsWith('sh') || symbol.startsWith('sz')) {
        code = symbol.substring(2);
      }
      
      // 构建URL
      const url = `https://market.finance.sina.com.cn/transHis.php`;
      
      const params = {
        symbol: code.startsWith('6') ? `sh${code}` : `sz${code}`,
        date
      };
      
      // 发送请求
      const response = await axios.get(url, {
        params,
        headers: {
          'Referer': 'https://finance.sina.com.cn'
        },
        responseType: 'arraybuffer'
      });
      
      // 解码GBK编码的响应
      const html = iconv.decode(response.data, 'gbk');
      
      // 解析HTML获取交易数据
      return this.parseHistoricalTransactionData(html);
    } catch (error) {
      console.error(`获取${symbol}在${date}的历史交易数据失败:`, error);
      throw error;
    }
  }
  
  /**
   * 解析历史交易数据HTML
   * @param {string} html HTML内容
   * @returns {Array} 解析后的数据
   */
  parseHistoricalTransactionData(html) {
    const data = [];
    
    // 使用正则表达式提取表格行
    const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/g;
    const tableMatch = html.match(tableRegex);
    
    if (tableMatch && tableMatch[0]) {
      const table = tableMatch[0];
      
      // 提取表格行
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
      let rowMatch;
      
      // 跳过表头
      let isHeader = true;
      
      while ((rowMatch = rowRegex.exec(table)) !== null) {
        if (isHeader) {
          isHeader = false;
          continue;
        }
        
        // 提取单元格内容
        const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
        const cells = [];
        let cellMatch;
        
        while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
          // 去除HTML标签
          const cellContent = cellMatch[1].replace(/<[^>]+>/g, '').trim();
          cells.push(cellContent);
        }
        
        // 确保有足够的单元格
        if (cells.length >= 4) {
          data.push({
            time: cells[0],
            price: parseFloat(cells[1]),
            volume: parseInt(cells[2].replace(/,/g, '')),
            amount: parseFloat(cells[3].replace(/,/g, ''))
          });
        }
      }
    }
    
    return data;
  }
}

module.exports = SinaFinanceService; 