/**
 * 用于预填充默认标签和分类的脚本
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTaxonomies() {
  try {
    console.log('开始填充默认标签和分类...');
    
    // 查找admin用户，如果不存在则创建一个
    let adminUser = await prisma.user.findFirst({
      where: {
        role: 'admin'
      }
    });
    
    if (!adminUser) {
      console.log('未找到admin用户，创建默认admin用户');
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: '管理员',
          role: 'admin',
          password: '$2a$10$PJWv9Dz3g/rKl6giREvZNOwjB0XA/vSR1AUV8.PY.UXCGrIQD7YFW', // 密码: admin123
        }
      });
      console.log('创建默认admin用户成功，ID:', adminUser.id);
    } else {
      console.log('找到已存在的admin用户，ID:', adminUser.id);
    }
    
    // 检查是否已有博客文章
    const existingPosts = await prisma.blogPost.findMany({
      take: 1
    });
    
    if (existingPosts.length > 0) {
      console.log('检测到已有博客文章，更新标签和分类');
      
      // 更新现有文章的标签和分类
      for (const post of existingPosts) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            tags: ['技术', 'Web开发', 'React', 'Next.js', '前端'],
            categories: ['编程', '设计', '教程', '思考'],
          }
        });
      }
      
      console.log('已成功更新现有文章的标签和分类');
    } else {
      console.log('没有找到现有博客文章，创建示例文章');
      
      try {
        // 创建包含默认标签和分类的示例博客文章
        const newPost = await prisma.blogPost.create({
          data: {
            title: '示例博客文章',
            slug: 'example-blog-post',
            content: '这是一篇示例博客文章，用于初始化标签和分类。',
            excerpt: '示例文章摘要',
            coverImage: '/images/blog/placeholder.jpg',
            published: false,
            tags: ['技术', 'Web开发', 'React', 'Next.js', '前端'],
            categories: ['编程', '设计', '教程', '思考'],
            userId: adminUser.id, // 关联到admin用户
          }
        });
        
        console.log('已成功添加示例博客文章，ID:', newPost.id);
      } catch (createError) {
        console.error('创建示例博客文章失败:', createError);
      }
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