/**
 * 新建博客文章页面
 */
import { Metadata } from 'next';
import BlogEditor from '@/components/admin/BlogEditor';

export const metadata: Metadata = {
  title: '新建博客文章 | 管理后台',
  description: '创建新的博客文章',
};

export default function NewBlogPostPage() {
  return <BlogEditor isEditing={false} />;
} 