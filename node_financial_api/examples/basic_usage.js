/**
 * 基本使用示例
 */
const { sinaFinance, eastMoney } = require('../src');

/**
 * 获取股票基本信息
 */
async function getStockBasicInfo() {
  try {
    // 使用新浪财经API获取贵州茅台的实时数据
    console.log('=================== 新浪财经API ===================');
    console.log('获取贵州茅台(sh600519)的实时数据:');
    const sinaData = await sinaFinance.getStockRealTimeData('sh600519');
    console.log(JSON.stringify(sinaData, null, 2));
    
    // 使用东方财富API获取贵州茅台的实时行情
    console.log('\n=================== 东方财富API ===================');
    console.log('获取贵州茅台(600519)的实时行情:');
    const eastMoneyData = await eastMoney.getStockQuote('600519');
    console.log(JSON.stringify(eastMoneyData, null, 2));
  } catch (error) {
    console.error('获取股票基本信息失败:', error.message);
  }
}

/**
 * 获取K线数据
 */
async function getKLineData() {
  try {
    console.log('\n=================== K线数据对比 ===================');
    // 使用新浪财经API获取日K线数据
    console.log('新浪财经API - 获取贵州茅台(sh600519)的日K线数据(最近5条):');
    const sinaKLineData = await sinaFinance.getKLineData('sh600519', 'daily', 5);
    console.log(JSON.stringify(sinaKLineData, null, 2));
    
    // 使用东方财富API获取日K线数据
    console.log('\n东方财富API - 获取贵州茅台(600519)的日K线数据(最近5条):');
    const eastMoneyKLineData = await eastMoney.getKLineData('600519', '101', 5);
    console.log(JSON.stringify(eastMoneyKLineData, null, 2));
  } catch (error) {
    console.error('获取K线数据失败:', error.message);
  }
}

/**
 * 获取大盘指数数据
 */
async function getMarketIndices() {
  try {
    console.log('\n=================== 大盘指数数据 ===================');
    // 使用新浪财经API获取指数实时数据
    console.log('新浪财经API - 获取指数实时数据:');
    const sinaIndicesData = await sinaFinance.getIndicesData();
    console.log(JSON.stringify(sinaIndicesData, null, 2));
    
    // 使用东方财富API获取大盘指数数据
    console.log('\n东方财富API - 获取大盘指数数据:');
    const eastMoneyIndicesData = await eastMoney.getMarketIndices();
    console.log(JSON.stringify(eastMoneyIndicesData, null, 2));
  } catch (error) {
    console.error('获取大盘指数数据失败:', error.message);
  }
}

/**
 * 获取股票列表
 */
async function getStockList() {
  try {
    console.log('\n=================== 股票列表 ===================');
    // 使用东方财富API获取上海股票列表
    console.log('东方财富API - 获取上海股票列表(前3条):');
    const shStockList = await eastMoney.getStockList('SH');
    console.log(JSON.stringify(shStockList.slice(0, 3), null, 2));
    console.log(`共获取上海股票${shStockList.length}条`);
  } catch (error) {
    console.error('获取股票列表失败:', error.message);
  }
}

/**
 * 运行所有示例
 */
async function runAllExamples() {
  await getStockBasicInfo();
  await getKLineData();
  await getMarketIndices();
  await getStockList();
  console.log('\n示例运行完成！');
}

// 当直接运行此文件时，执行所有示例
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  getStockBasicInfo,
  getKLineData,
  getMarketIndices,
  getStockList,
  runAllExamples
};