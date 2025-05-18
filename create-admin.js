/**
 * 创建管理员用户脚本
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log('开始创建初始用户...');
  
  try {
    // 检查管理员用户是否已存在
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@example.com',
      },
    });
    
    if (existingAdmin) {
      console.log('管理员用户已存在，跳过创建');
    } else {
      // 对密码进行哈希处理 - 密码为 "admin123"
      const hashedPassword = await hashPassword('admin123');
      
      // 创建管理员用户
      const admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin',
          emailVerified: new Date(),
        },
      });
      
      console.log(`创建管理员用户成功: ${admin.email}`);
    }
    
    console.log('初始用户创建完成！');
  } catch (error) {
    console.error('创建用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 