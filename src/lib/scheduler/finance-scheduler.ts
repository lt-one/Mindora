/**
 * 金融数据定时更新服务
 * 定期调用种子脚本，更新数据库中的金融数据
 */
import { Cron } from 'croner';
import { seedFinanceData } from '@/lib/db/seed-finance';
import logger from '@/lib/logger-utils';

// 存储定时任务引用，用于停止服务
let scheduledTask: Cron | null = null;

// 添加状态变量
let lastUpdateTime: string | null = null;

/**
 * 启动金融数据定时更新服务
 * 默认每小时整点执行一次
 */
export function startFinanceDataScheduler() {
  // 如果已有任务在运行，先停止
  if (scheduledTask) {
    logger.info('重新启动金融数据定时更新服务');
    scheduledTask.stop();
  }

  // 每小时整点执行更新任务 (0 * * * *)
  scheduledTask = new Cron('0 * * * *', async () => {
    logger.info(`【定时任务】开始执行金融数据更新 - ${new Date().toLocaleString()}`);
    
    try {
      // 调用数据导入函数
      await seedFinanceData();
      // 更新最后更新时间
      lastUpdateTime = new Date().toISOString();
      logger.info(`【定时任务】金融数据更新完成 - ${new Date().toLocaleString()}`);
    } catch (error) {
      logger.error('【定时任务】金融数据更新失败:', error);
    }
  });
  
  logger.info('金融数据定时更新服务已启动，将在每小时整点执行');
  
  return scheduledTask;
}

/**
 * 停止金融数据定时更新服务
 */
export function stopFinanceDataScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    logger.info('金融数据定时更新服务已停止');
    return true;
  }
  return false;
}

/**
 * 手动触发一次金融数据更新
 */
export async function triggerFinanceDataUpdate() {
  logger.info(`【手动更新】开始执行金融数据更新 - ${new Date().toLocaleString()}`);
  
  try {
    // 调用数据导入函数
    await seedFinanceData();
    // 更新最后更新时间
    lastUpdateTime = new Date().toISOString();
    logger.info(`【手动更新】金融数据更新完成 - ${new Date().toLocaleString()}`);
    return true;
  } catch (error) {
    logger.error('【手动更新】金融数据更新失败:', error);
    throw error;
  }
}

/**
 * 获取定时任务当前状态
 * @returns 任务状态对象
 */
export function getFinanceSchedulerStatus() {
  return {
    active: scheduledTask !== null,
    nextRun: scheduledTask ? scheduledTask.nextRun()?.toISOString() : null,
    schedule: '每小时整点 (0 * * * *)',
    lastUpdateTime
  };
} 
 