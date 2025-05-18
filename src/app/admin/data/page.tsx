/**
 * 管理后台 - 数据管理页面
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { Database, BarChart3, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '数据管理 | 管理后台',
  description: '管理财务数据和应用统计信息',
};

export default function AdminDataPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">数据管理</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          管理和更新系统数据与统计信息
        </p>
      </div>
      
      {/* 数据管理模块 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 金融数据模块 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <Link href="/admin/data/finance" className="block p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="w-10 h-10 text-blue-500 dark:text-blue-400 mr-4" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">金融数据</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    管理和更新股票、市场数据
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        </div>
        
        {/* 应用统计模块 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <Link href="/admin/data/analytics" className="block p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-10 h-10 text-indigo-500 dark:text-indigo-400 mr-4" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">应用统计</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    查看网站访问和用户使用数据
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 