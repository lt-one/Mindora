/**
 * 技术分析相关函数
 * 包含计算移动平均线、MACD、RSI等技术指标的功能
 */

/**
 * 计算简单移动平均线
 * @param klineData K线数据
 * @param period 周期
 * @param valueKey 计算基准值的键名(默认close收盘价)
 */
export function calculateSMA(klineData: any[], period: number, valueKey: string = 'close') {
  if (!klineData || klineData.length === 0) {
    return [];
  }
  
  const result = [];
  let sum = 0;
  
  for (let i = 0; i < klineData.length; i++) {
    const value = klineData[i][valueKey];
    sum += value;
    
    if (i >= period) {
      // 减去最早的一个值
      sum -= klineData[i - period][valueKey];
    }
    
    // 一旦收集了足够的数据点，就计算移动平均线
    if (i >= period - 1) {
      result.push({
        date: klineData[i].date,
        time: klineData[i].time,
        value: sum / period
      });
    } else {
      // 数据点不足时，可以选择返回null或不返回
      result.push({
        date: klineData[i].date,
        time: klineData[i].time,
        value: null
      });
    }
  }
  
  return result;
}

/**
 * 计算MACD指标
 * @param klineData K线数据
 * @param fastPeriod 快线周期
 * @param slowPeriod 慢线周期
 * @param signalPeriod 信号线周期
 */
export function calculateMACD(
  klineData: any[],
  fastPeriod: number = 12,
  slowPeriod: number = 26, 
  signalPeriod: number = 9
) {
  if (!klineData || klineData.length === 0) {
    return [];
  }
  
  // 提取收盘价
  const prices = klineData.map(item => item.close);
  
  // 计算EMA
  const calculateEMA = (data: number[], period: number) => {
    const k = 2 / (period + 1);
    const emaData: number[] = [];
    let ema = data[0];
    
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        emaData.push(ema);
      } else {
        ema = data[i] * k + ema * (1 - k);
        emaData.push(ema);
      }
    }
    
    return emaData;
  };
  
  // 计算快线和慢线的EMA
  const emaFast = calculateEMA(prices, fastPeriod);
  const emaSlow = calculateEMA(prices, slowPeriod);
  
  // 计算MACD线 (DIF)
  const macdLine = emaFast.map((fast, i) => fast - emaSlow[i]);
  
  // 计算信号线 (DEA)
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  // 计算柱状图 (MACD Histogram)
  const histogram = macdLine.map((macd, i) => macd - signalLine[i]);
  
  // 组织结果
  return klineData.map((item, i) => ({
    date: item.date,
    time: item.time,
    macd: macdLine[i],
    signal: signalLine[i],
    histogram: histogram[i]
  }));
}

/**
 * 计算RSI指标
 * @param klineData K线数据
 * @param period RSI周期
 */
export function calculateRSI(klineData: any[], period: number = 14) {
  if (!klineData || klineData.length <= period) {
    return [];
  }
  
  const result = [];
  let gains = 0;
  let losses = 0;
  
  // 存储每日涨跌幅（百分比）
  const dailyGains: number[] = [];
  const dailyLosses: number[] = [];
  
  // 计算每日涨跌幅
  for (let i = 1; i < klineData.length; i++) {
    const change = klineData[i].close - klineData[i - 1].close;
    const changePercent = (change / klineData[i - 1].close) * 100;
    
    if (change >= 0) {
      dailyGains.push(parseFloat(changePercent.toFixed(2)));
      dailyLosses.push(0);
      
      // 用于初始RSI计算
      if (i <= period) {
        gains += change;
      }
    } else {
      dailyGains.push(0);
      dailyLosses.push(parseFloat(Math.abs(changePercent).toFixed(2)));
      
      // 用于初始RSI计算
      if (i <= period) {
        losses -= change; // 取正值
      }
    }
  }
  
  // 存储平滑后的平均涨跌幅（百分比）
  const avgGains: number[] = [];
  const avgLosses: number[] = [];
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // 第一个RSI值
  let rsi = 100 - (100 / (1 + (avgGain / (avgLoss === 0 ? 0.001 : avgLoss))));
  
  // 转换为百分比
  const avgGainPercent = (avgGain / klineData[period].close) * 100;
  const avgLossPercent = (avgLoss / klineData[period].close) * 100;
  
  // 添加第一个结果点
  result.push({
    date: klineData[period].date,
    time: klineData[period].time,
    rsi,
    avgGain: parseFloat(avgGainPercent.toFixed(2)),
    avgLoss: parseFloat(avgLossPercent.toFixed(2))
  });
  
  avgGains.push(parseFloat(avgGainPercent.toFixed(2)));
  avgLosses.push(parseFloat(avgLossPercent.toFixed(2)));
  
  // 计算剩余的RSI值，使用移动平均 RSI (Wilder's RSI)
  for (let i = period + 1; i < klineData.length; i++) {
    const change = klineData[i].close - klineData[i - 1].close;
    
    let currentGain = 0;
    let currentLoss = 0;
    
    if (change >= 0) {
      currentGain = change;
    } else {
      currentLoss = -change; // 取正值
    }
    
    // 更新平均数据
    avgGain = ((avgGain * (period - 1)) + currentGain) / period;
    avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;
    
    // 防止除以零
    if (avgLoss === 0) {
      rsi = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi = 100 - (100 / (1 + rs));
    }
    
    // 转换为百分比
    const avgGainPercent = (avgGain / klineData[i].close) * 100;
    const avgLossPercent = (avgLoss / klineData[i].close) * 100;
    
    result.push({
      date: klineData[i].date,
      time: klineData[i].time,
      rsi,
      avgGain: parseFloat(avgGainPercent.toFixed(2)),
      avgLoss: parseFloat(avgLossPercent.toFixed(2))
    });
    
    avgGains.push(parseFloat(avgGainPercent.toFixed(2)));
    avgLosses.push(parseFloat(avgLossPercent.toFixed(2)));
  }
  
  return result;
} 