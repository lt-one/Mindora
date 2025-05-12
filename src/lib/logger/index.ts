/**
 * 日志模块入口
 * 导出空操作日志功能
 */

import { LoggerInterface, LogFunction, LogErrorFunction, LogAccessFunction } from './types';
import noopLogger, { 
  logInfo, 
  logError, 
  logWarn, 
  logDebug, 
  logAccess 
} from '../logger-noop';

// 重新导出空操作日志函数
export {
  logInfo,
  logError,
  logWarn,
  logDebug,
  logAccess
};

// 导出类型定义
export type { LoggerInterface, LogFunction, LogErrorFunction, LogAccessFunction };

// 导出默认日志对象
export default noopLogger; 