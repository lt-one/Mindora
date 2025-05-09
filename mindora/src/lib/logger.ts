import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

// 确保日志目录存在
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 定义日志格式
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// 定义日志文件名
const errorLogFile = path.join(logDir, 'error.log');
const combinedLogFile = path.join(logDir, 'combined.log');
const accessLogFile = path.join(logDir, 'access.log');

// 创建日志记录器
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'mindora' },
  transports: [
    // 错误日志文件
    new transports.File({ 
      filename: errorLogFile, 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 综合日志文件 (包含所有级别)
    new transports.File({ 
      filename: combinedLogFile,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 访问日志文件 (仅包含info级别)
    new transports.File({
      filename: accessLogFile,
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// 在非生产环境下，同时输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    })
  );
}

/**
 * 记录访问信息
 * @param method 请求方法
 * @param url 请求URL
 * @param status 状态码
 * @param ip 请求IP
 * @param userAgent 用户代理
 */
export const logAccess = (method: string, url: string, status: number, ip: string, userAgent?: string) => {
  logger.info('Access', {
    method,
    url,
    status,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 记录错误信息
 * @param error 错误对象
 * @param context 错误上下文
 */
export const logError = (error: Error, context?: string) => {
  logger.error(`Error${context ? ` in ${context}` : ''}`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 记录应用信息
 * @param message 信息内容
 * @param meta 元数据
 */
export const logInfo = (message: string, meta?: Record<string, any>) => {
  logger.info(message, {
    ...meta,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 记录警告信息
 * @param message 警告内容
 * @param meta 元数据
 */
export const logWarn = (message: string, meta?: Record<string, any>) => {
  logger.warn(message, {
    ...meta,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 记录调试信息
 * @param message 调试内容
 * @param meta 元数据
 */
export const logDebug = (message: string, meta?: Record<string, any>) => {
  logger.debug(message, {
    ...meta,
    timestamp: new Date().toISOString(),
  });
};

export default logger; 