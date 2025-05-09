/**
 * 热门股票数据分析
 * 分析20只热门、推荐、有潜力的股票，并获取所有可用的API数据
 */
const { sinaFinance, eastMoney } = require('../src');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

// 定义热门股票列表
const HOT_STOCKS = [
  { name: '比亚迪', code: '002594', market: 'sz', fullCode: 'sz002594', description: '新能源汽车龙头' },
  { name: '宁德时代', code: '300750', market: 'sz', fullCode: 'sz300750', description: '动力电池龙头' },
  { name: '隆基绿能', code: '601012', market: 'sh', fullCode: 'sh601012', description: '光伏组件全球第一' },
  { name: '寒武纪', code: '688256', market: 'sh', fullCode: 'sh688256', description: 'AI芯片细分龙头' },
  { name: '通威股份', code: '600438', market: 'sh', fullCode: 'sh600438', description: '光伏硅料龙头' },
  { name: '赣锋锂业', code: '002460', market: 'sz', fullCode: 'sz002460', description: '国内最大锂矿生产商' },
  { name: '华友钴业', code: '603799', market: 'sh', fullCode: 'sh603799', description: '钴化学品生产商龙头' },
  { name: '阳光电源', code: '300274', market: 'sz', fullCode: 'sz300274', description: '光伏逆变器全球第一' },
  { name: '中芯国际', code: '688981', market: 'sh', fullCode: 'sh688981', description: '半导体晶圆代工龙头' },
  { name: '紫金矿业', code: '601899', market: 'sh', fullCode: 'sh601899', description: '黄金开采龙头' },
  { name: '韦尔股份', code: '603501', market: 'sh', fullCode: 'sh603501', description: '半导体CIS芯片龙头' },
  { name: '士兰微', code: '600460', market: 'sh', fullCode: 'sh600460', description: '功率半导体IDM龙头' },
  { name: '福耀玻璃', code: '600660', market: 'sh', fullCode: 'sh600660', description: '汽车玻璃龙头' },
  { name: '恒瑞医药', code: '600276', market: 'sh', fullCode: 'sh600276', description: '创新药龙头' },
  { name: '万华化学', code: '600309', market: 'sh', fullCode: 'sh600309', description: '化工行业龙头' },
  { name: '东方财富', code: '300059', market: 'sz', fullCode: 'sz300059', description: '互联网金融信息服务龙头' },
  { name: '贵州茅台', code: '600519', market: 'sh', fullCode: 'sh600519', description: '白酒行业龙头' },
  { name: '中国平安', code: '601318', market: 'sh', fullCode: 'sh601318', description: '保险行业龙头' },
  { name: '歌尔股份', code: '002241', market: 'sz', fullCode: 'sz002241', description: '声学器件龙头' },
  { name: '立讯精密', code: '002475', market: 'sz', fullCode: 'sz002475', description: '电子连接器龙头' }
];

// 创建输出目录
const OUTPUT_DIR = path.join(__dirname, 'output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

/**
 * 获取股票实时行情数据（使用东方财富API）
 * @param {Array} stocks 股票列表
 * @returns {Promise<Array>} 股票实时行情数据
 */
async function getStocksQuoteData(stocks) {
  console.log('获取股票实时行情数据...');
  
  const result = [];
  for (const stock of stocks) {
    try {
      const data = await eastMoney.getStockQuote(stock.code);
      result.push({
        ...stock,
        quoteData: data
      });
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n获取${stock.name}(${stock.code})实时行情失败:`, error.message);
      result.push({
        ...stock,
        quoteData: null
      });
      process.stdout.write('x');
    }
  }
  console.log('\n股票实时行情数据获取完成');
  return result;
}

/**
 * 获取股票实时行情数据（使用新浪财经API，与东方财富数据对比）
 * @param {Array} stocks 股票列表
 * @returns {Promise<Array>} 股票实时行情数据
 */
async function getSinaRealTimeData(stocks) {
  console.log('获取新浪财经股票实时数据...');
  
  try {
    const stockCodes = stocks.map(stock => stock.fullCode);
    const data = await sinaFinance.getStockRealTimeData(stockCodes);
    console.log('新浪财经股票实时数据获取完成');
    return data;
  } catch (error) {
    console.error('获取新浪财经实时数据失败:', error.message);
    return {};
  }
}

/**
 * 获取股票K线数据（使用东方财富API）
 * @param {Array} stocks 股票列表
 * @param {string} period 周期类型：'101'(日线), '102'(周线), '103'(月线)
 * @param {number} count 获取数量
 * @returns {Promise<Array>} 股票K线数据
 */
async function getStocksKLineData(stocks, period = '101', count = 30) {
  const periodText = {
    '101': '日',
    '102': '周',
    '103': '月',
    '104': '5分钟',
    '105': '15分钟',
    '106': '30分钟',
    '107': '60分钟'
  }[period];
  
  console.log(`获取${periodText}K线数据...`);
  
  const result = [];
  for (const stock of stocks) {
    try {
      const data = await eastMoney.getKLineData(stock.code, period, count);
      result.push({
        ...stock,
        klineData: data
      });
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n获取${stock.name}(${stock.code})${periodText}K线数据失败:`, error.message);
      result.push({
        ...stock,
        klineData: []
      });
      process.stdout.write('x');
    }
  }
  console.log(`\n${periodText}K线数据获取完成`);
  return result;
}

/**
 * 获取股票盘口数据（五档买卖盘）
 * @param {Array} stocks 股票列表
 * @returns {Promise<Array>} 股票盘口数据
 */
async function getStocksOrderBook(stocks) {
  console.log('获取股票盘口数据...');
  
  const result = [];
  for (const stock of stocks) {
    try {
      const data = await eastMoney.getStockOrderBook(stock.code);
      result.push({
        ...stock,
        orderBookData: data
      });
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n获取${stock.name}(${stock.code})盘口数据失败:`, error.message);
      result.push({
        ...stock,
        orderBookData: null
      });
      process.stdout.write('x');
    }
  }
  console.log('\n股票盘口数据获取完成');
  return result;
}

/**
 * 获取指数实时数据
 * @returns {Promise<Object>} 指数实时数据
 */
async function getMarketIndices() {
  console.log('获取市场指数数据...');
  
  try {
    // 从东方财富获取指数数据
    const eastMoneyIndices = await eastMoney.getMarketIndices();
    console.log('东方财富市场指数数据获取完成');
    
    // 从新浪财经获取指数数据
    const sinaIndices = await sinaFinance.getIndicesData();
    console.log('新浪财经市场指数数据获取完成');
    
    return {
      eastMoneyIndices,
      sinaIndices
    };
  } catch (error) {
    console.error('获取市场指数数据失败:', error.message);
    return {
      eastMoneyIndices: [],
      sinaIndices: {}
    };
  }
}

/**
 * 获取股票历史交易数据
 * @param {Array} stocks 股票列表
 * @param {string} date 日期，格式：YYYY-MM-DD
 * @returns {Promise<Array>} 股票历史交易数据
 */
async function getHistoricalTransactionData(stocks, date) {
  console.log(`获取${date}历史交易数据...`);
  
  const result = [];
  for (const stock of stocks) {
    try {
      const data = await sinaFinance.getHistoricalTransactionData(stock.fullCode, date);
      result.push({
        ...stock,
        historicalData: data
      });
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n获取${stock.name}(${stock.code})历史交易数据失败:`, error.message);
      result.push({
        ...stock,
        historicalData: []
      });
      process.stdout.write('x');
    }
  }
  console.log('\n历史交易数据获取完成');
  return result;
}

/**
 * 获取股票分时数据
 * @param {Array} stocks 股票列表
 * @returns {Promise<Array>} 股票分时数据
 */
async function getTimeSeriesData(stocks) {
  console.log('获取股票分时数据...');
  
  const result = [];
  for (const stock of stocks) {
    try {
      const data = await eastMoney.getTimeSeriesData(stock.code);
      result.push({
        ...stock,
        timeSeriesData: data.slice(0, 10) // 只保留前10条数据，避免数据过大
      });
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n获取${stock.name}(${stock.code})分时数据失败:`, error.message);
      result.push({
        ...stock,
        timeSeriesData: []
      });
      process.stdout.write('x');
    }
  }
  console.log('\n股票分时数据获取完成');
  return result;
}

/**
 * 获取上证和深证股票列表
 * @returns {Promise<Object>} 股票列表
 */
async function getMarketStockList() {
  console.log('获取股票列表数据...');
  
  try {
    // 获取上海股票列表
    const shStocks = await eastMoney.getStockList('SH');
    console.log(`获取到上海股票列表：${shStocks.length}只`);
    
    // 获取深圳股票列表
    const szStocks = await eastMoney.getStockList('SZ');
    console.log(`获取到深圳股票列表：${szStocks.length}只`);
    
    return {
      shStocks,
      szStocks
    };
  } catch (error) {
    console.error('获取股票列表失败:', error.message);
    return {
      shStocks: [],
      szStocks: []
    };
  }
}

/**
 * 分析数据并生成报告
 * @param {Object} data 股票数据
 * @returns {Object} 分析报告
 */
function analyzeData(data) {
  console.log('分析数据...');
  
  // 解析数据
  const { quoteData, orderBookData, dailyKLineData, weeklyKLineData, monthlyKLineData } = data;
  
  // 1. 市值排名
  const marketCapRanking = [...quoteData]
    .filter(item => item.quoteData && item.quoteData.marketCap)
    .sort((a, b) => b.quoteData.marketCap - a.quoteData.marketCap);
  
  // 2. 涨幅排名
  const changePercentRanking = [...quoteData]
    .filter(item => item.quoteData && item.quoteData.changePercent !== undefined)
    .sort((a, b) => b.quoteData.changePercent - a.quoteData.changePercent);
  
  // 3. 换手率排名
  const turnoverRateRanking = [...quoteData]
    .filter(item => item.quoteData && item.quoteData.turnoverRate !== undefined)
    .sort((a, b) => b.quoteData.turnoverRate - a.quoteData.turnoverRate);
  
  // 4. 市盈率排名
  const peRanking = [...quoteData]
    .filter(item => item.quoteData && item.quoteData.pe !== undefined && item.quoteData.pe > 0)
    .sort((a, b) => a.quoteData.pe - b.quoteData.pe);
  
  // 5. 市净率排名
  const pbRanking = [...quoteData]
    .filter(item => item.quoteData && item.quoteData.pb !== undefined && item.quoteData.pb > 0)
    .sort((a, b) => a.quoteData.pb - b.quoteData.pb);
  
  // 6. 计算月度涨幅
  const monthlyChange = [];
  for (const stock of monthlyKLineData) {
    if (stock.klineData && stock.klineData.length >= 2) {
      const latestData = stock.klineData[stock.klineData.length - 1];
      const firstData = stock.klineData[0];
      const changePercent = ((latestData.close - firstData.open) / firstData.open * 100).toFixed(2);
      
      monthlyChange.push({
        name: stock.name,
        code: stock.code,
        description: stock.description,
        monthlyChangePercent: parseFloat(changePercent)
      });
    }
  }
  const monthlyChangeRanking = monthlyChange.sort((a, b) => b.monthlyChangePercent - a.monthlyChangePercent);
  
  return {
    marketCapRanking,
    changePercentRanking,
    turnoverRateRanking,
    peRanking,
    pbRanking,
    monthlyChangeRanking
  };
}

/**
 * 生成数据报告
 * @param {Object} data 分析数据
 */
function generateReport(data) {
  const {
    quoteData, sinaQuoteData, orderBookData, 
    dailyKLineData, weeklyKLineData, monthlyKLineData,
    timeSeriesData, historicalData, indices,
    analyzeResult, stockLists
  } = data;
  
  console.log('生成分析报告...');
  
  // 当前时间
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  
  // 创建报告
  let report = `
# 热门股票数据分析报告
生成时间: ${currentTime}

## 市场指数

`;

  // 添加市场指数数据
  if (indices && indices.eastMoneyIndices && indices.eastMoneyIndices.length > 0) {
    report += `### 东方财富市场指数\n\n`;
    report += `| 指数代码 | 指数名称 | 当前点位 | 涨跌幅 |\n`;
    report += `|---------|---------|----------|--------|\n`;
    
    indices.eastMoneyIndices.forEach(index => {
      report += `| ${index.code} | ${index.name} | ${index.price.toFixed(2)} | ${index.changePercent.toFixed(2)}% |\n`;
    });
    
    report += `\n`;
  }

  if (indices && indices.sinaIndices) {
    report += `### 新浪财经市场指数\n\n`;
    report += `| 指数代码 | 指数名称 | 当前点位 | 涨跌幅 |\n`;
    report += `|---------|---------|----------|--------|\n`;
    
    Object.keys(indices.sinaIndices).forEach(code => {
      const index = indices.sinaIndices[code];
      report += `| ${code} | ${index.name} | ${index.price.toFixed(2)} | ${((index.price - index.prevClose) / index.prevClose * 100).toFixed(2)}% |\n`;
    });
    
    report += `\n`;
  }

  // 添加股票实时行情数据
  report += `## 股票实时行情数据\n\n`;
  report += `| 股票名称 | 股票代码 | 描述 | 最新价 | 涨跌幅 | 涨跌额 | 成交量(万) | 成交额(万元) | 换手率 | 市盈率 | 市净率 | 总市值(亿元) |\n`;
  report += `|---------|---------|------|-------|-------|-------|------------|--------------|--------|--------|--------|---------------|\n`;
  
  quoteData.forEach(stock => {
    if (stock.quoteData) {
      const {
        price, changePercent, change, volume, amount,
        turnoverRate, pe, pb, marketCap
      } = stock.quoteData;
      
      report += `| ${stock.name} | ${stock.code} | ${stock.description} | ${price.toFixed(2)} | ${changePercent.toFixed(2)}% | ${change.toFixed(2)} | ${(volume / 10000).toFixed(2)} | ${(amount / 10000).toFixed(2)} | ${turnoverRate?.toFixed(2) || 'N/A'}% | ${pe?.toFixed(2) || 'N/A'} | ${pb?.toFixed(2) || 'N/A'} | ${(marketCap / 100000000).toFixed(2)} |\n`;
    } else {
      report += `| ${stock.name} | ${stock.code} | ${stock.description} | 数据获取失败 | - | - | - | - | - | - | - | - |\n`;
    }
  });
  
  report += `\n`;

  // 添加分析结果
  if (analyzeResult) {
    // 添加市值排名
    report += `## 分析结果\n\n`;
    report += `### 市值排名\n\n`;
    report += `| 排名 | 股票名称 | 股票代码 | 描述 | 总市值(亿元) |\n`;
    report += `|------|---------|---------|------|---------------|\n`;
    
    analyzeResult.marketCapRanking.forEach((stock, index) => {
      const marketCap = (stock.quoteData.marketCap / 100000000).toFixed(2);
      report += `| ${index + 1} | ${stock.name} | ${stock.code} | ${stock.description} | ${marketCap} |\n`;
    });
    
    report += `\n`;
    
    // 添加涨幅排名
    report += `### 涨幅排名\n\n`;
    report += `| 排名 | 股票名称 | 股票代码 | 描述 | 涨跌幅 |\n`;
    report += `|------|---------|---------|------|--------|\n`;
    
    analyzeResult.changePercentRanking.forEach((stock, index) => {
      report += `| ${index + 1} | ${stock.name} | ${stock.code} | ${stock.description} | ${stock.quoteData.changePercent.toFixed(2)}% |\n`;
    });
    
    report += `\n`;
    
    // 添加估值排名
    report += `### 市盈率排名（从低到高）\n\n`;
    report += `| 排名 | 股票名称 | 股票代码 | 描述 | 市盈率 |\n`;
    report += `|------|---------|---------|------|--------|\n`;
    
    analyzeResult.peRanking.forEach((stock, index) => {
      report += `| ${index + 1} | ${stock.name} | ${stock.code} | ${stock.description} | ${stock.quoteData.pe.toFixed(2)} |\n`;
    });
    
    report += `\n`;
    
    // 添加月度涨幅排名
    report += `### 月度涨幅排名\n\n`;
    report += `| 排名 | 股票名称 | 股票代码 | 描述 | 月度涨幅 |\n`;
    report += `|------|---------|---------|------|----------|\n`;
    
    analyzeResult.monthlyChangeRanking.forEach((stock, index) => {
      report += `| ${index + 1} | ${stock.name} | ${stock.code} | ${stock.description} | ${stock.monthlyChangePercent}% |\n`;
    });
    
    report += `\n`;
  }

  // 添加盘口数据
  report += `## 五档买卖盘数据\n\n`;
  
  orderBookData.forEach(stock => {
    if (!stock.orderBookData) {
      return;
    }
    
    report += `### ${stock.name}(${stock.code}) - ${stock.description}\n\n`;
    report += `当前价: ${stock.orderBookData.price.toFixed(2)}, 涨跌幅: ${stock.orderBookData.changePercent.toFixed(2)}%\n\n`;
    
    report += `#### 卖盘\n\n`;
    report += `| 档位 | 价格 | 数量 |\n`;
    report += `|------|------|------|\n`;
    
    if (stock.orderBookData.asks && stock.orderBookData.asks.length > 0) {
      // 卖盘数据，从高到低展示
      for (let i = stock.orderBookData.asks.length - 1; i >= 0; i--) {
        const ask = stock.orderBookData.asks[i];
        report += `| 卖${stock.orderBookData.asks.length - i} | ${ask.price.toFixed(2)} | ${ask.volume} |\n`;
      }
    } else {
      report += `| - | - | - |\n`;
    }
    
    report += `\n#### 买盘\n\n`;
    report += `| 档位 | 价格 | 数量 |\n`;
    report += `|------|------|------|\n`;
    
    if (stock.orderBookData.bids && stock.orderBookData.bids.length > 0) {
      // 买盘数据，从高到低展示
      stock.orderBookData.bids.forEach((bid, index) => {
        report += `| 买${index + 1} | ${bid.price.toFixed(2)} | ${bid.volume} |\n`;
      });
    } else {
      report += `| - | - | - |\n`;
    }
    
    report += `\n`;
  });

  // 添加K线数据摘要（日线）
  report += `## K线数据摘要（日线）\n\n`;
  report += `| 股票名称 | 股票代码 | 最新收盘价 | 最高价 | 最低价 | 30日涨幅 | 30日振幅 | 30日均成交量(万) |\n`;
  report += `|---------|---------|------------|--------|--------|----------|----------|-----------------|\n`;
  
  dailyKLineData.forEach(stock => {
    if (stock.klineData && stock.klineData.length > 0) {
      const latestData = stock.klineData[stock.klineData.length - 1];
      const firstData = stock.klineData[0];
      
      // 计算30日涨幅
      const changePercent = ((latestData.close - firstData.open) / firstData.open * 100).toFixed(2);
      
      // 计算30日最高价和最低价
      let highest = -Infinity;
      let lowest = Infinity;
      let totalVolume = 0;
      
      stock.klineData.forEach(kline => {
        highest = Math.max(highest, kline.high);
        lowest = Math.min(lowest, kline.low);
        totalVolume += kline.volume;
      });
      
      // 计算振幅
      const amplitude = ((highest - lowest) / lowest * 100).toFixed(2);
      
      // 计算平均成交量
      const avgVolume = (totalVolume / stock.klineData.length / 10000).toFixed(2);
      
      report += `| ${stock.name} | ${stock.code} | ${latestData.close.toFixed(2)} | ${highest.toFixed(2)} | ${lowest.toFixed(2)} | ${changePercent}% | ${amplitude}% | ${avgVolume} |\n`;
    } else {
      report += `| ${stock.name} | ${stock.code} | 数据获取失败 | - | - | - | - | - |\n`;
    }
  });
  
  report += `\n`;

  // 添加股票分时数据摘要
  report += `## 分时数据摘要\n\n`;
  report += `以下展示各股票最新的几条分时数据：\n\n`;
  
  timeSeriesData.forEach(stock => {
    if (stock.timeSeriesData && stock.timeSeriesData.length > 0) {
      report += `### ${stock.name}(${stock.code}) - ${stock.description}\n\n`;
      report += `| 时间 | 价格 | 均价 | 涨跌额 | 涨跌幅 | 成交量 | 成交额 |\n`;
      report += `|------|------|------|--------|--------|--------|--------|\n`;
      
      // 展示最新的几条分时数据
      stock.timeSeriesData.forEach(item => {
        report += `| ${item.time} | ${item.price.toFixed(2)} | ${item.avgPrice.toFixed(2)} | ${item.change.toFixed(2)} | ${item.changePercent}% | ${item.volume} | ${item.amount.toFixed(2)} |\n`;
      });
      
      report += `\n`;
    }
  });

  // 添加股票列表摘要
  if (stockLists && stockLists.shStocks && stockLists.szStocks) {
    report += `## 沪深股票市场概况\n\n`;
    report += `- 上海证券交易所（沪市）股票数量：${stockLists.shStocks.length}只\n`;
    report += `- 深圳证券交易所（深市）股票数量：${stockLists.szStocks.length}只\n`;
    report += `- 沪深两市股票总数：${stockLists.shStocks.length + stockLists.szStocks.length}只\n\n`;
  }
  
  // 写入报告文件
  const reportFile = path.join(OUTPUT_DIR, `hot_stocks_report_${dayjs().format('YYYYMMDD_HHmmss')}.md`);
  fs.writeFileSync(reportFile, report);
  
  console.log(`报告已生成：${reportFile}`);
  
  // 生成JSON格式的完整数据文件
  const jsonData = {
    generatedTime: currentTime,
    quoteData,
    sinaQuoteData,
    orderBookData,
    dailyKLineData,
    weeklyKLineData,
    monthlyKLineData,
    timeSeriesData,
    historicalData,
    indices,
    analyzeResult
  };
  
  const jsonFile = path.join(OUTPUT_DIR, `hot_stocks_data_${dayjs().format('YYYYMMDD_HHmmss')}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));
  
  console.log(`完整数据已保存：${jsonFile}`);
}

/**
 * 运行热门股票分析
 */
async function runHotStocksAnalysis() {
  console.log('开始分析热门股票数据...');
  console.log(`共选择了${HOT_STOCKS.length}只热门股票进行分析`);
  
  try {
    // 获取股票实时数据（东方财富）
    const quoteData = await getStocksQuoteData(HOT_STOCKS);
    
    // 获取股票实时数据（新浪财经）
    const sinaQuoteData = await getSinaRealTimeData(HOT_STOCKS);
    
    // 获取股票盘口数据
    const orderBookData = await getStocksOrderBook(HOT_STOCKS);
    
    // 获取K线数据（日线）
    const dailyKLineData = await getStocksKLineData(HOT_STOCKS, '101', 30);
    
    // 获取K线数据（周线）
    const weeklyKLineData = await getStocksKLineData(HOT_STOCKS, '102', 30);
    
    // 获取K线数据（月线）
    const monthlyKLineData = await getStocksKLineData(HOT_STOCKS, '103', 30);
    
    // 获取分时数据
    const timeSeriesData = await getTimeSeriesData(HOT_STOCKS);
    
    // 获取历史交易数据（最近一个交易日）
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const historicalData = await getHistoricalTransactionData(HOT_STOCKS, yesterday);
    
    // 获取指数数据
    const indices = await getMarketIndices();
    
    // 获取股票列表
    const stockLists = await getMarketStockList();
    
    // 分析数据
    const analyzeResult = analyzeData({
      quoteData,
      orderBookData,
      dailyKLineData,
      weeklyKLineData,
      monthlyKLineData
    });
    
    // 生成报告
    generateReport({
      quoteData,
      sinaQuoteData,
      orderBookData,
      dailyKLineData,
      weeklyKLineData,
      monthlyKLineData,
      timeSeriesData,
      historicalData,
      indices,
      analyzeResult,
      stockLists
    });
    
    console.log('热门股票分析完成！');
  } catch (error) {
    console.error('分析过程中出现错误:', error);
  }
}

// 当直接运行此文件时，执行分析
if (require.main === module) {
  runHotStocksAnalysis();
}

module.exports = {
  HOT_STOCKS,
  getStocksQuoteData,
  getSinaRealTimeData,
  getStocksKLineData,
  getStocksOrderBook,
  getTimeSeriesData,
  getHistoricalTransactionData,
  getMarketIndices,
  getMarketStockList,
  analyzeData,
  generateReport,
  runHotStocksAnalysis
}; 