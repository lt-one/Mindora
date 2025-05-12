import { PrismaClient } from '@prisma/client';

// 添加PrismaClient实例，确保全局单例模式
declare global {
  var prisma: PrismaClient | undefined;
}

// 避免在开发环境中创建过多连接实例
export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma; 