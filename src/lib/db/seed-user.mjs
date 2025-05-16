// 使用ESM模块语法
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// 创建Prisma客户端实例
const prisma = new PrismaClient();

/**
 * 创建测试用户
 */
async function seedUsers() {
  console.log('开始创建测试用户...');

  try {
    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: { id: 'user1' },
    });

    if (existingUser) {
      console.log('测试用户已存在，跳过创建');
      return { created: 0, updated: 0, skipped: 1 };
    }

    // 创建测试用户
    await prisma.user.create({
      data: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123', // 注意：实际应用中应使用加密密码
        image: '/images/avatars/default.png',
      },
    });

    console.log('测试用户创建成功');
    return { created: 1, updated: 0, skipped: 0 };
  } catch (error) {
    console.error('创建测试用户时出错:', error);
    throw error;
  } finally {
    // 关闭Prisma连接
    await prisma.$disconnect();
  }
}

// 执行种子函数
seedUsers()
  .then(() => {
    console.log('用户种子脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('用户种子脚本执行失败:', error);
    process.exit(1);
  }); 