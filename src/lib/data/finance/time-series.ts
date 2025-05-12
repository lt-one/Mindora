/**
 * 时间序列数据相关函数
 * 包含获取分时数据、K线数据等功能
 */

import * as eastMoney from '@/lib/api/finance/eastMoneyService';
import logger from '@/lib/logger';

/**
 * 获取K线数据
 * @param symbol 股票代码
 * @param period 周期类型
 * @param count 数据条数
 * @param source 数据源 ('sina' | 'eastmoney')
 * @param forceRefresh 是否强制刷新
 */
export async function getKLineData(
  symbol: string, 
  period: 'daily' | 'weekly' | 'monthly' | '5min' | '15min' | '30min' | '60min' = 'daily',
  count: number = 90,
  source: 'sina' | 'eastmoney' = 'eastmoney',
  forceRefresh: boolean = false
) {
  try {
    // 转换period为eastMoney API所需的格式
    let periodCode = '101'; // 默认日线
    switch (period) {
      case 'daily': periodCode = '101'; break;
      case 'weekly': periodCode = '102'; break;
      case 'monthly': periodCode = '103'; break;
      case '5min': periodCode = '104'; break;
      case '15min': periodCode = '105'; break;
      case '30min': periodCode = '106'; break;
      case '60min': periodCode = '107'; break;
    }
    
    // 调用东方财富API获取K线数据
    return await eastMoney.getKLineData(symbol, periodCode, count);
  } catch (error) {
    logger.error(`获取股票${symbol}的K线数据失败:`, error);
    throw error;
  }
}

/**
 * 获取分时图数据
 * @param symbol 股票代码
 */
export async function getTimeSeriesData(symbol: string) {
  try {
    return await eastMoney.getTimeSeriesData(symbol);
  } catch (error) {
    logger.error(`获取股票${symbol}的分时数据失败:`, error);
    throw error;
  }
} 