"use client";

import { usePathname } from "next/navigation";

interface ResetFilterButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ResetFilterButton({ 
  className,
  children = "重置所有筛选"
}: ResetFilterButtonProps) {
  const pathname = usePathname();
  
  // 检查当前路径是否是分类页面
  const isCategoryPage = pathname.startsWith('/blog/category/');
  
  const handleReset = () => {
    // 如果在分类页面，重置到当前分类的无筛选状态
    if (isCategoryPage) {
      // 从路径 /blog/category/[slug] 中提取 [slug] 部分
      const parts = pathname.split('/');
      const categorySlug = parts[parts.length - 1];
      
      // 重置到当前分类页面，不带任何查询参数
      window.location.href = `/blog/category/${categorySlug}`;
    } else {
      // 非分类页面，重置到博客主页
    window.location.href = '/blog';
    }
  };
  
  return (
    <button
      onClick={handleReset}
      className={className || "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"}
    >
      {children}
    </button>
  );
} 