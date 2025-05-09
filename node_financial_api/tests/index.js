/**
 * 金融API服务测试运行器
 */
const sinaFinanceTests = require('./sinaFinanceService.test');
const eastMoneyTests = require('./eastMoneyService.test');

/**
 * 运行所有测试
 */
async function runAllTests() {
  // 运行新浪财经API测试
  await sinaFinanceTests.runAllTests();
  
  // 运行东方财富API测试
  await eastMoneyTests.runAllTests();
}

// 当直接运行此文件时，执行所有测试
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests
}; 