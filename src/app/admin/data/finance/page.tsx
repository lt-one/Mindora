/**
 * 管理后台 - 金融数据管理页面
 */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FinanceDataImport from '@/components/admin/FinanceDataImport';
import FinanceDataStats from '@/components/admin/FinanceDataStats';
import { DatabaseIcon, LineChart } from 'lucide-react';

export const metadata: Metadata = {
  title: '金融数据管理 | 管理后台',
  description: '导入、更新和管理金融数据',
};

export default function FinanceDataPage() {
  // 可以根据条件调用notFound()函数来触发not-found.tsx
  // 例如，如果数据不存在或用户没有权限时
  // const dataExists = false;
  // if (!dataExists) {
  //   notFound();
  // }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">金融数据管理</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          导入、更新和管理系统金融数据
        </p>
      </div>
      
      {/* 金融数据统计 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
          <LineChart className="h-5 w-5 mr-2" />
          数据统计
        </h2>
        <FinanceDataStats />
      </div>
      
      {/* 金融数据导入 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
          <DatabaseIcon className="h-5 w-5 mr-2" />
          数据导入
        </h2>
        <FinanceDataImport />
      </div>
      
      {/* 数据源配置 - 未来可以添加 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">数据源配置</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <p className="text-gray-500 dark:text-gray-400">
            数据源配置功能即将推出，敬请期待。
          </p>
        </div>
      </div>
    </div>
  );
} 