'use client';

/**
 * 管理后台 - 内容管理页面
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Briefcase, Globe, ChevronRight, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

/**
 * 内容管理页面组件（客户端组件）
 */
export default function ContentManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogStats, setBlogStats] = useState({ total: 0, published: 0, drafts: 0 });
  const [projectStats, setProjectStats] = useState({ total: 0, featured: 0, regular: 0 });
  const [goodSitesStats, setGoodSitesStats] = useState({ total: 0, categories: 0, featured: 0 });
  
  // 获取所有数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取博客统计
        const blogRes = await fetch('/api/blog/posts?count=true');
        const blogData = await blogRes.json();
        
        const postsRes = await fetch('/api/blog/posts');
        const postsData = await postsRes.json();
        
        const blogTotal = blogData.data?.count || 0;
        const blogPublished = postsData.data?.length || 0;
        
        setBlogStats({
          total: blogTotal,
          published: blogPublished,
          drafts: blogTotal - blogPublished
        });
        
        // 获取项目统计
        const projectsCountRes = await fetch('/api/projects?count=true');
        const projectsCountData = await projectsCountRes.json();
        
        const projectsRes = await fetch('/api/projects');
        const projectsData = await projectsRes.json();
        
        const projectsTotal = projectsCountData.data?.count || 0;
        const projectsFeatured = projectsData.data?.filter((p: any) => p.featured).length || 0;
        
        setProjectStats({
          total: projectsTotal,
          featured: projectsFeatured,
          regular: projectsTotal - projectsFeatured
        });
        
        // 获取好站统计
        const sitesStatsRes = await fetch('/api/good-sites?stats=true');
        const sitesStatsData = await sitesStatsRes.json();
        
        const categoriesRes = await fetch('/api/good-sites?categories=true');
        const categoriesData = await categoriesRes.json();
        
        const featuredSitesRes = await fetch('/api/good-sites?featured=true');
        const featuredSitesData = await featuredSitesRes.json();
        
        setGoodSitesStats({
          total: sitesStatsData.data?.totalSites || 0,
          categories: categoriesData.data?.length || 0,
          featured: featuredSitesData.data?.length || 0
        });
        
      } catch (err) {
        console.error('获取内容管理数据失败:', err);
        setError('无法加载内容管理数据，请稍后再试或联系管理员。');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 加载中显示
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner 
          text="加载内容管理数据..." 
          showDetail={true} 
          detailText="正在获取内容统计信息，请稍候..."
          size="md"
        />
      </div>
    );
  }
  
  // 错误显示
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <ErrorMessage 
          title="加载数据时发生错误" 
          message={error} 
          severity="error"
        />
      </div>
    );
  }
  
  // 内容管理区域配置
  const contentSections = [
    {
      title: '博客文章',
      icon: FileText,
      href: '/admin/content/blog',
      description: '管理博客文章，添加、编辑和删除文章内容',
      stats: blogStats,
      color: 'bg-blue-500'
    },
    {
      title: '项目展示',
      icon: Briefcase,
      href: '/admin/content/projects',
      description: '管理项目展示内容，添加新项目和更新现有项目',
      stats: projectStats,
      color: 'bg-purple-500'
    },
    {
      title: '好站分享',
      icon: Globe,
      href: '/admin/content/sites',
      description: '管理好站分享内容，添加和编辑网站收藏',
      stats: goodSitesStats,
      color: 'bg-green-500'
    }
  ];
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">内容管理</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          管理网站内容，包括博客文章、项目展示和好站分享
        </p>
      </div>
      
      {/* 内容管理区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {contentSections.map((section) => (
          <div 
            key={section.href}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className={`${section.color} p-2 rounded-md text-white mr-3`}>
                  <section.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {section.description}
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {Object.entries(section.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {value}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {key === 'total' ? '总数' : 
                       key === 'published' ? '已发布' : 
                       key === 'drafts' ? '草稿' : 
                       key === 'featured' ? '精选' : 
                       key === 'regular' ? '常规' : 
                       key === 'categories' ? '分类' : key}
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                href={section.href}
                className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
              >
                <span>管理{section.title}</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* 数据导入导出区域 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">数据操作</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
              导出所有内容数据
            </button>
            <button className="py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-medium transition-colors">
              导入内容数据
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 