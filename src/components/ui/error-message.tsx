'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  /** 标题 */
  title?: string;
  /** 错误消息 */
  message: string;
  /** 自定义CSS类名 */
  className?: string;
  /** 错误级别 */
  severity?: 'error' | 'warning';
}

/**
 * 错误消息组件
 * 用于显示应用中的错误和警告信息
 */
export function ErrorMessage({
  title = '发生错误',
  message,
  className,
  severity = 'error',
}: ErrorMessageProps) {
  const colorMap = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-800 dark:text-red-300',
      message: 'text-red-700 dark:text-red-200',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-600 dark:text-amber-400',
      title: 'text-amber-800 dark:text-amber-300',
      message: 'text-amber-700 dark:text-amber-200',
    },
  };
  
  const colors = colorMap[severity];
  
  return (
    <div 
      className={cn(
        `${colors.bg} border ${colors.border} p-4 rounded-lg flex items-start`,
        className
      )}
    >
      <AlertCircle className={`h-5 w-5 ${colors.icon} mt-0.5 mr-2 flex-shrink-0`} />
      <div>
        <h3 className={`font-medium ${colors.title}`}>
          {title}
        </h3>
        <p className={`${colors.message} text-sm mt-1`}>
          {message}
        </p>
      </div>
    </div>
  );
} 