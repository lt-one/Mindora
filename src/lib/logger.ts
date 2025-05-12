/**
 * 日志服务兼容层
 * 为了不影响项目运行，提供空操作日志功能
 */

export * from './logger-noop';
export { default } from './logger-noop'; 