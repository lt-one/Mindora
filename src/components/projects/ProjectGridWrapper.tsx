'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import ProjectGrid from './ProjectGrid';

interface ProjectGridWrapperProps {
  projects: Project[];
}

export default function ProjectGridWrapper({ projects }: ProjectGridWrapperProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // 订阅视图模式变化
  useEffect(() => {
    // 从localStorage获取初始视图模式
    try {
      const savedViewMode = localStorage.getItem('projectsViewMode');
      if (savedViewMode === 'grid' || savedViewMode === 'list') {
        setViewMode(savedViewMode as 'grid' | 'list');
      }
    } catch (e) {
      console.error('无法访问localStorage', e);
    }
    
    // 监听视图模式变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-project-view-mode'
        ) {
          const newViewMode = document.documentElement.dataset.projectViewMode;
          if (newViewMode === 'grid' || newViewMode === 'list') {
            setViewMode(newViewMode as 'grid' | 'list');
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return <ProjectGrid projects={projects} initialView={viewMode} />;
} 