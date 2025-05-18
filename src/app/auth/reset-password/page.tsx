/**
 * 重置密码页面
 */
import { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: '重置密码 | Mindora',
  description: '设置新密码',
};

export default function ResetPasswordPage({ 
  searchParams 
}: { 
  searchParams: { token?: string } 
}) {
  const token = searchParams.token || '';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            重置密码
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            请设置您的新密码
          </p>
        </div>
        
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-md">
            <p className="font-medium">无效的密码重置链接</p>
            <p className="mt-2">缺少重置令牌，请确保您点击了完整的重置链接或尝试重新请求密码重置。</p>
            <div className="mt-4">
              <a 
                href="/auth/forgot-password" 
                className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                重新请求重置链接
              </a>
            </div>
          </div>
        )}
        
        <div className="text-center mt-4">
          <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            返回登录
          </a>
        </div>
      </div>
    </div>
  );
} 