/**
 * 金融API服务入口文件
 */
const SinaFinanceService = require('./services/sinaFinanceService');
const EastMoneyService = require('./services/eastMoneyService');

// 创建实例
const sinaFinance = new SinaFinanceService();
const eastMoney = new EastMoneyService();

module.exports = {
  SinaFinanceService,
  EastMoneyService,
  sinaFinance,
  eastMoney
}; 