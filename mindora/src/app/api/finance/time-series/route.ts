import { NextRequest, NextResponse } from 'next/server';
import { getTimeSeriesData, getMarketIndices } from '@/lib/data/china-stock-api';
import logger from '@/lib/logger';
import { processFinancialData, calculateChangePercent } from '@/lib/utils';

/**
 * GET: 获取分时图数据
 * @param request 请求对象
 * @returns 响应对象
 */
export async function GET(request: NextRequest) {
  // 获取请求参数
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  
  // 验证参数
  if (!symbol) {
    return NextResponse.json({
      success: false,
      message: '缺少必要参数: symbol'
    }, { status: 400 });
  }
  
  try {
    // 检查是否为指数类型
    const isIndex = symbol.startsWith('sh000') || symbol.startsWith('sz399');
    let indicesData = null;
    
    // 如果是指数类型，先获取市场指数数据以确保与市场概览组件显示一致
    if (isIndex) {
      try {
        indicesData = await getMarketIndices();
      } catch (indexError) {
        logger.warn(`获取市场指数数据失败，将使用分时图API: ${indexError}`);
      }
    }
    
    // 获取分时图数据
    const timeSeriesData = await getTimeSeriesData(symbol);
    
    // 获取股票名称，使用备用数据源
    let stockName = '';
    
    // 根据代码前缀判断是否为指数
    if (isIndex) {
      if (symbol === 'sh000001') stockName = '上证指数';
      else if (symbol === 'sz399001') stockName = '深证成指';
      else if (symbol === 'sz399006') stockName = '创业板指';
      else if (symbol === 'sh000300') stockName = '沪深300';
      else stockName = `${symbol}`;
    } else {
      // 非指数尝试从其他数据源获取名称
      stockName = `${symbol}`;
    }
    
    // 从时间序列数据获取最新价格和昨收价格
    let preClose = 0;
    let latestPrice = null;
    
    // 验证数据并确保格式一致性
    if (Array.isArray(timeSeriesData) && timeSeriesData.length > 0) {
      // 通常昨收价会在数据中提供
      if (timeSeriesData[0].preClose) {
        preClose = timeSeriesData[0].preClose;
      } else {
        // 获取第一个数据点作为参考
        const firstPoint = timeSeriesData[0];
        if (firstPoint && firstPoint.avgPrice) {
          preClose = firstPoint.avgPrice;
        } else if (firstPoint && firstPoint.price) {
          preClose = firstPoint.price;
        }
      }
      
      // 确保没有异常大的价格数据（针对指数可能需要缩放）
      if (isIndex && preClose > 1000) {
        const scalingFactor = 100;
        preClose = preClose / scalingFactor;
        
        // 缩放时间序列中的所有价格数据
        timeSeriesData.forEach(point => {
          if (point.price) point.price = point.price / scalingFactor;
          if (point.avgPrice) point.avgPrice = point.avgPrice / scalingFactor;
          if (point.change) point.change = point.change / scalingFactor;
          if (point.preClose) point.preClose = point.preClose / scalingFactor;
        });
      }
      
      // 获取最新价格
      const latestPoint = timeSeriesData[timeSeriesData.length - 1];
      if (latestPoint) {
        latestPrice = latestPoint.price;
      }
      
      // 对所有数据点应用统一的格式化处理
      timeSeriesData.forEach((point, index) => {
        timeSeriesData[index] = processFinancialData(point);
      });
      
      // 确保preClose也经过相同的处理
      preClose = Number(preClose.toFixed(2));
      
      // 如果是指数类型且有市场指数数据，使用市场指数数据更新最后一个点的价格、涨跌额等
      // 这确保了与市场概览组件数据的一致性
      if (isIndex && indicesData && indicesData[symbol]) {
        const marketData = indicesData[symbol];
        
        // 如果有最新点，直接使用市场概览提供的数据
        if (timeSeriesData.length > 0) {
          const lastPointIndex = timeSeriesData.length - 1;
          
          // 使用市场概览的价格和涨跌数据
          if (marketData.price) {
            timeSeriesData[lastPointIndex].price = marketData.price;
            
            // 直接使用市场概览的涨跌额和涨跌幅，确保数据一致性
            if (marketData.change !== undefined) {
              timeSeriesData[lastPointIndex].change = marketData.change;
            } else if (preClose > 0) {
              // 如果市场概览没有提供涨跌额，则使用统一的计算方法
              timeSeriesData[lastPointIndex].change = Number((marketData.price - preClose).toFixed(2));
            }
            
            if (marketData.changePercent !== undefined) {
              timeSeriesData[lastPointIndex].changePercent = marketData.changePercent;
            } else if (preClose > 0) {
              // 如果市场概览没有提供涨跌幅，则使用统一的计算方法
              timeSeriesData[lastPointIndex].changePercent = calculateChangePercent(marketData.price, preClose);
            }
          }
          
          // 重新应用processFinancialData确保格式一致
          timeSeriesData[lastPointIndex] = processFinancialData(timeSeriesData[lastPointIndex]);
        }
        
        // 更新preClose为市场概览提供的昨收价，如果有
        if (marketData.yesterdayClose) {
          preClose = Number(marketData.yesterdayClose.toFixed(2));
        }
      }
    }
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: {
        symbol,
        name: stockName,
        timePoints: timeSeriesData,
        preClose,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // 记录错误
    logger.error(`获取分时图数据失败: ${symbol}`, error);
    
    // 返回错误响应
    return NextResponse.json({
      success: false,
      message: '获取分时图数据失败: ' + (error as Error).message,
    }, { status: 500 });
  }
} 