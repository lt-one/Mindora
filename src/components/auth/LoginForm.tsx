'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import RecentUsers, { saveUserLoginRecord } from './RecentUsers';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // 默认选中"记住我"
  const router = useRouter();
  const searchParams = useSearchParams();
  // 使用会话状态但不依赖它进行跳转
  const { data: session } = useSession();

  // 检查URL参数，显示相应的成功消息
  useEffect(() => {
    const registered = searchParams.get('registered');
    const reset = searchParams.get('reset');
    const logout = searchParams.get('logout');
    
    if (registered === 'true') {
      setSuccessMessage('注册成功！请使用您的新账户登录。');
    } else if (reset === 'true') {
      setSuccessMessage('密码重置成功！请使用新密码登录。');
    } else if (logout === 'success') {
      setSuccessMessage('您已成功退出登录。');
    }
  }, [searchParams]);

  // 检查是否有退出成功的标记
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const logoutSuccessFlag = localStorage.getItem('logoutSuccess');
      if (logoutSuccessFlag === 'true') {
        setSuccessMessage('您已成功退出登录。');
        localStorage.removeItem('logoutSuccess'); // 清除标记
      }
    }
  }, []);

  // 会话状态监听已被移除，改为登录成功后手动跳转

  // 提取跳转逻辑为单独函数
  const redirectToDestination = () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    
    try {
      // 获取回调URL或根据用户角色决定跳转位置
      const callbackUrl = searchParams.get('callbackUrl');
      const adminPath = '/admin?prevent_redirect=1'; // 添加参数防止重定向循环
      const homePath = '/?prevent_redirect=1'; // 添加参数防止重定向循环
      
      // 避免callbackUrl是登录页面，造成循环跳转
      if (callbackUrl && (
          callbackUrl.includes('/auth/login') || 
          callbackUrl.includes('/api/auth')
        )) {
        // 获取用户信息，决定跳转目标
        const userRole = session?.user?.role;
        
        if (userRole === 'admin') {
          console.log('避免循环重定向: 转向管理页面');
          window.location.href = adminPath;
        } else {
          console.log('避免循环重定向: 转向首页');
          window.location.href = homePath;
        }
        return;
      }
      
      if (callbackUrl) {
        // 如果有回调URL，则跳转到该URL（解码URL，添加防循环参数）
        let decodedUrl = decodeURIComponent(callbackUrl);
        // 确保URL中包含防止重定向循环的参数
        if (decodedUrl.includes('?')) {
          decodedUrl += '&prevent_redirect=1';
        } else {
          decodedUrl += '?prevent_redirect=1';
        }
        console.log('跳转到回调URL:', decodedUrl);
        window.location.href = decodedUrl;
      } else {
        // 根据用户角色决定跳转目标
        const userRole = session?.user?.role;
        
        if (userRole === 'admin') {
          console.log('跳转到管理页面');
          window.location.href = adminPath;
        } else {
          console.log('跳转到首页');
          window.location.href = homePath;
        }
      }
    } catch (error) {
      console.error('页面跳转错误:', error);
      setError('跳转过程中发生错误，请刷新页面或手动导航');
      setIsRedirecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRedirecting) return;
    
    setError(null);
    setSuccessMessage(null);
    setDebugInfo(null);
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/',
        remember: rememberMe // 传递记住我选项
      });

      if (process.env.NODE_ENV === 'development') {
        setDebugInfo(`登录结果: ${JSON.stringify(result)}`);
      }

      if (result?.error) {
        setError('登录失败：邮箱或密码错误');
        setLoading(false);
      } else if (result?.ok) {
        // 登录成功，保存用户记录
        if (session?.user) {
          saveUserLoginRecord(session.user);
        }
        
        // 显示成功消息
        setSuccessMessage('登录成功！即将跳转...');
        setLoading(false);
        
        // 直接调用跳转函数，不等待session更新
        setTimeout(() => {
          // 强制刷新会话数据以确保角色信息正确
          redirectToDestination();
        }, 1500);
      } else {
        // 未知错误情况
        setError('登录失败，请稍后再试');
        setLoading(false);
      }
    } catch (err) {
      console.error('登录错误:', err);
      setError('登录时发生错误，请稍后再试');
      if (process.env.NODE_ENV === 'development') {
        setDebugInfo(`错误信息: ${err instanceof Error ? err.message : String(err)}`);
      }
      setLoading(false);
    }
  };

  // 处理选择最近用户
  const handleSelectRecentUser = (selectedEmail: string) => {
    setEmail(selectedEmail);
  };

  return (
    <div className="mt-8">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {debugInfo && process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 text-gray-700 rounded-md overflow-auto text-xs">
          <p className="font-bold">调试信息:</p>
          <pre>{debugInfo}</pre>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            邮箱地址
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            密码
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              记住我
            </label>
          </div>

          <div className="text-sm">
            <a href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              忘记密码?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || isRedirecting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? '登录中...' : isRedirecting ? '跳转中...' : '登录'}
          </button>
        </div>
      </form>

      {/* 添加最近用户组件 */}
      <RecentUsers onSelectUser={handleSelectRecentUser} />
    </div>
  );
} 