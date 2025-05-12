/**
 * 客户端日志记录模块兼容层
 * 为了不影响项目运行，提供空操作日志功能
 */

import logger, { logInfo, logError, logWarn, logDebug, logAccess } from './logger-noop';

export {
  logInfo,
  logError,
  logWarn,
  logDebug,
  logAccess
};

export default logger; 