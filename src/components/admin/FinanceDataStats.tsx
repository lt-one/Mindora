/**
 * 金融数据统计组件
 */
'use client';

import { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart, Database } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 统计卡片类型
interface StatCard {
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  value: string | number;
  footer?: string;
  color: string;
}

export default function FinanceDataStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    marketIndices: number;
    marketTrends: number;
    industries: number;
    lastUpdate: string | null;
  }>({
    marketIndices: 0,
    marketTrends: 0,
    industries: 0,
    lastUpdate: null
  });
  
  // 加载统计数据
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      
      try {
        // 获取金融数据统计
        const financeResponse = await fetch('/api/dashboard/financial-data?limit=1');
        const financeData = await financeResponse.json();
        
        // 获取市场趋势统计
        const trendsResponse = await fetch('/api/dashboard/market-trends?limit=1');
        const trendsData = await trendsResponse.json();
        
        // 更新统计信息
        setStats({
          marketIndices: financeData.meta?.total || 0,
          marketTrends: trendsData.meta?.total || 0,
          industries: 0, // 需要添加行业API
          lastUpdate: financeData.data?.[0]?.updatedAt || trendsData.data?.[0]?.updatedAt || null
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // 统计卡片数据
  const statCards: StatCard[] = [
    {
      title: '市场指数',
      icon: LineChart,
      description: '市场指数数据总量',
      value: isLoading ? '-' : stats.marketIndices,
      color: 'bg-blue-500 dark:bg-blue-600'
    },
    {
      title: '市场趋势',
      icon: BarChart,
      description: '市场趋势数据总量',
      value: isLoading ? '-' : stats.marketTrends,
      color: 'bg-green-500 dark:bg-green-600'
    },
    {
      title: '行业数据',
      icon: PieChart,
      description: '行业数据总量',
      value: isLoading ? '-' : stats.industries,
      color: 'bg-purple-500 dark:bg-purple-600'
    },
    {
      title: '数据存储',
      icon: Database,
      description: '金融数据存储占用',
      value: '1.2 GB',
      footer: '上限: 5 GB',
      color: 'bg-amber-500 dark:bg-amber-600'
    }
  ];
  
  // 格式化上次更新时间
  const getLastUpdateText = () => {
    if (isLoading) return '加载中...';
    if (!stats.lastUpdate) return '未知';
    
    try {
      const updateDate = new Date(stats.lastUpdate);
      return formatDistance(updateDate, new Date(), { 
        addSuffix: true,
        locale: zhCN
      });
    } catch (e) {
      return '格式错误';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">金融数据统计</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          系统当前数据统计信息
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
            >
              <div className="flex items-center mb-3">
                <div className={`${card.color} p-2 rounded text-white mr-3`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {card.title}
                </h3>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {card.description}
              </p>
              
              <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {card.value}
              </div>
              
              {card.footer && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {card.footer}
                </p>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">上次数据更新:</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {getLastUpdateText()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
