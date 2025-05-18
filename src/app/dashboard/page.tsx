"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MarketOverview from '@/components/charts/MarketOverview';
import HotStocks from '@/components/charts/HotStocks';
import TechnicalAnalysis from '@/components/charts/TechnicalAnalysis';
import MarketRSI from '@/components/charts/MarketRSI';
import DataAnalysis from '@/components/charts/DataAnalysis';
import StockMetricsRadarChart from '@/components/charts/StockMetricsRadarChart';
import StockTimeSeries from '@/components/charts/StockTimeSeries';
import VolatilityAnalysisChart from '@/components/charts/VolatilityAnalysisChart';
import StockComparisonChart from '@/components/charts/StockComparisonChart';
import { MAJOR_INDICES } from '@/lib/data/china-stock-api';
import FinanceSchedulerControl from '@/components/dashboard/FinanceSchedulerControl';

// 定义调度器状态类型
interface SchedulerStatus {
  active: boolean;
  nextRun: string | null;
  schedule: string;
  lastUpdateTime: string | null;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStock, setSelectedStock] = useState("sh000001"); // 默认上证指数
  const [currentTime, setCurrentTime] = useState("");
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatus | null>(null);
  
  // 常用股票列表
  const commonStocks = [
    ...MAJOR_INDICES, // 使用预定义的指数列表
    { symbol: 'sh600519', name: '贵州茅台' },
    { symbol: 'sh601318', name: '中国平安' },
    { symbol: 'sz000001', name: '平安银行' },
    { symbol: 'sh600036', name: '招商银行' },
    { symbol: 'sh600276', name: '恒瑞医药' },
    { symbol: 'sh600887', name: '伊利股份' },
  ];

  // 获取调度器状态
  const fetchSchedulerStatus = async () => {
    try {
      const response = await fetch('/api/dashboard/finance-scheduler');
      const result = await response.json();
      
      if (result.status === 'success') {
        setSchedulerStatus(result.data);
      }
    } catch (error) {
      console.error('获取调度器状态失败:', error);
    }
  };

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // 获取调度器状态
    fetchSchedulerStatus();

    return () => clearTimeout(timer);
  }, []);

  // 添加时间更新逻辑
  useEffect(() => {
    // 初始设置时间
    setCurrentTime(new Date().toLocaleString('zh-CN'));
    
    // 每分钟更新一次时间
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('zh-CN'));
    }, 60000);
    
    // 每5分钟刷新一次调度器状态
    const statusTimer = setInterval(() => {
      fetchSchedulerStatus();
    }, 300000);
    
    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, []);

  // 格式化日期时间
  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return "未知";
    
    try {
      return new Date(isoString).toLocaleString('zh-CN');
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 全屏背景 */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-50/80 via-slate-50/80 to-indigo-50/80 dark:from-slate-900/90 dark:via-blue-950/80 dark:to-indigo-950/80"></div>
        {/* 装饰背景元素 */}
        <div className="absolute top-1/4 right-1/5 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-64 h-64 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-[60px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        {/* 数据流背景效果 */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHN0cm9rZT0iIzMxNDE1QyIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjUiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMlY2aDRWNGgtNHpNNiAzNHYtNEg0djRIMHYyaDR2NGgydi00aDR2LTJINnpNNiA0VjBINHY0SDB2Mmg0djRoMlY2aDRWNEg2eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="flex flex-col min-h-screen space-y-3 p-4 pt-0 md:p-6 md:pt-0 relative z-10">
        <div className="flex items-center justify-between mt-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">中国股市数据仪表盘</h1>
          <div className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-md flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full ${schedulerStatus?.active ? 'bg-green-500' : 'bg-red-500'} mr-2 animate-pulse`}></span>
            <span>
              {schedulerStatus?.lastUpdateTime ? 
                `数据更新时间: ${formatDateTime(schedulerStatus.lastUpdateTime)}` : 
                (currentTime ? `数据加载时间: ${currentTime}` : "数据加载中...")}
              <span className="block text-xs mt-0.5 text-amber-600 dark:text-amber-400">
                {schedulerStatus?.active ? 
                  `自动更新已开启 (${schedulerStatus.schedule})，下次更新: ${formatDateTime(schedulerStatus.nextRun)}` : 
                  "自动更新已关闭，请手动更新或在控制台开启自动更新"}
              </span>
            </span>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center gap-2 mb-3">
            <TabsTrigger value="overview">市场概览</TabsTrigger>
            <TabsTrigger value="hot-stocks">热门股票</TabsTrigger>
            <TabsTrigger value="technical">技术分析</TabsTrigger>
            <TabsTrigger value="settings">系统设置</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                {/* <CardHeader>
                  <CardTitle>市场概览</CardTitle>
                  <CardDescription>
                    主要指数和市场整体状态
                  </CardDescription>
                </CardHeader> */}
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  ) : (
                    <MarketOverview />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>分时走势图</CardTitle>
                      <CardDescription className="text-sm mt-1">实时价格走势监控</CardDescription>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto border-t pt-2">
                    <Tabs
                      value={selectedStock}
                      onValueChange={(value) => value && setSelectedStock(value)}
                      className="w-auto"
                    >
                      <TabsList className="h-7 inline-flex w-auto bg-muted/50">
                        {commonStocks.map((stock) => (
                          <TabsTrigger
                            key={stock.symbol}
                            value={stock.symbol}
                            className="px-2 py-0.5 h-7 text-xs whitespace-nowrap data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:shadow-sm"
                            disabled={isLoading}
                          >
                            {stock.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[450px] w-full rounded-lg" />
                  ) : (
                    <StockTimeSeries 
                      symbol={selectedStock} 
                      name={commonStocks.find(stock => stock.symbol === selectedStock)?.name}
                      refreshInterval={60000}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hot-stocks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>热门股票监控</CardTitle>
                  <CardDescription>
                    热门龙头股实时行情和盘口数据
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                  ) : (
                    <HotStocks />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>波动率分析及股票对比</CardTitle>
                  <CardDescription>
                  股票价格波动性及股票相对表现对比
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      <VolatilityAnalysisChart symbol={selectedStock} />
                      <StockComparisonChart mainSymbol={selectedStock} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>技术指标分析</CardTitle>
                  <CardDescription>
                    单股技术指标分析和K线形态
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                  ) : (
                    <TechnicalAnalysis />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>市场RSI分析</CardTitle>
                  <CardDescription>
                    基于市场平均涨跌幅计算的RSI指标
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                  ) : (
                    <MarketRSI days={90} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>数据分析</CardTitle>
                  <CardDescription>
                    多维度数据排行和对比分析
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                  ) : (
                    <DataAnalysis />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>股票指标雷达图</CardTitle>
                  <CardDescription>
                    多维度指标对比分析
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                  ) : (
                    <StockMetricsRadarChart stocksData={stockMetricsData} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>数据更新控制</CardTitle>
                    <CardDescription>
                      控制金融数据的自动更新计划
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FinanceSchedulerControl onStatusChange={fetchSchedulerStatus} />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>系统信息</CardTitle>
                    <CardDescription>
                      系统状态和配置信息
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium">系统时间:</div>
                        <div className="col-span-2">{currentTime}</div>
                        
                        <div className="font-medium">自动更新状态:</div>
                        <div className="col-span-2 flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${schedulerStatus?.active ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                          {schedulerStatus?.active ? '已开启' : '已关闭'}
                        </div>
                        
                        <div className="font-medium">更新计划:</div>
                        <div className="col-span-2">{schedulerStatus?.schedule || '未设置'}</div>
                        
                        <div className="font-medium">下次更新:</div>
                        <div className="col-span-2">{formatDateTime(schedulerStatus?.nextRun)}</div>
                        
                        <div className="font-medium">最后更新:</div>
                        <div className="col-span-2">{formatDateTime(schedulerStatus?.lastUpdateTime)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 添加金融数据定时更新控制面板 */}
        {/* <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">系统管理</h2>
          <FinanceSchedulerControl />
        </div> */}
      </div>
    </div>
  );
} 