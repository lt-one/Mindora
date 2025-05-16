import dotenv from 'dotenv';
import { prisma } from './prisma';

/**
 * 检查数据库连接和环境变量
 */
export async function checkDatabaseConnection() {
  try {
    // 加载环境变量
    dotenv.config();
    
    // 检查是否设置了数据库URL
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL 环境变量未设置');
    }
    
    // 测试数据库连接
    console.log('测试数据库连接...');
    await prisma.$connect();
    console.log('数据库连接成功!');
    
    // 检查是否有需要的表
    console.log('检查数据库表...');
    const blogPostsTable = await prisma.$queryRaw`
      SHOW TABLES LIKE 'BlogPost';
    `;
    
    if (Array.isArray(blogPostsTable) && blogPostsTable.length === 0) {
      console.warn('警告: BlogPost表不存在。请运行 `npx prisma migrate dev` 创建表。');
    } else {
      console.log('BlogPost表存在!');
    }
    
    return true;
  } catch (error) {
    console.error('数据库连接测试失败:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此文件，执行连接测试
if (require.main === module) {
  checkDatabaseConnection()
    .then((success) => {
      if (success) {
        console.log('环境设置正确!');
        process.exit(0);
      } else {
        console.error('环境设置有问题，请检查!');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('脚本执行失败:', error);
      process.exit(1);
    });
} 