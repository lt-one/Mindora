/**
 * 应用服务初始化
 * 用于在应用启动时初始化各种服务
 */
import { startFinanceDataScheduler, getFinanceSchedulerStatus } from './scheduler/finance-scheduler';
import logger from './logger-utils';

/**
 * 初始化所有应用服务
 */
export function initializeServices() {
  // 初始化金融数据定时更新服务
  logger.info('正在初始化金融数据定时更新服务...');
  
  // 检查服务是否已经在运行
  const currentStatus = getFinanceSchedulerStatus();
  
  if (!currentStatus.active) {
    // 服务未运行，启动它
    startFinanceDataScheduler();
    logger.info('金融数据定时更新服务已初始化，将在每小时整点更新数据');
  } else {
    logger.info('金融数据定时更新服务已在运行中');
  }
}

/**
 * 获取服务初始化状态
 */
export function getServiceStatus() {
  const financeSchedulerStatus = getFinanceSchedulerStatus();
  
  return {
    financeScheduler: financeSchedulerStatus.active
  };
} 