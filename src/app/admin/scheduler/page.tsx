/**
 * 管理后台 - 定时任务管理页面
 */
import { Metadata } from 'next';
import FinanceSchedulerControl from '@/components/dashboard/FinanceSchedulerControl';
import { Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: '定时任务管理 | 管理后台',
  description: '管理系统定时任务和自动更新',
};

export default function SchedulerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">定时任务管理</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          管理系统自动化任务和定时更新设置
        </p>
      </div>
      
      {/* 定时任务列表 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          计划任务列表
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 金融数据定时更新控制组件 */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">金融数据更新</h3>
            <FinanceSchedulerControl />
          </div>
          
          {/* 示例：其他定时任务控制组件（待开发） */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">数据库备份</h3>
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              <p>自动备份数据库内容，防止数据丢失。</p>
              <div className="mt-2 flex items-center">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium">未配置</span>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              配置任务
            </button>
          </div>
          
          {/* 占位：可添加更多定时任务组件 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm border-dashed">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
              <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-gray-200">添加新任务</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                创建新的定时任务或自动化流程
              </p>
              <button className="border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                添加任务
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 任务统计 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">任务统计</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">活跃任务</h3>
              <p className="text-2xl font-semibold text-blue-900 dark:text-blue-200">1</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">成功执行</h3>
              <p className="text-2xl font-semibold text-green-900 dark:text-green-200">24</p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-100 dark:border-red-800/30">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">失败任务</h3>
              <p className="text-2xl font-semibold text-red-900 dark:text-red-200">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 