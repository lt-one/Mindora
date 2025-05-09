"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MarketOverview from '@/components/charts/MarketOverview';
import HotStocks from '@/components/charts/HotStocks';
import TechnicalAnalysis from '@/components/charts/TechnicalAnalysis';
import DataAnalysis from '@/components/charts/DataAnalysis';
import OrderBookDepthChart from '@/components/charts/OrderBookDepthChart';
import StockMetricsRadarChart from '@/components/charts/StockMetricsRadarChart';
import StockTimeSeries from '@/components/charts/StockTimeSeries';
import { MAJOR_INDICES } from '@/lib/data/china-stock-api';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStock, setSelectedStock] = useState("sh000001"); // 默认上证指数
  const [currentTime, setCurrentTime] = useState("");
  
  // 示例数据 - 股票指标数据
  const stockMetricsData = [
    {
      symbol: 'sh600519',
      name: '贵州茅台',
      metrics: [
        { name: 'PE', value: 40, max: 100, description: '市盈率，表示股价与每股收益的比率' },
        { name: 'PB', value: 12, max: 20, description: '市净率，表示股价与每股净资产的比率' },
        { name: 'ROE', value: 25, max: 30, description: '净资产收益率，表示净利润与净资产的比率' },
        { name: '营收增长率', value: 10, max: 50, description: '营业收入同比增长率' },
        { name: '利润增长率', value: 15, max: 50, description: '净利润同比增长率' },
        { name: '毛利率', value: 90, max: 100, description: '毛利润占营业收入的比率' }
      ]
    },
    {
      symbol: 'sh601318',
      name: '中国平安',
      metrics: [
        { name: 'PE', value: 8, max: 100, description: '市盈率，表示股价与每股收益的比率' },
        { name: 'PB', value: 1.2, max: 20, description: '市净率，表示股价与每股净资产的比率' },
        { name: 'ROE', value: 15, max: 30, description: '净资产收益率，表示净利润与净资产的比率' },
        { name: '营收增长率', value: 5, max: 50, description: '营业收入同比增长率' },
        { name: '利润增长率', value: 3, max: 50, description: '净利润同比增长率' },
        { name: '毛利率', value: 40, max: 100, description: '毛利润占营业收入的比率' }
      ]
    },
    {
      symbol: 'sh600276',
      name: '恒瑞医药',
      metrics: [
        { name: 'PE', value: 30, max: 100, description: '市盈率，表示股价与每股收益的比率' },
        { name: 'PB', value: 7, max: 20, description: '市净率，表示股价与每股净资产的比率' },
        { name: 'ROE', value: 20, max: 30, description: '净资产收益率，表示净利润与净资产的比率' },
        { name: '营收增长率', value: 15, max: 50, description: '营业收入同比增长率' },
        { name: '利润增长率', value: 10, max: 50, description: '净利润同比增长率' },
        { name: '毛利率', value: 80, max: 100, description: '毛利润占营业收入的比率' }
      ]
    }
  ];

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

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

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
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">中国股市数据仪表盘</h1>
        <div className="text-sm text-muted-foreground">
          {currentTime ? `数据更新时间: ${currentTime}` : "数据加载中..."}
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">市场概览</TabsTrigger>
          <TabsTrigger value="hot-stocks">热门股票</TabsTrigger>
          <TabsTrigger value="technical">技术分析</TabsTrigger>
          <TabsTrigger value="data">数据分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>市场概览</CardTitle>
                <CardDescription>
                  主要指数和市场整体状态
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full rounded-lg" />
                ) : (
                  <MarketOverview />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>分时走势图</CardTitle>
                  <CardDescription>实时价格走势监控</CardDescription>
                </div>
                <Select value={selectedStock} onValueChange={setSelectedStock}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择股票" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonStocks.map(stock => (
                      <SelectItem key={stock.symbol} value={stock.symbol}>
                        {stock.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <CardTitle>盘口深度分析</CardTitle>
                <CardDescription>
                  实时买卖盘口数据深度分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[500px] w-full rounded-lg" />
                ) : (
                  <OrderBookDepthChart symbol={selectedStock} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>技术分析</CardTitle>
              <CardDescription>
                技术指标分析和价格形态识别
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
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 