"use client";

import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types/project";

interface ProjectGridProps {
  projects: Project[];
  initialView?: "grid" | "list";
}

export default function ProjectGrid({ projects, initialView = "grid" }: ProjectGridProps) {
  const [view, setView] = useState<"grid" | "list">(initialView);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 监听视图模式变化
  useEffect(() => {
    // 从 localStorage 获取初始视图模式
    try {
      const savedViewMode = localStorage.getItem('projectsViewMode');
      if (savedViewMode === 'grid' || savedViewMode === 'list') {
        setView(savedViewMode as 'grid' | 'list');
      }
    } catch (e) {
      console.error('无法访问localStorage', e);
    }
    
    // 监听文档根元素的数据属性变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-project-view-mode'
        ) {
          const newViewMode = document.documentElement.dataset.projectViewMode;
          if (newViewMode === 'grid' || newViewMode === 'list') {
            setView(newViewMode as 'grid' | 'list');
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // 模拟加载动画
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
  
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
        <div className="w-24 h-24 mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          没有找到项目
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
          请尝试调整筛选条件，或者稍后再来查看有没有新的项目。
        </p>
        <div className="flex space-x-2">
          <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
          <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`
      ${view === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "flex flex-col space-y-6"}
    `}>
      {isLoaded ? (
        // 加载完毕后显示实际项目
        projects.map((project, index) => (
          <div 
            key={project.id} 
            className={`${view === "list" ? "w-full" : ""} animate-fade-in`} 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProjectCard project={project} viewMode={view} />
          </div>
        ))
      ) : (
        // 加载中显示骨架屏
        Array.from({ length: Math.min(8, projects.length) }).map((_, index) => (
          <div 
            key={`skeleton-${index}`} 
            className={`${view === "list" ? "w-full" : ""} animate-pulse`}
          >
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden h-full shadow-sm">
              <div className="aspect-[16/9] w-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-5/6 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-1/3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 