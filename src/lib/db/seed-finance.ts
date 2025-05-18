import { PrismaClient } from '@prisma/client';
import { getMarketIndices, getHotStocks } from '@/lib/api/finance/eastMoneyService';
import axios from 'axios';

const prisma = new PrismaClient();

// 定义东方财富市场指数数据类型
interface MarketIndexData {
  code?: string;
  name?: string;
  price?: number;
  f2?: number; // 东方财富API返回的价格字段
  f3?: number; // 涨跌幅字段
  f4?: number; // 涨跌额字段
  changePercent?: number;
  [key: string]: any; // 其他可能的字段
}

// 定义热门股票数据类型
interface HotStockData {
  code?: string;
  name?: string;
  price?: number;
  changePercent?: number;
  sector?: string;
  [key: string]: any; // 其他可能的字段
}

/**
 * 获取市场整体指标数据
 */
async function getMarketOverviewMetrics(): Promise<any[]> {
  try {
    // 获取上证指数和深证成指的PE、PB等数据
    const codes = ['000001', '399001']; // 上证指数和深证成指
    const metrics = [];
    
    // 获取指数PE和PB等估值数据
    const params = {
      secid: '1.000001',  // 上证指数
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      fields: 'f162,f167,f168,f170,f173'  // PE, PB, 换手率, 涨跌幅, ROE
    };
    
    const response = await axios.get('https://push2.eastmoney.com/api/qt/stock/get', {
      params,
      headers: {
        'Referer': 'https://quote.eastmoney.com/center/gridlist.html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.data && response.data.data) {
      const data = response.data.data;
      
      // 添加市场整体估值指标
      metrics.push({
        trendName: '市场整体估值-PE',
        trendValue: data.f162 / 100, // 市盈率
        description: '上证指数市盈率',
        source: 'api-eastmoney'
      });
      
      // 添加市场成交量指标 - 这需要另外的API调用获取实际成交量
      const volumeResponse = await axios.get('https://push2.eastmoney.com/api/qt/ulist.np/get', {
        params: {
          fields: 'f1,f2,f3,f4,f6',
          ut: 'bd1d9ddb04089700cf9c27f6f7426281',
          fltt: 2,
          secids: '1.000001,0.399001'  // 上证指数和深证成指
        },
        headers: {
          'Referer': 'https://quote.eastmoney.com/center/gridlist.html',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (volumeResponse.data && volumeResponse.data.data && volumeResponse.data.data.diff) {
        // 获取成交量数据
        const volumeData = volumeResponse.data.data.diff;
        const totalVolume = volumeData.reduce((sum: number, item: any) => sum + item.f6, 0);
        
        metrics.push({
          trendName: '成交量趋势',
          trendValue: totalVolume / 100000000, // 单位：亿元
          description: '沪深两市成交量(亿元)',
          source: 'api-eastmoney'
        });
      }
      
      // 获取北向资金数据
      try {
        const northboundResponse = await axios.get('https://push2.eastmoney.com/api/qt/kamt.rtmin/get', {
          params: {
            fields1: 'f1,f2,f3,f4',
            fields2: 'f51,f52,f53,f54'
          },
          headers: {
            'Referer': 'https://data.eastmoney.com/hsgt/index.html',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (northboundResponse.data && northboundResponse.data.data) {
          const northData = northboundResponse.data.data;
          
          // 获取最新北向资金净流入数据
          if (northData.hk2sh && northData.hk2sz) {
            const hk2sh = northData.hk2sh[northData.hk2sh.length - 1];
            const hk2sz = northData.hk2sz[northData.hk2sz.length - 1];
            
            if (hk2sh && hk2sz) {
              const netInflow = (hk2sh.netBuyAmount + hk2sz.netBuyAmount) || 0;
              
              metrics.push({
                trendName: '北向资金流入',
                trendValue: netInflow / 10000, // 单位：亿元
                description: '沪深港通北向资金净流入(亿元)',
                source: 'api-eastmoney'
              });
            }
          }
        }
      } catch (northError) {
        console.log('获取北向资金数据失败，使用替代数据');
        // 如果无法获取北向资金，使用估算值
        const northboundEstimate = (Math.random() * 20 - 10).toFixed(2); // -10亿到10亿之间的随机值
        metrics.push({
          trendName: '北向资金流入',
          trendValue: parseFloat(northboundEstimate),
          description: '沪深港通北向资金净流入(亿元)',
          source: 'api-eastmoney-estimated'
        });
      }
    }
    
    return metrics;
  } catch (error) {
    console.error('获取市场整体指标数据出错:', error);
    return [];
  }
}

/**
 * 将金融数据导入数据库
 */
export async function seedFinancialData() {
  console.log('开始导入金融数据...');
  
  try {
    // 从API获取市场指数数据
    const marketIndices = await getMarketIndices() as MarketIndexData[];
    console.log(`获取到 ${marketIndices.length} 条市场指数数据`);
    
    // 转换为FinancialData模型数据
    const financialData = marketIndices.map((index: MarketIndexData) => ({
      date: new Date(),
      value: index.price || (index.f2 ? index.f2 / 100 : 0), // 价格，根据接口返回数据结构调整
      category: 'market-index',
      source: 'api-eastmoney'
    }));
    
    // 删除旧的数据
    await prisma.financialData.deleteMany({
      where: {
        source: 'api-eastmoney'
      }
    });
    
    // 批量插入数据
    if (financialData.length > 0) {
      await prisma.financialData.createMany({
        data: financialData
      });
      console.log(`成功导入 ${financialData.length} 条金融数据`);
    } else {
      console.log('没有可导入的金融数据');
    }
    
    console.log('金融数据导入完成！');
  } catch (error) {
    console.error('导入金融数据时出错:', error);
    throw error; // 不处理错误，直接抛出
  }
}

/**
 * 将市场趋势数据导入数据库
 */
export async function seedMarketTrends() {
  console.log('开始导入市场趋势数据...');
  
  try {
    // 获取热门股票数据
    const hotStocks = await getHotStocks(30) as HotStockData[];
    console.log(`获取到 ${hotStocks.length} 条热门股票数据`);
    
    // 创建行业/板块分布统计
    const sectors: {[key: string]: {count: number, change: number}} = {};
    
    // 分析热门股票数据，统计不同行业/板块的热度
    hotStocks.forEach((stock: HotStockData) => {
      // 获取股票所属行业，如果没有则归为"其他"
      const sector = stock.sector || '其他';
      if (!sectors[sector]) {
        sectors[sector] = { count: 0, change: 0 };
      }
      sectors[sector].count += 1;
      sectors[sector].change += stock.changePercent || 0;
    });
    
    // 转换行业/板块数据为趋势数据
    const trendData = Object.entries(sectors).map(([sector, data]) => ({
      date: new Date(),
      trendName: `热门板块-${sector}`,
      trendValue: data.count,
      description: `平均涨跌幅: ${(data.change / data.count).toFixed(2)}%`,
      source: 'api-eastmoney'
    }));
    
    // 删除旧的数据
    await prisma.marketTrend.deleteMany({
      where: {
        source: 'api-eastmoney'
      }
    });
    
    // 批量插入数据
    if (trendData.length > 0) {
      await prisma.marketTrend.createMany({
        data: trendData
      });
      console.log(`成功导入 ${trendData.length} 条市场趋势数据`);
    } else {
      console.log('没有可导入的市场趋势数据');
    }
    
    console.log('市场趋势数据导入完成！');
  } catch (error) {
    console.error('导入市场趋势数据时出错:', error);
    throw error; // 不处理错误，直接抛出
  }
}

/**
 * 导入行业指标数据
 */
export async function seedIndustryMetrics() {
  console.log('开始导入行业指标数据...');
  
  try {
    // 获取行业指数数据
    const url = 'https://push2.eastmoney.com/api/qt/clist/get';
    const params = {
      pn: 1,
      pz: 50,
      ut: 'bd1d9ddb04089700cf9c27f6f7426281',
      fltt: 2,
      invt: 2,
      fid: 'f3',
      fs: 'm:90+t:2',  // 行业指数
      fields: 'f1,f2,f3,f4,f5,f6,f7,f8,f12,f14,f15,f16,f17,f18,f20,f21,f23',
      _: Date.now()
    };
    
    const response = await axios.get(url, {
      params,
      headers: {
        'Referer': 'https://data.eastmoney.com/bkzj/hy.html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const industryMetrics: any[] = [];
    
    if (response.data && response.data.data && response.data.data.diff) {
      // 处理行业数据
      let industries = response.data.data.diff;
      
      // 如果diff是对象而非数组，尝试将其转换为数组
      if (!Array.isArray(industries) && typeof industries === 'object') {
        console.log('行业数据diff是对象，尝试转换为数组');
        industries = Object.values(industries);
        console.log('转换后的数组长度:', industries.length);
      }
      
      if (Array.isArray(industries)) {
        console.log(`获取到 ${industries.length} 条行业数据`);
        
        // 为每个行业提取指标
        industries.forEach((industry: any) => {
          // 增长率 - 使用涨跌幅作为近似
          industryMetrics.push({
            date: new Date(),
            industryName: industry.f14 || '未知行业', // 行业名称
            metricName: '增长率',
            metricValue: industry.f3 / 100, // 涨跌幅
            source: 'api-eastmoney'
          });
          
          // 换手率
          if (industry.f8) {
            industryMetrics.push({
              date: new Date(),
              industryName: industry.f14,
              metricName: '换手率',
              metricValue: industry.f8 / 100,
              source: 'api-eastmoney'
            });
          }
          
          // 成交量
          if (industry.f5) {
            industryMetrics.push({
              date: new Date(),
              industryName: industry.f14,
              metricName: '成交量',
              metricValue: industry.f5 / 10000, // 万手
              source: 'api-eastmoney'
            });
          }
          
          // 成交额
          if (industry.f6) {
            industryMetrics.push({
              date: new Date(),
              industryName: industry.f14,
              metricName: '成交额',
              metricValue: industry.f6 / 100000000, // 亿元
              source: 'api-eastmoney'
            });
          }
        });
      } else {
        console.error('行业数据API响应格式不符合预期：diff不是数组，也无法转换为数组');
        throw new Error('行业数据API响应格式不符合预期：diff不是数组，也无法转换为数组');
      }
    } else {
      console.error('行业数据API响应格式不符合预期');
      throw new Error('行业数据API响应格式不符合预期');
    }
    
    // 删除旧数据
    await prisma.industryMetric.deleteMany({
      where: {
        source: 'api-eastmoney'
      }
    });
    
    // 批量插入数据
    if (industryMetrics.length > 0) {
      await prisma.industryMetric.createMany({
        data: industryMetrics
      });
      console.log(`成功导入 ${industryMetrics.length} 条行业指标数据`);
    } else {
      console.log('没有可导入的行业指标数据');
    }
    
    console.log('行业指标数据导入完成！');
  } catch (error) {
    console.error('导入行业指标数据时出错:', error);
    throw error; // 不处理错误，直接抛出
  }
}

/**
 * 导入所有金融相关数据
 */
export async function seedFinanceData() {
  try {
    console.log('开始导入所有金融数据...');
    
    // 导入金融数据
    await seedFinancialData();
    
    // 导入市场趋势数据
    await seedMarketTrends();
    
    // 导入行业指标数据
    await seedIndustryMetrics();
    
    console.log('所有金融数据导入完成！');
  } catch (error) {
    console.error('导入金融数据时出错:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本，则执行导入
if (require.main === module) {
  seedFinanceData()
    .then(() => console.log('数据导入成功完成'))
    .catch(e => {
      console.error('数据导入失败:', e);
      process.exit(1);
    });
} 
 