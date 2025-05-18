/**
 * 控制面板 - 高级配置页面
 */
import { Metadata } from 'next';
import FinanceSchedulerControl from '@/components/dashboard/FinanceSchedulerControl';

export const metadata: Metadata = {
  title: '高级配置 | 控制面板',
  description: '系统高级配置和管理选项',
};

export default function AdvancedPage() {
  return (
    <div className="container p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">高级配置</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">计划任务</h2>
          <div className="space-y-6">
            <FinanceSchedulerControl />
            
            {/* 可以添加其他计划任务控制组件 */}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">系统状态</h2>
          <div className="p-4 border rounded-lg bg-card">
            <p className="text-muted-foreground">
              此处可以显示系统状态信息，如服务运行时间、资源使用情况等。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
 