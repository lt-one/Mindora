import { PrismaClient } from '@prisma/client';

// 添加PrismaClient实例，确保全局单例模式
declare global {
  var prisma: PrismaClient | undefined;
}

// 避免在开发环境中创建过多连接实例
// 提供额外选项来确保开发环境下正确初始化
const prismaClientOptions = {
  log: ['query', 'error', 'warn']
};

export const prisma = globalThis.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma; 