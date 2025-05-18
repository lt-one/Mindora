/**
 * 管理后台 - 博客文章管理页面
 */
import { Metadata } from 'next';
import BlogManagementClient from '@/components/admin/BlogManagementClient';

export const metadata: Metadata = {
  title: '博客文章管理 | 管理后台',
  description: '管理博客文章，添加、编辑和删除文章',
};

export default function BlogManagementPage() {
  return <BlogManagementClient />;
} 