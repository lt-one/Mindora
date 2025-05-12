"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import * as echarts from 'echarts';
import { getKLineData, MAJOR_INDICES, HOT_STOCKS } from '@/lib/data/china-stock-api';

// 预设股票组合
const STOCK_GROUPS = {
  indices: MAJOR_INDICES.slice(0, 4), // 主要指数
  banks: [
    { symbol: 'sh601398', name: '工商银行' },
    { symbol: 'sh601288', name: '农业银行' },
    { symbol: 'sh601988', name: '中国银行' },
    { symbol: 'sh601939', name: '建设银行' },
    { symbol: 'sh600036', name: '招商银行' }
  ],
  technology: [
    { symbol: 'sz000063', name: '中兴通讯' },
    { symbol: 'sh600100', name: '同方股份' },
    { symbol: 'sz002415', name: '海康威视' },
    { symbol: 'sh600703', name: '三安光电' },
    { symbol: 'sz300059', name: '东方财富' }
  ],
  consumer: [
    { symbol: 'sh600519', name: '贵州茅台' },
    { symbol: 'sz000858', name: '五粮液' },
    { symbol: 'sh600887', name: '伊利股份' },
    { symbol: 'sh601888', name: '中国中免' },
    { symbol: 'sz000333', name: '美的集团' }
  ],
  energy: [
    { symbol: 'sh601857', name: '中国石油' },
    { symbol: 'sh600028', name: '中国石化' },
    { symbol: 'sh601985', name: '中国核电' },
    { symbol: 'sh601088', name: '中国神华' },
    { symbol: 'sh600900', name: '长江电力' }
  ],
  hotStocks: HOT_STOCKS.slice(0, 5) // 热门股票
};

interface StockComparisonChartProps {
  mainSymbol?: string;
  initialData?: any;
  onRefresh?: () => void;
}

interface StockData {
  symbol: string;
  name: string;
  data: any[];
  normalizedData?: Array<{date: string; value: number}>;
}

export default function StockComparisonChart({ 
  mainSymbol = 'sh000001', 
  initialData, 
  onRefresh 
}: StockComparisonChartProps) {
  const [comparisonData, setComparisonData] = useState<StockData[] | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("30");
  const [stockGroup, setStockGroup] = useState<string>("indices");
  const chartRef = useRef<HTMLDivElement | null>(null);
  
  // 获取数据
  useEffect(() => {
    if (initialData) {
      setComparisonData(initialData);
      return;
    }
    
    fetchComparisonData();
  }, [stockGroup, period]);
  
  // 渲染图表
  useEffect(() => {
    if (!chartRef.current || !comparisonData || isLoading) return;
    
    const chart = echarts.init(chartRef.current);
    
    const option = generateChartOption(comparisonData);
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
  }, [comparisonData, isLoading]);
  
  // 获取数据
  const fetchComparisonData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 获取要对比的股票列表
      const stocksToCompare = STOCK_GROUPS[stockGroup as keyof typeof STOCK_GROUPS] || STOCK_GROUPS.indices;
      
      // 获取所有股票的K线数据（并行请求）
      const days = parseInt(period);
      const stockDataPromises = stocksToCompare.map(stock => 
        getKLineData(stock.symbol, 'daily', days)
          .then(data => ({
            symbol: stock.symbol,
            name: stock.name,
            data
          }))
          .catch(error => {
            console.error(`获取${stock.name}K线数据失败:`, error);
            return {
              symbol: stock.symbol,
              name: stock.name,
              data: null
            };
          })
      );
      
      const results = await Promise.all(stockDataPromises);
      
      // 过滤掉没有数据的股票
      const validResults = results.filter(result => result.data && result.data.length > 0) as StockData[];
      
      if (validResults.length === 0) {
        throw new Error('无法获取任何股票的K线数据');
      }
      
      // 为每个股票计算相对表现（归一化）
      const processedData = validResults.map(result => {
        const firstPrice = result.data[0].close;
        const normalizedData = result.data.map((item: any) => ({
          date: item.date,
          // 计算相对于起始日的百分比变化
          value: ((item.close / firstPrice) - 1) * 100
        }));
        
        return {
          ...result,
          normalizedData
        };
      });
      
      setComparisonData(processedData);
    } catch (err) {
      console.error('获取对比数据出错:', err);
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
      fetchComparisonData();
    }
  };
  
  // 生成图表配置
  const generateChartOption = (data: StockData[]) => {
    // 获取所有日期（以第一个股票的日期为准）
    const dates = data[0]?.normalizedData?.map(item => item.date) || [];
    
    // 为每只股票生成系列
    const series = data.map(stockData => ({
      name: stockData.name,
      type: 'line',
      data: stockData.normalizedData?.map(item => item.value),
      symbol: 'none',
      smooth: true
    }));
    
    // 设置随机颜色（保持一致性）
    const colors = [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', 
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
    ];
    
    return {
      color: colors,
      title: {
        text: '股票相对表现对比',
        left: 'center',
        top: 0
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const date = dates[params[0].dataIndex];
          let result = `${date}<br/>`;
          
          // 按照表现排序（从高到低）
          params.sort((a: any, b: any) => b.value - a.value);
          
          params.forEach((param: any) => {
            result += `${param.marker} ${param.seriesName}: ${param.value.toFixed(2)}%<br/>`;
          });
          
          return result;
        }
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        bottom: 10,
        data: data.map(item => item.name)
      },
      grid: {
        left: '3%',
        right: '4%',
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
        data: dates,
        axisLabel: {
          rotate: 30,
          formatter: function(value: string) {
            return value.substring(5); // 仅显示月-日
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '相对变化 (%)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLine: {
          show: true
        },
        splitLine: {
          show: true
        },
        // 添加零轴线
        splitArea: {
          show: false
        }
      },
      series,
      // 标记0线
      markLine: {
        symbol: 'none',
        data: [
          { yAxis: 0 }
        ],
        lineStyle: {
          color: '#999',
          type: 'dashed'
        }
      }
    };
  };
  
  // 处理周期变化
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };
  
  // 处理股票组合变化
  const handleGroupChange = (value: string) => {
    setStockGroup(value);
  };
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>股票对比</CardTitle>
          <CardDescription>多股票相对表现对比分析</CardDescription>
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
          <CardTitle>股票对比</CardTitle>
          <CardDescription className="mt-1">多只股票相对表现对比分析</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={stockGroup} onValueChange={handleGroupChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="股票组合" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indices">主要指数</SelectItem>
              <SelectItem value="banks">银行股</SelectItem>
              <SelectItem value="technology">科技股</SelectItem>
              <SelectItem value="consumer">消费股</SelectItem>
              <SelectItem value="energy">能源股</SelectItem>
              <SelectItem value="hotStocks">热门股票</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="周期" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7天</SelectItem>
              <SelectItem value="30">30天</SelectItem>
              <SelectItem value="90">90天</SelectItem>
              <SelectItem value="180">180天</SelectItem>
              <SelectItem value="365">1年</SelectItem>
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
          <p className="text-sm mb-2">此图表展示了不同股票在相同时间段内的相对表现，以百分比变化展示，方便对比。</p>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>基准日: 起始日=0%, 上升=正值, 下降=负值</span>
          </div>
        </div>
        <div className="h-[380px] w-full">
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
              <div>• 斜率越陡表示涨跌速度越快</div>
              <div>• 线条在0线上方表示相对起始日上涨，下方表示下跌</div>
              <div>• 相对表现最好的股票位于图表上方</div>
              <div>• 可比较不同股票的强弱势和相对收益</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 