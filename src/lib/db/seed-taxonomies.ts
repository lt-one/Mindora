/**
 * 用于预填充默认标签和分类的脚本
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTaxonomies() {
  try {
    console.log('开始填充默认标签和分类...');
    
    // 检查是否已有博客文章
    const existingPosts = await prisma.blogPost.findMany({
      take: 1
    });
    
    if (existingPosts.length > 0) {
      console.log('检测到已有博客文章，跳过创建示例文章');
      
      // 更新现有文章的标签和分类
      for (const post of existingPosts) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            tags: JSON.stringify(['技术', 'Web开发', 'React', 'Next.js', '前端']),
            categories: JSON.stringify(['编程', '设计', '教程', '思考']),
          }
        });
      }
      
      console.log('已成功更新现有文章的标签和分类');
    } else {
      // 查找或创建系统管理员用户
      let adminUser = await prisma.user.findFirst({
        where: {
          role: 'admin'
        }
      });
      
      if (!adminUser) {
        // 创建一个系统管理员用户
        adminUser = await prisma.user.create({
          data: {
            name: '系统管理员',
            email: 'system@example.com',
            password: 'hashed_password_placeholder', // 实际应用中应使用哈希密码
            role: 'admin',
            image: '/images/avatars/system.png',
            bio: '系统管理员账户'
          }
        });
        console.log('创建了系统管理员用户');
      }
      
      // 创建包含默认标签和分类的示例博客文章
      await prisma.blogPost.create({
        data: {
          title: '示例博客文章',
          slug: 'example-blog-post',
          content: '这是一篇示例博客文章，用于初始化标签和分类。',
          excerpt: '示例文章摘要',
          userId: adminUser.id, // 使用管理员用户ID
          published: false,
          tags: JSON.stringify(['技术', 'Web开发', 'React', 'Next.js', '前端']),
          categories: JSON.stringify(['编程', '设计', '教程', '思考']),
        }
      });
      
      console.log('已成功添加示例博客文章，包含默认标签和分类');
    }
  } catch (error) {
    console.error('填充默认标签和分类失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行函数
seedTaxonomies()
  .then(() => {
    console.log('操作完成');
    process.exit(0);
  })
  .catch(error => {
    console.error('操作失败:', error);
    process.exit(1);
  }); 