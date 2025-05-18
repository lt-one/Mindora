import Link from "next/link";
import { FileWarning } from "lucide-react";

export default function AdminSettingsNotFound() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="mb-6 flex justify-center">
          <FileWarning className="w-20 h-20 text-amber-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          系统设置页面未找到
        </h1>
        
        <p className="text-md text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
          抱歉，您请求的系统设置页面不存在或已被移动。
        </p>
        
        <div className="flex flex-col gap-4 justify-center">
          <Link
            href="/admin/settings"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-md shadow-sm hover:shadow-md transition-all"
          >
            返回系统设置首页
          </Link>
          
          <Link
            href="/admin"
            className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium rounded-md shadow-sm hover:shadow-md transition-all"
          >
            返回管理系统首页
          </Link>
        </div>
      </div>
    </main>
  );
} 