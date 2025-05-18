/**
 * 项目管理页面
 */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '项目管理 | 管理后台',
  description: '管理网站项目展示',
};

export default function ProjectsManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">项目管理</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          管理您的项目展示内容
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">项目管理功能开发中</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            此功能正在开发中，敬请期待...
          </p>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            预计完成日期: 2025年6月
          </p>
        </div>
      </div>
    </div>
  );
} 