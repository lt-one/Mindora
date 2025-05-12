/**
 * 市场数据相关函数
 * 包含获取市场指数、市场概览等功能
 */

import * as sinaFinance from '@/lib/api/finance/sinaFinanceService';
import * as eastMoney from '@/lib/api/finance/eastMoneyService';
import logger from '@/lib/logger';
import { processFinancialData, calculateChangePercent } from '@/lib/utils';
import { HOT_STOCKS } from './constants';
import { getMultipleStockQuotes } from './stocks';

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