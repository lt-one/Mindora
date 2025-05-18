'use client';

/**
 * 管理后台布局客户端组件
 */
import { Toaster } from 'react-hot-toast';
import AdminNav from '@/components/admin/AdminNav';
import { useEffect } from 'react';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // 在组件挂载时添加admin-page类，卸载时移除
  useEffect(() => {
    // 添加admin-page类以取消缩放
    document.body.classList.add('admin-page');
    
    // 清理函数，组件卸载时移除admin-page类
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* 侧边栏导航 */}
      <AdminNav />
      
      {/* 主内容区 */}
      <div className="flex-1 pt-16 px-6 pb-6 overflow-y-auto">
        {children}
        
        {/* 消息提示组件 */}
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
