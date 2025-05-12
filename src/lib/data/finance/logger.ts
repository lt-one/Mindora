/**
 * 金融模块日志封装
 * 提供空操作日志功能，不执行实际日志记录
 */

// 导出空操作日志函数
export const logger = {
  info: (_message: string, _meta?: Record<string, any>) => {},
  error: (_message: string, _meta?: any) => {},
  warn: (_message: string, _meta?: Record<string, any>) => {},
  debug: (_message: string, _meta?: Record<string, any>) => {}
}; 