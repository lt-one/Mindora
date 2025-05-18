'use client';

/**
 * 管理后台首页
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Database, Settings, Calendar, User, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// 快速入口卡片定义
const quickEntries = [
  {
    title: '内容管理',
    description: '管理博客文章、项目展示和好站收藏',
    icon: FileText,
    href: '/admin/content',
    color: 'bg-blue-500'
  },
  {
    title: '数据管理',
    description: '更新金融数据和查看应用统计',
    icon: Database,
    href: '/admin/data',
    color: 'bg-green-500'
  },
  {
    title: '定时任务',
    description: '管理系统定时任务和自动更新',
    icon: Calendar,
    href: '/admin/scheduler',
    color: 'bg-purple-500'
  },
  {
    title: '系统设置',
    description: '配置系统参数和全局选项',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-amber-500'
  },
  {
    title: '用户管理',
    description: '管理用户账号和权限设置',
    icon: User,
    href: '/admin/users',
    color: 'bg-rose-500'
  }
];

export default function AdminPage() {
  // 状态定义
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [contentStats, setContentStats] = useState({
    blogPosts: 0,
    projects: 0,
    goodSites: 0
  });
  const [financeStatus, setFinanceStatus] = useState({
    active: false,
    lastUpdate: null,
    nextUpdate: null
  });
  const [systemInfo, setSystemInfo] = useState({
    version: '1.0.0',
    nextVersion: '15.3.1', // 已更新到15.3.1版本
    environment: process.env.NODE_ENV || '开发环境'
  });

  // 获取内容统计
  useEffect(() => {
    const fetchContentStats = async () => {
      try {
        // 获取博客文章数量
        const blogResponse = await fetch('/api/blog/posts?count=true');
        if (!blogResponse.ok) throw new Error('获取博客文章数量失败');
        const blogData = await blogResponse.json();
        
        // 获取项目数量
        const projectsResponse = await fetch('/api/projects?count=true');
        if (!projectsResponse.ok) throw new Error('获取项目数量失败');
        const projectsData = await projectsResponse.json();
        
        // 获取好站收藏数量
        const sitesResponse = await fetch('/api/good-sites?stats=true');
        if (!sitesResponse.ok) throw new Error('获取好站收藏数量失败');
        const sitesData = await sitesResponse.json();
        
        // 更新状态
        setContentStats({
          blogPosts: blogData.data?.count || 0,
          projects: projectsData.data?.count || 0,
          goodSites: sitesData.data?.totalSites || 0
        });
      } catch (error) {
        console.error('获取内容统计失败:', error);
        setError((error as Error).message || '获取内容统计数据失败');
      }
    };
    
    // 获取金融数据状态
    const fetchFinanceStatus = async () => {
      try {
        const response = await fetch('/api/dashboard/finance-scheduler');
        if (!response.ok) throw new Error('获取金融数据状态失败');
        const data = await response.json();
        
        if (data.status === 'success') {
          // 计算下次更新的相对时间
          const nextUpdateTime = data.data.nextRun 
            ? new Date(data.data.nextRun) 
            : null;
          
          // 获取最后更新时间
          const financeResponse = await fetch('/api/dashboard/financial-data?limit=1');
          if (!financeResponse.ok) throw new Error('获取金融数据最后更新时间失败');
          const financeData = await financeResponse.json();
          const lastUpdateTime = financeData.data?.[0]?.updatedAt 
            ? new Date(financeData.data[0].updatedAt) 
            : null;
          
          setFinanceStatus({
            active: data.data.active,
            lastUpdate: lastUpdateTime,
            nextUpdate: nextUpdateTime
          });
        }
      } catch (error) {
        console.error('获取金融数据状态失败:', error);
        // 不设置全局错误，允许部分功能仍然可用
      }
    };
    
    // 获取所有数据
    Promise.all([
      fetchContentStats().catch(e => console.error(e)),
      fetchFinanceStatus().catch(e => console.error(e))
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);
  
  // 格式化相对时间
  const formatRelativeTime = (date: Date | null) => {
    if (!date) return '未设置';
    
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 0) {
      // 过去时间
      const absDiffMins = Math.abs(diffMins);
      if (absDiffMins < 60) return `${absDiffMins}分钟前`;
      if (absDiffMins < 1440) return `${Math.floor(absDiffMins / 60)}小时前`;
      return `${Math.floor(absDiffMins / 1440)}天前`;
    } else {
      // 未来时间
      if (diffMins < 60) return `${diffMins}分钟后`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}小时后`;
      return `${Math.floor(diffMins / 1440)}天后`;
    }
  };
  
  // 加载中显示
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner 
          text="加载管理控制台..." 
          showDetail={true} 
          detailText="正在连接数据库并加载统计信息，请稍候..."
          size="lg"
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-300">获取数据时发生错误</h3>
            <p className="text-red-700 dark:text-red-200 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">控制台</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          欢迎使用Mindora管理后台，快速管理内容和数据。
        </p>
      </div>
      
      {/* 系统状态概览 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">系统状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">内容统计</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">博客文章</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{contentStats.blogPosts}篇</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">项目展示</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{contentStats.projects}个</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">好站收藏</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{contentStats.goodSites}个</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">数据更新</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">金融数据</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {financeStatus.active ? '已开启自动更新' : '自动更新已关闭'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">最后更新</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {financeStatus.lastUpdate ? formatRelativeTime(financeStatus.lastUpdate) : '未知'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">下次更新</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {financeStatus.nextUpdate ? formatRelativeTime(financeStatus.nextUpdate) : '未设置'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">系统信息</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">系统版本</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{systemInfo.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Next.js版本</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{systemInfo.nextVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">环境</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {systemInfo.environment === 'development' ? '开发环境' : 
                   systemInfo.environment === 'production' ? '生产环境' : systemInfo.environment}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 快速入口 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">快速入口</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickEntries.map((entry) => (
            <Link 
              key={entry.href}
              href={entry.href}
              className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all group"
            >
              <div className="flex items-start">
                <div className={`${entry.color} p-3 rounded-lg text-white`}>
                  <entry.icon className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors self-center opacity-70 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 