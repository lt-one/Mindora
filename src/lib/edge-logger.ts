/**
 * Edge Runtime 空操作日志模块
 * 提供与原始边缘日志模块相同的API接口，但不执行任何实际的日志记录操作
 */

// 空操作日志函数
export const logAccess = (_method: string, _url: string, _status: number, _ip: string, _userAgent?: string, _message?: string) => {};
export const logError = (_error: Error, _context?: string) => {}; 