'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  /** 自定义CSS类名 */
  className?: string;
  /** 加载显示文本 */
  text?: string;
  /** 是否显示详细消息 */
  showDetail?: boolean;
  /** 详细消息 */
  detailText?: string;
  /** 大小变体 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否居中显示 */
  centered?: boolean;
}

/**
 * 加载动画组件
 * 提供多种大小和风格的加载动画效果
 */
export function LoadingSpinner({
  className,
  text = '加载中...',
  showDetail = false,
  detailText = '正在连接数据库并加载信息，请稍候...',
  size = 'md',
  centered = true,
}: LoadingSpinnerProps) {
  // 根据大小设置不同的样式
  const sizeStyles = {
    sm: {
      outer: 'h-12 w-12',
      middle: 'h-8 w-8',
      inner: 'h-6 w-6',
      icon: 'h-5 w-5',
      textClass: 'text-sm'
    },
    md: {
      outer: 'h-20 w-20',
      middle: 'h-14 w-14',
      inner: 'h-8 w-8',
      icon: 'h-12 w-12',
      textClass: 'text-lg'
    },
    lg: {
      outer: 'h-24 w-24',
      middle: 'h-18 w-18',
      inner: 'h-12 w-12',
      icon: 'h-16 w-16',
      textClass: 'text-xl'
    }
  };
  
  const styles = sizeStyles[size];
  
  const containerClass = cn(
    'flex flex-col items-center justify-center',
    centered && 'min-h-[30vh]',
    className
  );
  
  return (
    <div className={containerClass}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${styles.outer} rounded-full border-t-4 border-b-4 border-blue-500 animate-spin`}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`${styles.middle} rounded-full border-t-4 border-b-4 border-blue-300 animate-spin`}
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          ></div>
        </div>
        <Loader2 className={`${styles.icon} animate-spin text-blue-500`} />
      </div>
      <p className={`${styles.textClass} text-gray-600 dark:text-gray-400 mt-6 animate-pulse`}>{text}</p>
      <div className="flex space-x-2 mt-4">
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      {showDetail && (
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4 max-w-xs text-center">
          {detailText}
        </p>
      )}
    </div>
  );
} 