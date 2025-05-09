"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import * as echarts from 'echarts';

interface MetricData {
  name: string;
  value: number;
  max: number;
  description?: string;
}

interface StockMetric {
  symbol: string;
  name: string;
  metrics: MetricData[];
}

interface StockMetricsRadarChartProps {
  stocksData: StockMetric[];
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

export default function StockMetricsRadarChart({
  stocksData = [],
  title = "股票指标雷达图",
  description = "多维度指标对比分析",
  onRefresh
}: StockMetricsRadarChartProps) {
  const [isLoading, setIsLoading] = useState<boolean>(stocksData.length === 0);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // 处理数据变化和图表绘制
  useEffect(() => {
    if (!chartRef.current || stocksData.length === 0) return;
    
    setIsLoading(false);
    
    try {
      const chart = echarts.init(chartRef.current);
      const option = generateChartOption(stocksData);
      chart.setOption(option);
      
      // 响应窗口大小变化
      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
      
      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    } catch (err) {
      console.error('渲染雷达图失败:', err);
      setError((err as Error).message);
    }
  }, [stocksData]);
  
  // 生成雷达图配置
  const generateChartOption = (stocks: StockMetric[]) => {
    // 提取所有指标名称和最大值
    const indicators = stocks[0]?.metrics.map(metric => ({
      name: metric.name,
      max: metric.max
    })) || [];
    
    // 准备每只股票的数据
    const seriesData = stocks.map(stock => ({
      name: `${stock.name} (${stock.symbol})`,
      value: stock.metrics.map(metric => metric.value),
      symbolSize: 6,
      lineStyle: {
        width: 2
      }
    }));
    
    // 生成颜色列表
    const colors = [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
    ];
    
    // 配置选项
    return {
      color: colors,
      tooltip: {
        trigger: 'item'
      },
      legend: {
        type: 'scroll',
        bottom: 0,
        data: stocks.map(stock => `${stock.name} (${stock.symbol})`),
        textStyle: {
          color: 'auto'
        }
      },
      radar: {
        indicator: indicators,
        shape: 'circle',
        splitNumber: 5,
        splitArea: {
          areaStyle: {
            color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.05)']
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(200,200,200,0.3)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(200,200,200,0.3)'
          }
        }
      },
      series: [
        {
          type: 'radar',
          emphasis: {
            lineStyle: {
              width: 4
            }
          },
          data: seriesData
        }
      ]
    };
  };
  
  // 刷新数据
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  
  // 生成图例
  const renderLegend = () => {
    if (stocksData.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {stocksData.map((stock, index) => (
          <Badge key={stock.symbol} variant="outline" className="py-1">
            {stock.name} ({stock.symbol})
          </Badge>
        ))}
      </div>
    );
  };
  
  // 生成指标解释
  const renderMetricsDescription = () => {
    if (stocksData.length === 0 || !stocksData[0].metrics[0].description) return null;
    
    return (
      <div className="mt-4 text-sm">
        <h4 className="font-semibold mb-2">指标说明：</h4>
        <ul className="list-disc list-inside space-y-1">
          {stocksData[0].metrics.map(metric => (
            <li key={metric.name}>
              <span className="font-medium">{metric.name}</span>:
              {metric.description && <span className="text-muted-foreground ml-1">{metric.description}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-4">加载失败: {error}</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            刷新
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-[90%] w-[95%] rounded-lg" />
            </div>
          ) : (
            <div ref={chartRef} className="h-full w-full" />
          )}
        </div>
        
        {renderLegend()}
        {renderMetricsDescription()}
      </CardContent>
    </Card>
  );
}

// 示例用法:
/*
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
  }
];

// 使用组件
<StockMetricsRadarChart stocksData={stockMetricsData} />
*/ 