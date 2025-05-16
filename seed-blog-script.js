// 运行博客种子脚本
const { seedBlogPosts } = require('./src/lib/db/seed-blog');

async function main() {
  try {
    console.log('开始填充博客数据...');
    await seedBlogPosts();
    console.log('博客数据填充完成');
  } catch (error) {
    console.error('填充失败:', error);
    process.exit(1);
  }
}

main(); 