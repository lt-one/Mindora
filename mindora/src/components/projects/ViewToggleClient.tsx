'use client';

import { useCallback } from "react";
import ViewToggle from "./ViewToggle";

// 客户端包装组件，专门处理视图切换
export default function ViewToggleClient() {
  const handleViewChange = useCallback((mode: 'grid' | 'list') => {
    // 客户端处理视图切换
    document.documentElement.dataset.projectViewMode = mode;
  }, []);

  return <ViewToggle viewMode="grid" onChange={handleViewChange} />;
} 