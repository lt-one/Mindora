/**
 * 编辑博客文章页面
 */
import { Metadata } from 'next';
import BlogEditor from '@/components/admin/BlogEditor';
import { getBlogPostById } from '@/lib/api/admin/blog';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: '编辑博客文章 | 管理后台',
  description: '编辑现有博客文章',
};

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  // 获取文章数据
  const post = await getBlogPostById(params.id);
  
  // 文章不存在时显示404页面
  if (!post) {
    notFound();
  }
  
  return <BlogEditor isEditing={true} initialData={post} />;
}