"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import * as echarts from 'echarts';
import { getKLineData } from '@/lib/data/china-stock-api';

interface VolatilityAnalysisChartProps {
  symbol: string;
  initialData?: any;
  onRefresh?: () => void;
}

interface VolatilityData {
  dates: string[];
  volatility: number[];
}

export default function VolatilityAnalysisChart({ 
  symbol, 
  initialData, 
  onRefresh 
}: VolatilityAnalysisChartProps) {
  const [klineData, setKlineData] = useState<any[] | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("daily");
  const [windowSize, setWindowSize] = useState<string>("20");
  const chartRef = useRef<HTMLDivElement | null>(null);
  
  // 获取K线数据
  useEffect(() => {
    if (initialData) {
      setKlineData(initialData);
      return;
    }
    
    fetchKlineData();
  }, [symbol, period, initialData]);
  
  // 渲染图表
  useEffect(() => {
    if (!chartRef.current || !klineData || isLoading) return;
    
    const chart = echarts.init(chartRef.current);
    
    const option = generateChartOption(klineData, parseInt(windowSize));
    chart.setOption(option);
    
    // 响应窗口大小变化
    const handleResize = () => chart.resize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      
      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
    
    return () => {
      chart.dispose();
    };
  }, [klineData, isLoading, windowSize]);
  
  // 获取K线数据函数
  const fetchKlineData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 映射周期参数
      const mappedPeriod = period === 'weekly' ? 'weekly' : 
                           period === 'monthly' ? 'monthly' : 'daily';
      
      // 获取更多数据用于计算波动率
      const data = await getKLineData(symbol, mappedPeriod, 120);
      
      if (!data || data.length === 0) {
        throw new Error('无法获取K线数据或数据为空');
      }
      
      setKlineData(data);
    } catch (err) {
      console.error('获取K线数据出错:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 刷新数据
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      fetchKlineData();
    }
  };
  
  // 计算波动率数据 (使用标准差)
  const calculateVolatility = (data: any[], windowSize: number = 20): VolatilityData => {
    if (!data || data.length < windowSize) return { dates: [], volatility: [] };
    
    const volatility: number[] = [];
    const dates: string[] = [];
    
    // 为前N-1个点填充null
    for (let i = 0; i < windowSize - 1; i++) {
      volatility.push(0);
      dates.push(data[i].date);
    }
    
    // 计算滚动窗口的标准差
    for (let i = windowSize - 1; i < data.length; i++) {
      // 提取窗口内的价格变化
      const windowData = data.slice(i - windowSize + 1, i + 1);
      const returns: number[] = [];
      
      // 计算日收益率 (ln(price_t / price_t-1))
      for (let j = 1; j < windowData.length; j++) {
        const dailyReturn = Math.log(windowData[j].close / windowData[j-1].close);
        returns.push(dailyReturn);
      }
      
      // 计算标准差
      const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
      const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
      const stdDev = Math.sqrt(variance);
      
      // 年化波动率 (假设252个交易日)
      const annualizedVolatility = stdDev * Math.sqrt(252) * 100;
      
      volatility.push(Number(annualizedVolatility.toFixed(2)));
      dates.push(data[i].date);
    }
    
    return {
      dates: dates.slice(windowSize - 1),
      volatility: volatility.slice(windowSize - 1)
    };
  };
  
  // 生成图表配置
  const generateChartOption = (data: any[], windowSize: number = 20) => {
    // 计算波动率
    const volatilityData = calculateVolatility(data, windowSize);
    
    // 波动率级别
    const lowLevel = 15;  // 低波动率阈值
    const mediumLevel = 30;  // 中波动率阈值
    // > 30 为高波动率
    
    return {
      title: {
        text: '波动率分析',
        left: 'center',
        top: 0
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const dataIndex = params[0].dataIndex;
          const date = volatilityData.dates[dataIndex];
          const volatility = volatilityData.volatility[dataIndex];
          
          let volatilityLevel = '高';
          if (volatility < lowLevel) volatilityLevel = '低';
          else if (volatility < mediumLevel) volatilityLevel = '中';
          
          return `日期: ${date}<br/>波动率: ${volatility}%<br/>风险级别: ${volatilityLevel}`;
        }
      },
      legend: {
        data: ['波动率'],
        bottom: 10
      },
      grid: {
        left: '6%',
        right: '5%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: volatilityData.dates,
        axisLabel: {
          rotate: 30,
          formatter: function(value: string) {
            return value.substring(5); // 仅显示月-日
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '波动率 (%)',
        nameLocation: 'middle',
        nameGap: 55,
        axisLine: {
          show: true
        },
        splitLine: {
          show: true
        },
        // 添加分界线，标记低/中/高波动率区域
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255,255,255,0.02)', 'rgba(255,237,204,0.05)', 'rgba(255,204,204,0.08)']
          }
        }
      },
      visualMap: {
        show: false,
        pieces: [
          {
            gt: 0,
            lte: lowLevel,
            color: '#91cc75'
          },
          {
            gt: lowLevel,
            lte: mediumLevel,
            color: '#fac858'
          },
          {
            gt: mediumLevel,
            color: '#ee6666'
          }
        ],
        outOfRange: {
          color: '#999'
        },
        dimension: 1
      },
      series: [
        {
          name: '波动率',
          type: 'line',
          smooth: true,
          data: volatilityData.volatility,
          markLine: {
            silent: true,
            lineStyle: {
              color: '#333'
            },
            data: [
              {
                yAxis: lowLevel,
                label: {
                  formatter: '低波动率',
                  position: 'start'
                }
              },
              {
                yAxis: mediumLevel,
                label: {
                  formatter: '中波动率',
                  position: 'start'
                }
              }
            ]
          }
        }
      ]
    };
  };
  
  // 处理周期变化
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };
  
  // 处理窗口大小变化
  const handleWindowChange = (value: string) => {
    setWindowSize(value);
  };
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>波动率分析 - {symbol}</CardTitle>
          <CardDescription>股票价格波动率历史趋势分析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="text-red-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3 className="text-lg font-medium">无法获取数据</h3>
            </div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-4" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              重试
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>波动率分析 - {symbol}</CardTitle>
          <CardDescription className="mt-1">股票价格波动性的历史变化趋势</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="周期" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">日K</SelectItem>
              <SelectItem value="weekly">周K</SelectItem>
              <SelectItem value="monthly">月K</SelectItem>
            </SelectContent>
          </Select>
          <Select value={windowSize} onValueChange={handleWindowChange}>
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="窗口" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10天</SelectItem>
              <SelectItem value="20">20天</SelectItem>
              <SelectItem value="30">30天</SelectItem>
              <SelectItem value="60">60天</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            刷新
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 border-b pb-3">
          <p className="text-sm mb-2">波动率分析展示了股票价格波动的历史走势，帮助投资者评估风险水平。</p>
          <div className="mt-2 flex flex-wrap gap-5 text-xs text-muted-foreground">
            <span className="flex items-center"><span className="inline-block w-3 h-3 mr-1.5 bg-green-500 rounded-sm"></span>低波动率 (&lt;15%)</span>
            <span className="flex items-center"><span className="inline-block w-3 h-3 mr-1.5 bg-yellow-500 rounded-sm"></span>中波动率 (15-30%)</span>
            <span className="flex items-center"><span className="inline-block w-3 h-3 mr-1.5 bg-red-500 rounded-sm"></span>高波动率 (&gt;30%)</span>
          </div>
        </div>
        <div className="h-[350px] w-full">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-[90%] w-[95%] rounded-lg" />
            </div>
          ) : (
            <>
              <div ref={chartRef} className="h-full w-full" />
            </>
          )}
        </div>
        
        {!isLoading && (
          <div className="mt-2 py-2 px-3 bg-slate-50 dark:bg-slate-900 border rounded-md text-xs">
            <div className="flex items-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">图表分析提示</span>
            </div>
            <div className="ml-5 text-slate-600 dark:text-slate-400 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <div>• 较高的波动率通常意味着较高的投资风险</div>
              <div>• 波动率趋势突然上升可能预示市场情绪变化</div>
              <div>• 低波动率区间可能是积累期，可能预示大幅波动</div>
              <div>• 窗口期: {windowSize}天, 周期: {period === 'daily' ? '日' : period === 'weekly' ? '周' : '月'}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 