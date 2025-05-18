/**
 * 忘记密码页面
 */
import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: '忘记密码 | Mindora',
  description: '重置账户密码',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            忘记密码
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            请输入您的邮箱，我们将向您发送重置密码的链接
          </p>
        </div>
        
        <ForgotPasswordForm />
        
        <div className="text-center mt-4">
          <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            返回登录
          </a>
        </div>
      </div>
    </div>
  );
} 