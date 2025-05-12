/**
 * 日志系统类型定义
 */

// 定义Logger接口
export interface LoggerInterface {
  error: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  info: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;
}

// 日志函数类型定义
export type LogFunction = (message: string, meta?: Record<string, any>) => void;
export type LogErrorFunction = (error: Error, context?: string) => void;
export type LogAccessFunction = (method: string, url: string, status: number, ip: string, userAgent?: string) => void; 