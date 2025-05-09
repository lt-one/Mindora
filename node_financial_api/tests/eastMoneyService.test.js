/**
 * 东方财富API服务测试
 */
const { eastMoney } = require('../src');

/**
 * 测试获取股票实时行情数据
 */
async function testGetStockQuote() {
  console.log('\n============= 测试获取股票实时行情数据 =============');
  try {
    console.log('获取贵州茅台(600519)实时行情数据：');
    const stockQuote = await eastMoney.getStockQuote('600519');
    console.log(stockQuote);
  } catch (error) {
    console.error('测试获取股票实时行情数据失败:', error.message);
  }
}

/**
 * 测试获取股票K线数据
 */
async function testGetKLineData() {
  console.log('\n============= 测试获取股票K线数据 =============');
  try {
    // 获取日K线数据
    console.log('获取贵州茅台(600519)日K线数据：');
    const dailyKLineData = await eastMoney.getKLineData('600519', '101', 10);
    console.log(dailyKLineData);
    
    // 获取周K线数据
    console.log('\n获取贵州茅台(600519)周K线数据：');
    const weeklyKLineData = await eastMoney.getKLineData('600519', '102', 10);
    console.log(weeklyKLineData);
    
    // 获取月K线数据
    console.log('\n获取贵州茅台(600519)月K线数据：');
    const monthlyKLineData = await eastMoney.getKLineData('600519', '103', 10);
    console.log(monthlyKLineData);
    
    // 获取分钟K线数据
    console.log('\n获取贵州茅台(600519)60分钟K线数据：');
    const minuteKLineData = await eastMoney.getKLineData('600519', '107', 10);
    console.log(minuteKLineData);
  } catch (error) {
    console.error('测试获取股票K线数据失败:', error.message);
  }
}

/**
 * 测试获取分时数据
 */
async function testGetTimeSeriesData() {
  console.log('\n============= 测试获取分时数据 =============');
  try {
    console.log('获取贵州茅台(600519)分时数据：');
    const timeSeriesData = await eastMoney.getTimeSeriesData('600519');
    // 数据量可能很大，只打印前5条
    console.log(timeSeriesData.slice(0, 5));
    console.log(`共获取${timeSeriesData.length}条分时数据`);
  } catch (error) {
    console.error('测试获取分时数据失败:', error.message);
  }
}

/**
 * 测试获取股票盘口数据
 */
async function testGetStockOrderBook() {
  console.log('\n============= 测试获取股票盘口数据 =============');
  try {
    console.log('获取贵州茅台(600519)盘口数据：');
    const orderBookData = await eastMoney.getStockOrderBook('600519');
    console.log(orderBookData);
  } catch (error) {
    console.error('测试获取股票盘口数据失败:', error.message);
  }
}

/**
 * 测试获取股票列表
 */
async function testGetStockList() {
  console.log('\n============= 测试获取股票列表 =============');
  try {
    console.log('获取上海股票列表(仅显示前5条)：');
    const shStockList = await eastMoney.getStockList('SH');
    console.log(shStockList.slice(0, 5));
    console.log(`共获取上海股票${shStockList.length}条`);
    
    console.log('\n获取深圳股票列表(仅显示前5条)：');
    const szStockList = await eastMoney.getStockList('SZ');
    console.log(szStockList.slice(0, 5));
    console.log(`共获取深圳股票${szStockList.length}条`);
  } catch (error) {
    console.error('测试获取股票列表失败:', error.message);
  }
}

/**
 * 测试获取大盘指数数据
 */
async function testGetMarketIndices() {
  console.log('\n============= 测试获取大盘指数数据 =============');
  try {
    console.log('获取大盘指数数据：');
    const marketIndices = await eastMoney.getMarketIndices();
    console.log(marketIndices);
  } catch (error) {
    console.error('测试获取大盘指数数据失败:', error.message);
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('=================== 东方财富API服务测试 ===================');
  await testGetStockQuote();
  await testGetKLineData();
  await testGetTimeSeriesData();
  await testGetStockOrderBook();
  await testGetStockList();
  await testGetMarketIndices();
  console.log('=================== 测试完成 ===================');
}

// 当直接运行此文件时执行测试
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testGetStockQuote,
  testGetKLineData,
  testGetTimeSeriesData,
  testGetStockOrderBook,
  testGetStockList,
  testGetMarketIndices,
  runAllTests
}; 