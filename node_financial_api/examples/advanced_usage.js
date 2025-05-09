/**
 * 高级使用示例
 * 演示如何使用API进行简单的数据分析
 */
const { sinaFinance, eastMoney } = require('../src');

/**
 * 计算股票的技术指标
 * @param {string} symbol 股票代码
 */
async function calculateTechnicalIndicators(symbol) {
  try {
    console.log(`\n=================== ${symbol} 技术指标分析 ===================`);
    
    // 获取日K线数据
    const kLineData = await eastMoney.getKLineData(symbol, '101', 30);
    if (!kLineData || kLineData.length === 0) {
      throw new Error('获取K线数据失败');
    }
    
    console.log(`获取到 ${kLineData.length} 条K线数据`);
    
    // 计算5日、10日、20日均线
    const ma5 = calculateMA(kLineData, 5);
    const ma10 = calculateMA(kLineData, 10);
    const ma20 = calculateMA(kLineData, 20);
    
    console.log('\n均线数据(最近5天):');
    for (let i = 0; i < 5; i++) {
      const index = kLineData.length - 1 - i;
      if (index >= 0) {
        console.log(`${kLineData[index].date}: 收盘价=${kLineData[index].close.toFixed(2)}, MA5=${ma5[index]?.toFixed(2) || 'N/A'}, MA10=${ma10[index]?.toFixed(2) || 'N/A'}, MA20=${ma20[index]?.toFixed(2) || 'N/A'}`);
      }
    }
    
    // 计算MACD指标
    const { DIF, DEA, MACD } = calculateMACD(kLineData);
    
    console.log('\nMACD指标(最近5天):');
    for (let i = 0; i < 5; i++) {
      const index = kLineData.length - 1 - i;
      if (index >= 0) {
        console.log(`${kLineData[index].date}: DIF=${DIF[index]?.toFixed(4) || 'N/A'}, DEA=${DEA[index]?.toFixed(4) || 'N/A'}, MACD=${MACD[index]?.toFixed(4) || 'N/A'}`);
      }
    }
    
    // 计算RSI指标(14日)
    const rsi = calculateRSI(kLineData, 14);
    
    console.log('\nRSI指标(最近5天):');
    for (let i = 0; i < 5; i++) {
      const index = kLineData.length - 1 - i;
      if (index >= 0) {
        console.log(`${kLineData[index].date}: RSI(14)=${rsi[index]?.toFixed(2) || 'N/A'}%`);
      }
    }
    
    // 简单的技术分析结论
    console.log('\n技术分析结论:');
    const latestPrice = kLineData[kLineData.length - 1].close;
    const latestMA5 = ma5[ma5.length - 1];
    const latestMA10 = ma10[ma10.length - 1];
    const latestMA20 = ma20[ma20.length - 1];
    const latestRSI = rsi[rsi.length - 1];
    const latestMACD = MACD[MACD.length - 1];
    const latestDIF = DIF[DIF.length - 1];
    const latestDEA = DEA[DEA.length - 1];
    
    if (latestPrice > latestMA5 && latestPrice > latestMA10 && latestMA5 > latestMA10) {
      console.log('- 价格位于5日和10日均线上方，短期趋势向上');
    } else if (latestPrice < latestMA5 && latestPrice < latestMA10 && latestMA5 < latestMA10) {
      console.log('- 价格位于5日和10日均线下方，短期趋势向下');
    } else {
      console.log('- 均线系统显示价格处于盘整状态');
    }
    
    if (latestRSI > 70) {
      console.log('- RSI超过70，股票可能处于超买状态');
    } else if (latestRSI < 30) {
      console.log('- RSI低于30，股票可能处于超卖状态');
    } else {
      console.log(`- RSI为${latestRSI.toFixed(2)}%，处于中性区域`);
    }
    
    if (latestDIF > latestDEA && latestMACD > 0) {
      console.log('- MACD金叉且柱状图为正，显示上涨动能');
    } else if (latestDIF < latestDEA && latestMACD < 0) {
      console.log('- MACD死叉且柱状图为负，显示下跌动能');
    } else {
      console.log('- MACD指标显示动能不明确');
    }
  } catch (error) {
    console.error('计算技术指标失败:', error.message);
  }
}

/**
 * 计算移动平均线
 * @param {Array} data K线数据
 * @param {number} period 周期
 * @returns {Array} 移动平均线数据
 */
function calculateMA(data, period) {
  const result = new Array(data.length).fill(null);
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result[i] = sum / period;
  }
  
  return result;
}

/**
 * 计算MACD指标
 * @param {Array} data K线数据
 * @param {number} fastPeriod 快速EMA周期(默认12)
 * @param {number} slowPeriod 慢速EMA周期(默认26)
 * @param {number} signalPeriod 信号周期(默认9)
 * @returns {Object} MACD指标数据
 */
function calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const closes = data.map(item => item.close);
  
  // 计算快速EMA
  const fastEMA = calculateEMA(closes, fastPeriod);
  
  // 计算慢速EMA
  const slowEMA = calculateEMA(closes, slowPeriod);
  
  // 计算DIF(差离值)
  const DIF = fastEMA.map((fast, index) => {
    if (fast === null || slowEMA[index] === null) return null;
    return fast - slowEMA[index];
  });
  
  // 计算DEA(信号线)
  const DEA = calculateEMA(DIF.filter(v => v !== null), signalPeriod);
  
  // 填充DEA前面的null值
  const fullDEA = new Array(DIF.length).fill(null);
  let deaIndex = 0;
  for (let i = 0; i < fullDEA.length; i++) {
    if (DIF[i] !== null && deaIndex < DEA.length) {
      fullDEA[i] = DEA[deaIndex++];
    }
  }
  
  // 计算MACD柱状图
  const MACD = DIF.map((dif, index) => {
    if (dif === null || fullDEA[index] === null) return null;
    return (dif - fullDEA[index]) * 2;
  });
  
  return { DIF, DEA: fullDEA, MACD };
}

/**
 * 计算EMA(指数移动平均线)
 * @param {Array} data 价格数据
 * @param {number} period 周期
 * @returns {Array} EMA数据
 */
function calculateEMA(data, period) {
  const result = new Array(data.length).fill(null);
  
  // 计算第一个EMA值(简单平均)
  let sum = 0;
  for (let i = 0; i < period; i++) {
    if (i >= data.length) break;
    sum += data[i];
  }
  result[period - 1] = sum / period;
  
  // 计算后续的EMA值
  const k = 2 / (period + 1);
  for (let i = period; i < data.length; i++) {
    result[i] = data[i] * k + result[i - 1] * (1 - k);
  }
  
  return result;
}

/**
 * 计算RSI指标
 * @param {Array} data K线数据
 * @param {number} period 周期
 * @returns {Array} RSI数据
 */
function calculateRSI(data, period) {
  const result = new Array(data.length).fill(null);
  
  if (data.length <= period) {
    return result;
  }
  
  // 计算价格变化
  const changes = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close);
  }
  
  // 初始化数据
  for (let i = period; i < data.length; i++) {
    let gains = 0;
    let losses = 0;
    
    // 计算周期内的涨跌
    for (let j = i - period; j < i; j++) {
      if (changes[j] >= 0) {
        gains += changes[j];
      } else {
        losses -= changes[j];
      }
    }
    
    if (losses === 0) {
      result[i] = 100;
    } else {
      const rs = gains / losses;
      result[i] = 100 - (100 / (1 + rs));
    }
  }
  
  return result;
}

/**
 * 比较两个数据源的股票数据
 * @param {string} symbol 股票代码
 */
async function compareDataSources(symbol) {
  try {
    console.log(`\n=================== ${symbol} 数据源对比 ===================`);
    
    // 格式化股票代码
    let sinaSymbol = symbol;
    if (!symbol.startsWith('sh') && !symbol.startsWith('sz')) {
      sinaSymbol = symbol.startsWith('6') ? `sh${symbol}` : `sz${symbol}`;
    }
    
    // 获取新浪财经的实时数据
    const sinaData = await sinaFinance.getStockRealTimeData(sinaSymbol);
    
    // 获取东方财富的实时数据
    const eastMoneyData = await eastMoney.getStockQuote(symbol);
    
    console.log('两个数据源的对比结果:');
    console.log('-------------------------------------------------------------------------');
    console.log('| 指标        | 新浪财经                    | 东方财富                   |');
    console.log('-------------------------------------------------------------------------');
    
    // 获取新浪财经数据的第一个对象
    const sinaStock = sinaData[Object.keys(sinaData)[0]];
    
    console.log(`| 股票名称    | ${sinaStock.name.padEnd(26)} | ${eastMoneyData.name.padEnd(26)} |`);
    console.log(`| 当前价格    | ${sinaStock.price.toFixed(2).padEnd(26)} | ${eastMoneyData.price.toFixed(2).padEnd(26)} |`);
    
    // 修复涨跌幅格式化问题
    const sinaChangePercent = ((sinaStock.price - sinaStock.prevClose) / sinaStock.prevClose * 100).toFixed(2);
    const eastMoneyChangePercent = eastMoneyData.changePercent.toFixed(2);
    console.log(`| 涨跌幅      | ${sinaChangePercent}%${' '.repeat(24 - sinaChangePercent.length - 1)} | ${eastMoneyChangePercent}%${' '.repeat(24 - eastMoneyChangePercent.length - 1)} |`);
    
    console.log(`| 今日开盘    | ${sinaStock.open.toFixed(2).padEnd(26)} | ${eastMoneyData.open.toFixed(2).padEnd(26)} |`);
    console.log(`| 最高价      | ${sinaStock.high.toFixed(2).padEnd(26)} | ${eastMoneyData.high.toFixed(2).padEnd(26)} |`);
    console.log(`| 最低价      | ${sinaStock.low.toFixed(2).padEnd(26)} | ${eastMoneyData.low.toFixed(2).padEnd(26)} |`);
    console.log(`| 成交量      | ${sinaStock.volume.toString().padEnd(26)} | ${eastMoneyData.volume.toString().padEnd(26)} |`);
    console.log(`| 成交额      | ${sinaStock.amount.toFixed(2).padEnd(26)} | ${eastMoneyData.amount.toFixed(2).padEnd(26)} |`);
    console.log('-------------------------------------------------------------------------');
    
    // 简化盘口数据对比，避免可能的错误
    console.log('\n买卖盘数据(新浪财经):');
    console.log('-----------------------------------------------');
    console.log('| 档位 | 价格    | 数量    |');
    console.log('-----------------------------------------------');
    
    // 显示卖盘数据(从卖五到卖一)
    for (let i = 5; i >= 1; i--) {
      const askKey = `ask${i}Price`;
      const askVolumeKey = `ask${i}Volume`;
      if (sinaStock[askKey] && sinaStock[askVolumeKey]) {
        console.log(`| 卖${i} | ${sinaStock[askKey].toFixed(2).padEnd(8)} | ${sinaStock[askVolumeKey].toString().padEnd(8)} |`);
      }
    }
    
    // 显示买盘数据(从买一到买五)
    for (let i = 1; i <= 5; i++) {
      const bidKey = `bid${i}Price`;
      const bidVolumeKey = `bid${i}Volume`;
      if (sinaStock[bidKey] && sinaStock[bidVolumeKey]) {
        console.log(`| 买${i} | ${sinaStock[bidKey].toFixed(2).padEnd(8)} | ${sinaStock[bidVolumeKey].toString().padEnd(8)} |`);
      }
    }
    console.log('-----------------------------------------------');
    
    // 获取东方财富的盘口数据
    try {
      const orderBookData = await eastMoney.getStockOrderBook(symbol);
      
      console.log('\n买卖盘数据(东方财富):');
      console.log('-----------------------------------------------');
      console.log('| 档位 | 价格    | 数量    |');
      console.log('-----------------------------------------------');
      
      // 显示卖盘数据(从卖五到卖一)
      for (let i = 4; i >= 0; i--) {
        if (orderBookData.asks && orderBookData.asks[i]) {
          console.log(`| 卖${5-i} | ${orderBookData.asks[i].price.toFixed(2).padEnd(8)} | ${orderBookData.asks[i].volume.toString().padEnd(8)} |`);
        }
      }
      
      // 显示买盘数据(从买一到买五)
      for (let i = 0; i < 5; i++) {
        if (orderBookData.bids && orderBookData.bids[i]) {
          console.log(`| 买${i+1} | ${orderBookData.bids[i].price.toFixed(2).padEnd(8)} | ${orderBookData.bids[i].volume.toString().padEnd(8)} |`);
        }
      }
      console.log('-----------------------------------------------');
    } catch (error) {
      console.log('\n无法获取东方财富盘口数据:', error.message);
    }
    
  } catch (error) {
    console.error('比较数据源失败:', error.message);
  }
}

/**
 * 获取指数实时数据和成分股表现
 */
async function getIndexAndComponents() {
  try {
    console.log('\n=================== 指数及成分股分析 ===================');
    
    // 获取沪深300指数实时数据
    const indicesData = await eastMoney.getMarketIndices();
    const hs300 = indicesData.find(index => index.code === '000300');
    
    if (!hs300) {
      throw new Error('获取沪深300指数数据失败');
    }
    
    console.log(`沪深300指数: ${hs300.name}, 当前点位: ${hs300.price}, 涨跌幅: ${hs300.changePercent}%`);
    
    // 提示：实际应用中，这里应该获取沪深300的成分股列表，但这需要额外的API
    console.log('\n注: 获取完整的沪深300成分股需要额外的API支持。');
    console.log('这里仅以几只知名成分股为例进行演示.');
    
    // 一些知名的沪深300成分股
    const components = [
      '600519', // 贵州茅台
      '601318', // 中国平安
      '600036', // 招商银行
      '000858', // 五粮液
      '000333'  // 美的集团
    ];
    
    // 获取成分股数据
    console.log('\n部分沪深300成分股表现:');
    console.log('-----------------------------------------------------------');
    console.log('| 股票代码 | 股票名称     | 当前价格  | 涨跌幅    | 相对表现 |');
    console.log('-----------------------------------------------------------');
    
    for (const code of components) {
      const stockData = await eastMoney.getStockQuote(code);
      const relativePerfm = (stockData.changePercent - hs300.changePercent).toFixed(2);
      const perfmSign = relativePerfm > 0 ? '+' : '';
      
      console.log(`| ${stockData.code}   | ${stockData.name.padEnd(12)} | ${stockData.price.toFixed(2).padEnd(9)} | ${stockData.changePercent.toFixed(2)}%    | ${perfmSign}${relativePerfm}%   |`);
    }
    
    console.log('-----------------------------------------------------------');
    
  } catch (error) {
    console.error('获取指数及成分股数据失败:', error.message);
  }
}

/**
 * 运行所有高级示例
 */
async function runAdvancedExamples() {
  // 计算贵州茅台的技术指标
  await calculateTechnicalIndicators('600519');
  
  // 比较贵州茅台的两个数据源
  await compareDataSources('600519');
  
  // 获取指数和成分股表现
  await getIndexAndComponents();
  
  console.log('\n高级示例运行完成！');
}

// 当直接运行此文件时，执行高级示例
if (require.main === module) {
  runAdvancedExamples();
}

module.exports = {
  calculateTechnicalIndicators,
  compareDataSources,
  getIndexAndComponents,
  runAdvancedExamples
};