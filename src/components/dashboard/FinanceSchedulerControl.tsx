'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlayCircle, StopCircle, RefreshCw } from 'lucide-react';

interface FinanceSchedulerControlProps {
  onStatusChange?: () => void; // 可选的状态变更回调
}

export default function FinanceSchedulerControl({ onStatusChange }: FinanceSchedulerControlProps = {}) {
  const [status, setStatus] = useState<{
    active: boolean;
    nextRun: string | null;
    schedule: string;
    lastUpdateTime?: string | null;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 获取当前状态
  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/finance-scheduler');
      const result = await response.json();
      
      if (result.status === 'success') {
        setStatus(result.data);
        // 将最后更新时间设置为从API返回的值
        if (result.data.lastUpdateTime) {
          setLastUpdate(result.data.lastUpdateTime);
        }
        setError(null);
        
        // 通知父组件状态已变更
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        setError(result.message || '获取状态失败');
      }
    } catch (err) {
      setError('无法连接到服务器');
      console.error('获取定时任务状态失败:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 执行操作
  const performAction = async (action: 'start' | 'stop' | 'update-now') => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/finance-scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        if (action === 'update-now') {
          setLastUpdate(result.data.lastUpdate);
        } 
        
        // 无论什么操作，都更新状态
        if (result.data) {
          setStatus(result.data);
        }
        
        // 显示成功消息
        console.log(result.message);
        
        // 通知父组件状态已变更
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        setError(result.message || `执行${action}操作失败`);
      }
    } catch (err) {
      setError('无法连接到服务器');
      console.error(`执行${action}操作失败:`, err);
    } finally {
      setActionLoading(false);
      // 更新状态
      fetchStatus();
    }
  };
  
  // 初始加载
  useEffect(() => {
    fetchStatus();
    
    // 每30秒刷新一次状态
    const intervalId = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // 格式化时间
  const formatDateTime = (isoString: string | null | undefined) => {
    if (!isoString) return '未设置';
    
    try {
      const date = new Date(isoString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (e) {
      return isoString;
    }
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          金融数据定时更新
          {status?.active ? (
            <Badge variant="success" className="bg-green-600">
              运行中
            </Badge>
          ) : (
            <Badge variant="default" className="bg-gray-500">
              已停止
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          控制金融数据的自动更新计划
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 py-2">{error}</div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">更新计划:</div>
              <div>{status?.schedule || '每小时整点'}</div>
              
              <div className="font-medium">下次更新:</div>
              <div>{formatDateTime(status?.nextRun)}</div>
              
              {status?.lastUpdateTime && (
                <>
                  <div className="font-medium">上次自动更新:</div>
                  <div>{formatDateTime(status.lastUpdateTime)}</div>
                </>
              )}
              
              {lastUpdate && (
                <>
                  <div className="font-medium">上次手动更新:</div>
                  <div>{formatDateTime(lastUpdate)}</div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {status?.active ? (
          <Button
            variant="destructive"
            onClick={() => performAction('stop')}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <StopCircle className="h-4 w-4 mr-2" />
            )}
            停止服务
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => performAction('start')}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PlayCircle className="h-4 w-4 mr-2" />
            )}
            启动服务
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={() => performAction('update-now')}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          立即更新
        </Button>
      </CardFooter>
    </Card>
  );
} 