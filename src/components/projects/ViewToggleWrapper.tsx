'use client';

import { useState, useEffect } from 'react';
import ViewToggle from './ViewToggle';

interface ViewToggleWrapperProps {
  children: React.ReactNode;
}

export default function ViewToggleWrapper({ children }: ViewToggleWrapperProps) {
  // 默认使用网格视图
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // 从 localStorage 加载视图模式（如果有）
  useEffect(() => {
    try {
      const savedViewMode = localStorage.getItem('projectsViewMode');
      if (savedViewMode === 'grid' || savedViewMode === 'list') {
        setViewMode(savedViewMode as 'grid' | 'list');
        // 同步到文档根元素数据属性
        document.documentElement.dataset.projectViewMode = savedViewMode;
      }
    } catch (e) {
      console.error('无法访问localStorage', e);
    }
  }, []);
  
  // 处理视图模式变更
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };
  
  return (
    <div className="relative">
      {/* 渲染传入的子组件 */}
      {children}
    </div>
  );
} 