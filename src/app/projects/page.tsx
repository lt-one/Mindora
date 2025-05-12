import type { Metadata } from "next";
import { Suspense } from "react";
import { 
  getAllProjects, 
  getProjectsByCategory, 
  getProjectsByTechnology, 
  categories, 
  technologies 
} from "@/lib/data/projects";
import ProjectFilter from "@/components/projects/ProjectFilter";
import ProjectGrid from "@/components/projects/ProjectGrid";
import TechTagList from "@/components/projects/TechTagList";
import ViewToggleWrapper from "@/components/projects/ViewToggleWrapper";

export const metadata: Metadata = {
  title: "项目展示 | Mindora",
  description: "查看个人开发的各类项目，包括Web应用、数据可视化、AI项目等",
  keywords: "项目展示, 作品集, 前端开发, 数据可视化, 个人网站",
  openGraph: {
    title: "项目展示 | Mindora",
    description: "查看个人开发的各类项目，包括Web应用、数据可视化、AI项目等",
    url: "https://Mindora.dev/projects",
    siteName: "Mindora",
    locale: "zh_CN",
    type: "website",
  },
};

// 重新定义参数类型并确保与Next.js 15的类型系统兼容
type Params = {};
type SearchParamsType = { category?: string; tech?: string };

interface ProjectsPageProps {
  params: Promise<Params>;
  searchParams: Promise<SearchParamsType>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  // 修复 searchParams 异步使用问题 - 先将 searchParams 完整获取
  const params = await searchParams;
  const category = params?.category?.toString() || "all";
  const tech = params?.tech?.toString() || "all";
  
  // 获取筛选后的项目
  const getFilteredProjects = async () => {
    if (category !== "all" && tech !== "all") {
      // 同时按类别和技术筛选
      const projectsByCategory = await getProjectsByCategory(category);
      return projectsByCategory.filter(project => 
        project.technologies.includes(tech)
      );
    } else if (category !== "all") {
      // 仅按类别筛选
      return await getProjectsByCategory(category);
    } else if (tech !== "all") {
      // 仅按技术筛选
      return await getProjectsByTechnology(tech);
    } else {
      // 无筛选，返回所有项目
      return await getAllProjects();
    }
  };
  
  const projects = await getFilteredProjects();
  const allProjects = await getAllProjects();
  
  // 统计数据
  const projectStats = {
    total: allProjects.length,
    featured: allProjects.filter(p => p.featured).length,
    webApps: allProjects.filter(p => p.categories.includes("web-app")).length,
    dataViz: allProjects.filter(p => p.categories.includes("data-visualization")).length,
    aiProjects: allProjects.filter(p => p.categories.includes("ai")).length,
  };
  
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* 背景图案与装饰元素 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 dark:opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/0 to-indigo-50/30 dark:from-blue-900/10 dark:via-gray-900/0 dark:to-indigo-900/10"></div>
      
      {/* 左侧装饰元素 */}
      <div className="absolute left-0 top-0 h-full w-16 md:w-24 lg:w-32 bg-gradient-to-r from-blue-100/40 to-transparent dark:from-blue-900/10 dark:to-transparent -z-5"></div>
      <div className="absolute left-20 top-1/4 w-32 h-32 rounded-full bg-indigo-200/20 dark:bg-indigo-700/10 blur-xl -z-5 animate-pulse"></div>
      <div className="absolute left-10 bottom-1/4 w-24 h-24 rounded-full bg-purple-200/30 dark:bg-purple-700/20 blur-xl -z-5 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* 右侧装饰元素 */}
      <div className="absolute right-0 top-0 h-full w-16 md:w-24 lg:w-32 bg-gradient-to-l from-indigo-100/40 to-transparent dark:from-indigo-900/10 dark:to-transparent -z-5"></div>
      <div className="absolute right-20 top-1/3 w-40 h-40 rounded-full bg-blue-200/20 dark:bg-blue-700/10 blur-xl -z-5 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute right-10 bottom-1/3 w-20 h-20 rounded-full bg-purple-200/20 dark:bg-purple-700/10 blur-xl -z-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* 主要内容容器 */}
      <div className="container mx-auto px-4 py-8 md:py-12 sm:px-6 lg:px-8 relative z-10">
        {/* 顶部装饰区域 - 使用简约的几何元素装饰 */}
        <div className="absolute -top-4 inset-x-0 h-20 overflow-hidden opacity-60 pointer-events-none">
          {/* 漂浮的几何形状 */}
          <div className="absolute top-0 left-1/5 w-2 h-2 rounded-full bg-blue-400/30 dark:bg-blue-400/20 animate-float" 
               style={{ animationDuration: '6s' }}></div>
          <div className="absolute top-6 left-1/4 w-1.5 h-1.5 rounded-full bg-indigo-400/30 dark:bg-indigo-400/20 animate-float" 
               style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
          <div className="absolute top-2 left-1/3 w-1 h-1 rounded-full bg-purple-400/30 dark:bg-purple-400/20 animate-float" 
               style={{ animationDuration: '7s', animationDelay: '0.5s' }}></div>
          <div className="absolute top-8 left-1/2 w-2 h-2 rounded-full bg-blue-400/30 dark:bg-blue-400/20 animate-float" 
               style={{ animationDuration: '9s', animationDelay: '1.5s' }}></div>
          <div className="absolute top-3 left-2/3 w-1.5 h-1.5 rounded-full bg-indigo-400/30 dark:bg-indigo-400/20 animate-float" 
               style={{ animationDuration: '7.5s', animationDelay: '2s' }}></div>
          <div className="absolute top-7 left-3/4 w-1 h-1 rounded-full bg-purple-400/30 dark:bg-purple-400/20 animate-float" 
               style={{ animationDuration: '8.5s', animationDelay: '0.8s' }}></div>
          
          {/* 微小的三角形装饰 */}
          <div className="absolute top-12 left-1/6 w-2 h-2 bg-blue-400/20 dark:bg-blue-400/10 rotate-45 animate-float" 
               style={{ animationDuration: '10s', animationDelay: '0.2s' }}></div>
          <div className="absolute top-4 left-3/5 w-2 h-2 bg-indigo-400/20 dark:bg-indigo-400/10 rotate-12 animate-float" 
               style={{ animationDuration: '9s', animationDelay: '1.2s' }}></div>
        </div>
        
        {/* 增强背景效果 */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-70 pointer-events-none"></div>
        
        {/* 页面标题区域 - 更丰富的设计 */}
        <div className="max-w-5xl mx-auto mb-12 relative z-10">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:shadow-xl transition-all duration-500">
            {/* 顶部装饰条 */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className="grid md:grid-cols-5 gap-4">
              {/* 左侧标题和描述区域 */}
              <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    项目展示
                  </h1>
                </div>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  个人开发的各类<span className="font-semibold text-blue-600 dark:text-blue-400">实用项目</span>和<span className="font-semibold text-indigo-600 dark:text-indigo-400">创意作品</span>，涵盖Web应用、数据可视化、人工智能等多个技术领域。每个项目都融合了最佳实践与创新思维。
                </p>
                
                {/* 技术标签区域 - 使用客户端组件来处理交互 */}
                <TechTagList technologies={technologies} />
              </div>
              
              {/* 右侧统计数据 */}
              <div className="md:col-span-2 bg-blue-50/70 dark:bg-blue-900/20 p-6 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  项目概览
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">总项目数</span>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{projectStats.total}</span>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">精选项目</span>
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{projectStats.featured}</span>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Web应用</span>
                    <span className="text-3xl font-bold text-blue-500 dark:text-blue-300">{projectStats.webApps}</span>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">数据可视化</span>
                    <span className="text-3xl font-bold text-purple-500 dark:text-purple-300">{projectStats.dataViz}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 项目筛选器和列表 - 添加分隔线和背景 */}
        <section className="max-w-7xl mx-auto relative">
          {/* 使用ViewToggleWrapper包裹内容 */}
          <ViewToggleWrapper>
            <div className="relative z-10 mb-6">
              {/* 项目筛选器 */}
              <ProjectFilter
                categories={categories}
                technologies={technologies}
              />
            </div>
            
            {/* 项目展示区域 - 添加背景和阴影 */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md mt-4">
              <Suspense fallback={
                <div className="flex justify-center items-center py-12">
                  <div className="loading-spinner w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              }>
                <ProjectGrid projects={projects} />
              </Suspense>
            </div>
          </ViewToggleWrapper>
        </section>
        
        {/* 底部装饰 */}
        <div className="mt-16 relative">
          <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-blue-100/50 dark:fill-blue-900/20">
              <path d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,176C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
} 