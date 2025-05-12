'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import ViewToggle from './ViewToggle';
import ProjectFilter from './ProjectFilter';
import { categories, technologies } from '@/lib/data/projects';

interface ProjectsHeaderProps {
  projects: Project[];
}

export default function ProjectsHeader({ projects }: ProjectsHeaderProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // 从localStorage中获取保存的视图模式
  useEffect(() => {
    try {
      const savedViewMode = localStorage.getItem('projectsViewMode');
      if (savedViewMode === 'list' || savedViewMode === 'grid') {
        setViewMode(savedViewMode as 'grid' | 'list');
      }
    } catch (e) {
      console.error('无法访问localStorage', e);
    }
    
    // 将视图模式应用到ProjectGrid组件
    document.documentElement.dataset.projectViewMode = viewMode;
  }, [viewMode]);
  
  // 保存视图模式到localStorage
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    try {
      localStorage.setItem('projectsViewMode', mode);
    } catch (e) {
      console.error('无法保存视图模式', e);
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mr-2">
            发现项目
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            | 发现有趣的项目和创意
          </span>
        </div>
        
        {/* 视图切换按钮 */}
        <ViewToggle viewMode={viewMode} onChange={handleViewModeChange} />
      </div>
      
      {/* 筛选器 */}
      <ProjectFilter 
        categories={categories}
        technologies={technologies}
      />
    </div>
  );
} 