/**
 * 空操作日志模块
 * 提供与原始日志模块相同的API接口，但不执行任何实际的日志记录操作
 * 用于在不影响项目运行的情况下替代原有日志功能
 */

import { LoggerInterface, LogFunction, LogErrorFunction, LogAccessFunction } from './logger/types';

// 创建空操作日志实例
const logger: LoggerInterface = {
  error: (_message: string, _meta?: any) => {},
  warn: (_message: string, _meta?: any) => {},
  info: (_message: string, _meta?: any) => {},
  debug: (_message: string, _meta?: any) => {}
};

// 空操作日志函数
export const logError: LogErrorFunction = (_error: Error, _context?: string) => {};
export const logWarn: LogFunction = (_message: string, _meta?: Record<string, any>) => {};
export const logInfo: LogFunction = (_message: string, _meta?: Record<string, any>) => {};
export const logDebug: LogFunction = (_message: string, _meta?: Record<string, any>) => {};
export const logAccess: LogAccessFunction = (_method: string, _url: string, _status: number, _ip: string, _userAgent?: string) => {};

// 导出类型定义
export type { LoggerInterface, LogFunction, LogErrorFunction, LogAccessFunction };

// 默认导出logger对象
export default logger; 