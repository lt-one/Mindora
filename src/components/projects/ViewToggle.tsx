'use client';

import { useState, useEffect } from 'react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onChange: (mode: 'grid' | 'list') => void;
}

export default function ViewToggle({ viewMode: initialViewMode, onChange }: ViewToggleProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  
  // 从 localStorage 加载初始视图模式
  useEffect(() => {
    try {
      const savedViewMode = localStorage.getItem('projectsViewMode');
      if (savedViewMode === 'grid' || savedViewMode === 'list') {
        setViewMode(savedViewMode as 'grid' | 'list');
        onChange(savedViewMode as 'grid' | 'list');
      }
    } catch (e) {
      console.error('无法访问localStorage', e);
    }
  }, [onChange]);
  
  // 处理视图模式切换
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    onChange(mode);
    
    // 保存到 localStorage
    try {
      localStorage.setItem('projectsViewMode', mode);
    } catch (e) {
      console.error('无法保存到localStorage', e);
    }
    
    // 添加到文档根元素，以便其他组件可以观察变化
    document.documentElement.dataset.projectViewMode = mode;
  };
  
  return (
    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => handleViewModeChange('grid')}
        className={`p-2 transition-colors ${
          viewMode === 'grid'
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/70'
        }`}
        aria-label="网格视图"
        title="网格视图"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
      <button
        onClick={() => handleViewModeChange('list')}
        className={`p-2 transition-colors ${
          viewMode === 'list'
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/70'
        }`}
        aria-label="列表视图"
        title="列表视图"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
} 