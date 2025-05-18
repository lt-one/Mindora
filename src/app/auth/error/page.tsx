'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // 定义错误类型和对应的错误信息
  const errorMessages: Record<string, string> = {
    default: '认证过程中发生错误',
    configuration: '服务器配置错误',
    accessdenied: '访问被拒绝',
    verification: '验证链接已失效',
    CredentialsSignin: '登录失败: 邮箱或密码不正确',
    sessionrequired: '请先登录',
  };

  // 获取对应的错误信息，如果没有匹配则使用默认信息
  const errorMessage = errorMessages[error || ''] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            登录失败
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
          <div className="mt-5">
            <Link 
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              返回登录页面
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              加载中...
            </h2>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
} 