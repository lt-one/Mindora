/**
 * 新浪财经API服务测试
 */
const { sinaFinance } = require('../src');

/**
 * 测试获取股票实时数据
 */
async function testGetStockRealTimeData() {
  console.log('\n============= 测试获取股票实时数据 =============');
  try {
    // 获取单只股票实时数据
    console.log('获取贵州茅台(sh600519)实时数据：');
    const singleStockData = await sinaFinance.getStockRealTimeData('sh600519');
    console.log(singleStockData);
    
    // 获取多只股票实时数据
    console.log('\n获取多只股票实时数据(贵州茅台,平安银行)：');
    const multipleStockData = await sinaFinance.getStockRealTimeData(['sh600519', 'sz000001']);
    console.log(multipleStockData);
  } catch (error) {
    console.error('测试获取股票实时数据失败:', error.message);
  }
}

/**
 * 测试获取K线数据
 */
async function testGetKLineData() {
  console.log('\n============= 测试获取K线数据 =============');
  try {
    // 获取日K线数据
    console.log('获取贵州茅台(sh600519)日K线数据：');
    const dailyKLineData = await sinaFinance.getKLineData('sh600519', 'daily', 10);
    console.log(dailyKLineData);
    
    // 获取周K线数据
    console.log('\n获取贵州茅台(sh600519)周K线数据：');
    const weeklyKLineData = await sinaFinance.getKLineData('sh600519', 'weekly', 10);
    console.log(weeklyKLineData);
    
    // 获取月K线数据
    console.log('\n获取贵州茅台(sh600519)月K线数据：');
    const monthlyKLineData = await sinaFinance.getKLineData('sh600519', 'monthly', 10);
    console.log(monthlyKLineData);
  } catch (error) {
    console.error('测试获取K线数据失败:', error.message);
  }
}

/**
 * 测试获取指数实时数据
 */
async function testGetIndicesData() {
  console.log('\n============= 测试获取指数实时数据 =============');
  try {
    console.log('获取指数实时数据：');
    const indicesData = await sinaFinance.getIndicesData();
    console.log(indicesData);
  } catch (error) {
    console.error('测试获取指数实时数据失败:', error.message);
  }
}

/**
 * 测试获取历史交易数据
 */
async function testGetHistoricalTransactionData() {
  console.log('\n============= 测试获取历史交易数据 =============');
  try {
    // 获取指定日期的历史交易数据
    // 注意：这里需要一个有效的交易日期
    console.log('获取贵州茅台(sh600519)2023-05-10的历史交易数据：');
    const historicalTransactionData = await sinaFinance.getHistoricalTransactionData('sh600519', '2023-05-10');
    console.log(historicalTransactionData);
  } catch (error) {
    console.error('测试获取历史交易数据失败:', error.message);
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('=================== 新浪财经API服务测试 ===================');
  await testGetStockRealTimeData();
  await testGetKLineData();
  await testGetIndicesData();
  await testGetHistoricalTransactionData();
  console.log('=================== 测试完成 ===================');
}

// 当直接运行此文件时执行测试
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testGetStockRealTimeData,
  testGetKLineData,
  testGetIndicesData,
  testGetHistoricalTransactionData,
  runAllTests
}; 