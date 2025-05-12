import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '数据仪表盘 | Mindora',
  description: '中国股市数据仪表盘，提供市场概览、技术分析和热门股票监控',
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col dashboard-page">
      <main className="flex-1 mt-[-1rem]">
        {children}
      </main>
    </div>
  );
} 