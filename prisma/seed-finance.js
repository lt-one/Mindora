const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

/**
 * 从东方财富API获取市场指数数据
 */
async function getMarketIndices() {
  try {
    // 构建请求参数
    const params = {
      pn: 1,
      pz: 20,
      fs: 'm:1+t:2,m:1+t:23,m:0+t:6,m:0+t:80,m:0+t:5',
      fields: 'f1,f2,f3,f4,f12,f14'
    };

    // 发送请求
    const response = await axios.get('https://push2.eastmoney.com/api/qt/clist/get', {
      params,
      headers: {
        'Referer': 'https://quote.eastmoney.com/center/gridlist.html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('API响应状态码:', response.status);
    
    // 检查API响应结构
    if (response.data) {
      console.log('Response data 结构:', Object.keys(response.data));
    }
    
    if (response.data && response.data.data) {
      console.log('Response data.data 结构:', Object.keys(response.data.data));
    }
    
    if (response.data && response.data.data && response.data.data.diff) {
      console.log('获取到diff数据，类型:', typeof response.data.data.diff);
      
      let diffData = response.data.data.diff;
      
      // 如果diff是对象而非数组，尝试将其转换为数组
      if (!Array.isArray(diffData) && typeof diffData === 'object') {
        console.log('diff是对象，尝试转换为数组');
        diffData = Object.values(diffData);
        console.log('转换后的数组长度:', diffData.length);
      }
      
      // 确保diff是数组
      if (Array.isArray(diffData)) {
        // 处理返回数据
        return diffData.map(item => ({
          code: item.f12,
          name: item.f14,
          price: item.f2 / 100, // 价格需要除以100
          changePercent: item.f3 / 100, // 涨跌幅需要除以100
          change: item.f4 / 100 // 涨跌额需要除以100
        }));
      } else {
        console.error('diff不是数组，无法使用map方法');
        throw new Error('API返回的数据格式不正确：diff不是数组，也无法转换为数组');
      }
    }
    
    console.error('API响应格式不符合预期');
    throw new Error('API响应格式不符合预期');
  } catch (error) {
    console.error('获取市场指数数据出错:', error.message);
    throw error; // 直接抛出错误，不使用备选数据
  }
}

/**
 * 从东方财富API获取热门股票数据
 */
async function getHotStocks(count = 30) {
  try {
    // 构建请求参数
    const params = {
      pn: 1,
      pz: count,
      ut: 'bd1d9ddb04089700cf9c27f6f7426281',
      fltt: 2,
      invt: 2,
      fid: 'f3',
      fs: 'm:0+t:6,m:0+t:13,m:0+t:80,m:1+t:2,m:1+t:23',
      fields: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23',
      _: Date.now()
    };

    // 发送请求
    const response = await axios.get('https://push2.eastmoney.com/api/qt/clist/get', {
      params,
      headers: {
        'Referer': 'https://data.eastmoney.com/bkzj/hy.html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('热门股票API响应状态码:', response.status);
    
    if (response.data && response.data.data) {
      console.log('热门股票data.data 结构:', Object.keys(response.data.data));
    }

    // 检查API响应是否包含期望的数据
    if (response.data && response.data.data && response.data.data.diff) {
      console.log('获取到热门股票diff数据，类型:', typeof response.data.data.diff);
      
      let diffData = response.data.data.diff;
      
      // 如果diff是对象而非数组，尝试将其转换为数组
      if (!Array.isArray(diffData) && typeof diffData === 'object') {
        console.log('热门股票diff是对象，尝试转换为数组');
        diffData = Object.values(diffData);
        console.log('转换后的数组长度:', diffData.length);
      }
      
      // 确保diff是数组
      if (Array.isArray(diffData)) {
        // 处理返回数据
        return diffData.map(item => {
          // 获取股票行业属性（可能需要额外API调用或使用其他字段）
          let sector = '';
          
          // 尝试根据股票代码前缀识别大致行业
          const code = item.f12;
          if (code.startsWith('60')) {
            sector = code.startsWith('600') ? '主板' : '大盘蓝筹';
          } else if (code.startsWith('00')) {
            sector = code.startsWith('000') ? '深主板' : '中小板';
          } else if (code.startsWith('30')) {
            sector = '创业板';
          } else if (code.startsWith('68')) {
            sector = '科创板';
          } else {
            sector = '其他';
          }
          
          return {
            code: item.f12,
            name: item.f14,
            price: item.f2 / 100,
            changePercent: item.f3 / 100,
            volume: item.f5,
            amount: item.f6,
            turnover: item.f8,
            pe: item.f9,
            sector: sector
          };
        });
      } else {
        console.error('热门股票数据格式不正确：diff不是数组，也无法转换为数组');
        throw new Error('热门股票数据格式不正确：diff不是数组，也无法转换为数组');
      }
    }
    
    console.error('热门股票API响应格式不符合预期');
    throw new Error('热门股票API响应格式不符合预期');
  } catch (error) {
    console.error('获取热门股票数据出错:', error.message);
    throw error; // 直接抛出错误，不使用备选数据
  }
}

/**
 * 获取行业数据
 */
async function getIndustryData() {
  try {
    // 构建请求参数 - 获取行业指数
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

    // 发送请求
    const response = await axios.get('https://push2.eastmoney.com/api/qt/clist/get', {
      params,
      headers: {
        'Referer': 'https://data.eastmoney.com/bkzj/hy.html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('行业数据API响应状态码:', response.status);
    
    if (response.data && response.data.data) {
      console.log('行业数据data.data 结构:', Object.keys(response.data.data));
    }

    // 检查API响应
    if (response.data && response.data.data && response.data.data.diff) {
      let diffData = response.data.data.diff;
      
      // 如果diff是对象而非数组，尝试将其转换为数组
      if (!Array.isArray(diffData) && typeof diffData === 'object') {
        console.log('行业数据diff是对象，尝试转换为数组');
        diffData = Object.values(diffData);
        console.log('转换后的数组长度:', diffData.length);
      }
      
      // 确保diff是数组
      if (Array.isArray(diffData)) {
        console.log(`获取到${diffData.length}条行业数据`);
        
        // 处理行业数据
        const industries = diffData;
        
        // 生成每个行业的不同指标数据
        const metrics = ['增长率', '换手率', '成交量', '成交额'];
        const industryMetrics = [];
        
        industries.forEach(industry => {
          // 增长率 - 使用涨跌幅
          industryMetrics.push({
            date: new Date(),
            industryName: industry.f14 || '未知行业',
            metricName: '增长率',
            metricValue: (industry.f3 || 0) / 100, // 涨跌幅
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
        
        return industryMetrics;
      } else {
        console.error('行业数据格式不正确：diff不是数组，也无法转换为数组');
        throw new Error('行业数据格式不正确：diff不是数组，也无法转换为数组');
      }
    }
    
    console.error('行业数据API响应格式不符合预期');
    throw new Error('行业数据API响应格式不符合预期');
  } catch (error) {
    console.error('获取行业数据出错:', error.message);
    throw error; // 直接抛出错误，不使用备选数据
  }
}

/**
 * 获取金融数据并保存到数据库
 */
async function seedFinancialData() {
  console.log('开始导入金融数据...');
  
  try {
    // 从API获取真实市场指数数据
    const marketIndices = await getMarketIndices();
    console.log(`获取到 ${marketIndices.length} 条市场指数数据`);
    
    // 转换为FinancialData模型数据
    const financialData = marketIndices.map(index => ({
      date: new Date(),
      value: index.price,
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
    console.error('导入金融数据时出错:', error.message);
    throw error; // 不进行降级处理，直接抛出错误
  }
}

/**
 * 将市场趋势数据导入数据库
 */
async function seedMarketTrends() {
  console.log('开始导入市场趋势数据...');
  
  try {
    // 获取热门股票数据
    const hotStocks = await getHotStocks(30);
    console.log(`获取到 ${hotStocks.length} 条热门股票数据`);
    
    // 创建行业/板块分布统计
    const sectors = {};
    
    // 分析热门股票数据，统计不同行业/板块的热度
    hotStocks.forEach(stock => {
      const sector = stock.sector;
      if (!sectors[sector]) {
        sectors[sector] = { count: 0, change: 0 };
      }
      sectors[sector].count += 1;
      sectors[sector].change += stock.changePercent;
    });
    
    // 转换行业/板块数据为趋势数据
    const trendData = Object.entries(sectors).map(([sector, data]) => ({
      date: new Date(),
      trendName: `热门板块-${sector}`,
      trendValue: data.count,
      description: `平均涨跌幅: ${(data.change / data.count).toFixed(2)}%`,
      source: 'api-eastmoney'
    }));
    
    // 删除旧数据
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
    console.error('导入市场趋势数据时出错:', error.message);
    throw error; // 不进行降级处理，直接抛出错误
  }
}

/**
 * 导入行业指标数据
 */
async function seedIndustryMetrics() {
  console.log('开始导入行业指标数据...');
  
  try {
    // 获取行业指标数据
    const industryMetrics = await getIndustryData();
    console.log(`获取到 ${industryMetrics.length} 条行业指标数据`);
    
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
    console.error('导入行业指标数据时出错:', error.message);
    throw error; // 不进行降级处理，直接抛出错误
  }
}

/**
 * 导入所有金融相关数据
 */
async function seedFinanceData() {
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
    console.error('导入金融数据时出错:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 执行导入
seedFinanceData()
  .then(() => console.log('数据导入成功完成'))
  .catch(e => {
    console.error('数据导入失败:', e.message);
    process.exit(1);
  }); 
 