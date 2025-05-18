import { PrismaClient, Prisma } from '@prisma/client';

// 添加PrismaClient实例，确保全局单例模式
declare global {
  var prisma: PrismaClient | undefined;
}

// 确保有默认的数据库连接字符串，防止环境变量未加载的情况
if (!process.env.DATABASE_URL) {
  // 使用默认空密码，因为根据错误信息显示root用户不需要密码
  process.env.DATABASE_URL = 'mysql://root:123456@localhost:3306/mindora_db';
  console.log('使用默认数据库连接字符串');
}

// 避免在开发环境中创建过多连接实例
// 提供额外选项来确保开发环境下正确初始化
const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: ['query', 'error', 'warn'] as Prisma.LogLevel[],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
};

export const prisma = globalThis.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma; 