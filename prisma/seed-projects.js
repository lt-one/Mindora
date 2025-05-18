const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { projects } = require('../src/lib/data/projects');

/**
 * 将项目数据导入数据库
 */
async function seedProjects() {
  console.log('开始导入项目数据...');
  
  try {
    // 查找默认用户，如果不存在则创建
    let user = await prisma.user.findFirst({
      where: { id: 'user1' }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: 'user1',
          name: '刘涛',
          email: 'test@example.com',
          password: 'hashed_password', // 生产环境中应当使用正确的密码哈希
        }
      });
      console.log('创建了默认用户:', user.id);
    }
    
    // 导入每个项目
    for (const project of projects) {
      // 检查项目是否已存在（使用slug查找）
      const existingProject = await prisma.project.findFirst({
        where: { slug: project.slug }
      });
      
      // 用于存储的数据对象
      const projectData = {
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        description: project.description,
        thumbnailUrl: project.thumbnailUrl,
        images: JSON.stringify(project.images),
        videoUrl: project.videoUrl,
        demoUrl: project.demoUrl,
        sourceCodeUrl: project.sourceCodeUrl,
        technologies: JSON.stringify(project.technologies),
        categories: JSON.stringify(project.categories),
        featured: project.featured,
        highlightColor: project.highlightColor,
        completionDate: project.completionDate,
        duration: project.duration,
        role: project.role,
        client: project.client,
        challenges: project.challenges ? JSON.stringify(project.challenges) : null,
        solutions: project.solutions ? JSON.stringify(project.solutions) : null,
        results: project.results ? JSON.stringify(project.results) : null,
        relatedProjects: project.relatedProjects ? JSON.stringify(project.relatedProjects) : null,
        relatedPosts: project.relatedPosts ? JSON.stringify(project.relatedPosts) : null,
        order: project.order || 0,
        userId: user.id
      };
      
      if (existingProject) {
        // 更新已存在的项目
        await prisma.project.update({
          where: { id: existingProject.id },
          data: projectData
        });
        console.log(`项目已更新: ${project.title}`);
      } else {
        // 创建新项目
        await prisma.project.create({
          data: projectData
        });
        console.log(`项目已创建: ${project.title}`);
      }
    }
    
    console.log('项目数据导入完成！');
  } catch (error) {
    console.error('导入项目数据时出错:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 执行导入
seedProjects()
  .then(() => console.log('数据导入成功完成'))
  .catch(e => {
    console.error('数据导入失败:', e);
    process.exit(1);
  }); 