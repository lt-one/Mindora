# Mindora 项目日志系统

本目录存放应用程序运行过程中生成的各类日志文件。

## 日志文件结构

- **combined.log**: 综合日志，包含所有级别的日志记录
- **error.log**: 错误日志，仅包含错误级别的日志记录
- **access.log**: 访问日志，记录HTTP请求信息

## 日志级别

日志系统支持以下级别的日志记录（从高到低）：

1. **error**: 错误信息，表示应用程序出现了影响功能的错误
2. **warn**: 警告信息，表示潜在的问题或可能导致错误的情况
3. **info**: 信息性消息，记录应用程序的正常运行状态
4. **debug**: 调试信息，提供详细的运行时信息（仅在开发环境启用）

## 日志格式

每条日志记录均为JSON格式，包含以下字段：

```json
{
  "level": "日志级别",
  "message": "日志消息",
  "service": "服务名称",
  "timestamp": "时间戳",
  "... 其他元数据": "值"
}
```

## 使用方法

在代码中使用日志功能：

```typescript
// 导入日志模块
import logger, { logInfo, logError, logWarn, logDebug } from '@/lib/logger';

// 记录信息
logInfo('这是一条信息', { userId: '123', action: '登录' });

// 记录警告
logWarn('警告消息', { source: '用户服务' });

// 记录错误
try {
  // 某些可能出错的操作
} catch (error) {
  logError(error, '操作上下文');
}

// 记录调试信息 (仅在开发环境显示)
logDebug('调试信息', { data: someData });

// 也可以直接使用logger实例
logger.info('直接使用logger');
logger.error('错误消息', { stack: new Error().stack });
```

## 测试日志功能

访问以下API端点来测试日志功能：

- `/api/log-test` - 生成信息日志
- `/api/log-test?type=error` - 生成错误日志
- `/api/log-test?type=warn` - 生成警告日志
- `/api/log-test?type=debug` - 生成调试日志

## 日志配置

日志系统配置文件位于：`src/lib/logger.ts`

主要配置项包括：
- 日志文件路径和名称
- 日志格式和元数据
- 文件大小与轮转设置
- 控制台输出设置 