'use client';

/**
 * 管理后台侧边导航组件
 */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FileText, 
  Database, 
  Settings, 
  Home, 
  Calendar, 
  User, 
  ChevronRight,
  LogOut,
  UserCircle
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import ConfirmDialog from '../ui/ConfirmDialog';

// 导航项定义
const navItems = [
  {
    label: '控制台',
    href: '/admin',
    icon: Home
  },
  {
    label: '内容管理',
    href: '/admin/content',
    icon: FileText,
    subItems: [
      { label: '博客文章', href: '/admin/content/blog' },
      { label: '项目展示', href: '/admin/content/projects' },
      { label: '好站收藏', href: '/admin/content/sites' }
    ]
  },
  {
    label: '数据管理',
    href: '/admin/data',
    icon: Database,
    subItems: [
      { label: '金融数据', href: '/admin/data/finance' },
      { label: '应用统计', href: '/admin/data/analytics' }
    ]
  },
  {
    label: '系统设置',
    href: '/admin/settings',
    icon: Settings
  },
  {
    label: '定时任务',
    href: '/admin/scheduler',
    icon: Calendar
  },
  {
    label: '用户管理',
    href: '/admin/users',
    icon: User
  }
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // 检查当前路径是否匹配
  const isActiveLink = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };
  
  // 检查是否应该展开子菜单
  const shouldExpandSubmenu = (item: typeof navItems[0]) => {
    if (!item.subItems) return false;
    
    return item.subItems.some(subItem => 
      pathname === subItem.href || pathname?.startsWith(subItem.href + '/')
    );
  };

  // 初始化登出流程
  const initiateLogout = () => {
    setShowLogoutConfirm(true);
  };

  // 确认登出
  const confirmLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      setShowLogoutConfirm(false);
      
      // 设置登出成功标记
      localStorage.setItem('logoutSuccess', 'true');
      
      await signOut({ redirect: false });
      router.push('/auth/login');
    } catch (error) {
      console.error('登出错误:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 取消登出
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
        {/* 管理后台标题 */}
        <div className="flex items-center justify-center h-16 mt-8 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Mindora 管理
          </Link>
        </div>
        
        {/* 用户信息卡片 */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="flex-shrink-0">
              <UserCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {session?.user?.name || session?.user?.email || '管理员'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session?.user?.email || '未知邮箱'}
              </p>
              <div className="flex items-center mt-1">
                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-full">
                  {session?.user?.role || 'admin'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 导航菜单 */}
        <nav className="p-4 flex-grow overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href} className="rounded-md overflow-hidden">
                {/* 主导航项 */}
                <Link 
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium transition-colors
                    ${isActiveLink(item.href) 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                  
                  {item.subItems && (
                    <ChevronRight 
                      className={`ml-auto h-4 w-4 transition-transform ${shouldExpandSubmenu(item) ? 'rotate-90' : ''}`}
                    />
                  )}
                </Link>
                
                {/* 子菜单项 */}
                {item.subItems && shouldExpandSubmenu(item) && (
                  <ul className="mt-1 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.href}>
                        <Link 
                          href={subItem.href}
                          className={`
                            flex items-center px-3 py-2 text-sm transition-colors rounded-md
                            ${isActiveLink(subItem.href) 
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                          `}
                        >
                          <span>{subItem.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        {/* 登出按钮 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={initiateLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? "正在退出..." : "退出登录"}
          </button>
        </div>
        
        {/* 底部信息 */}
        <div className="p-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center">Mindora Admin v1.0</p>
        </div>
      </div>

      {/* 登出确认对话框 */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="确认退出管理后台"
        message="您确定要退出管理后台吗？"
        confirmText={isLoggingOut ? "退出中..." : "确认退出"}
        cancelText="取消"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        type="warning"
      />
    </>
  );
} 