"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import * as echarts from 'echarts';
import { HOT_STOCKS } from '@/lib/data/china-stock-api';

// 颜色设置
const colors = {
  upColor: '#ff5050',
  downColor: '#33aa33',
  volColor: '#999999',
  ma5Color: '#9F44D3',
  ma10Color: '#B48B22',
  ma20Color: '#22A2B4',
  ma30Color: '#9A8A59'
};

// K线周期选项
const periodOptions = [
  { value: 'daily', label: '日K' },
  { value: 'weekly', label: '周K' },
  { value: 'monthly', label: '月K' },
  { value: '60min', label: '60分钟' },
  { value: '30min', label: '30分钟' },
  { value: '15min', label: '15分钟' },
  { value: '5min', label: '5分钟' }
];

// 技术指标选项
const indicatorOptions = [
  { value: 'MA', label: '均线' },
  { value: 'MACD', label: 'MACD' },
  { value: 'RSI', label: 'RSI' }
];

export default function TechnicalAnalysis() {
  const [stockSymbol, setStockSymbol] = useState(HOT_STOCKS[0].symbol);
  const [stockName, setStockName] = useState(HOT_STOCKS[0].name);
  const [period, setPeriod] = useState('daily');
  const [indicator, setIndicator] = useState('MA');
  const [klineData, setKlineData] = useState<any[] | null>(null);
  const [technicalData, setTechnicalData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const chartRef = useRef<HTMLDivElement>(null);
  
  // 获取K线数据
  useEffect(() => {
    fetchKlineData();
  }, [stockSymbol, period]);
  
  // 获取技术指标数据
  useEffect(() => {
    fetchTechnicalData();
  }, [stockSymbol, indicator]);
  
  // 处理图表渲染
  useEffect(() => {
    if (!chartRef.current || !klineData || klineData.length === 0 || isLoading) return;
    
    renderChart();
  }, [klineData, technicalData, indicator, isLoading]);
  
  // 搜索股票时的处理
  const handleSearch = () => {
    const matchedStock = HOT_STOCKS.find(
      stock => stock.name.includes(searchQuery) || stock.symbol.includes(searchQuery)
    );
    
    if (matchedStock) {
      setStockSymbol(matchedStock.symbol);
      setStockName(matchedStock.name);
      setSearchQuery('');
    }
  };
  
  // 获取K线数据
  const fetchKlineData = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/finance/kline?symbol=${stockSymbol}&period=${period}`);
      
      if (!response.ok) {
        throw new Error('获取K线数据失败');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setKlineData(result.data);
      } else {
        throw new Error(result.message || '无数据返回');
      }
    } catch (err) {
      console.error('获取K线数据出错:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 获取技术指标数据
  const fetchTechnicalData = async () => {
    try {
      let indicatorType = '';
      
      switch (indicator) {
        case 'MA':
          indicatorType = 'sma';
          break;
        case 'MACD':
          indicatorType = 'macd';
          break;
        case 'RSI':
          indicatorType = 'rsi';
          break;
      }
      
      const response = await fetch(`/api/finance/technical-indicators?symbol=${stockSymbol}&indicator=${indicatorType}`);
      
      if (!response.ok) {
        throw new Error('获取技术指标数据失败');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setTechnicalData(result.data);
      } else {
        throw new Error(result.message || '无数据返回');
      }
    } catch (err) {
      console.error('获取技术指标数据出错:', err);
      setError((err as Error).message);
    }
  };
  
  // 渲染图表
  const renderChart = () => {
    if (!chartRef.current || !klineData) return;
    
    const chart = echarts.init(chartRef.current);
    
    // 准备K线数据
    const dates = klineData.map(item => item.date);
    const data = klineData.map(item => [item.open, item.close, item.low, item.high]);
    const volumes = klineData.map(item => item.volume);
    
    // 准备技术指标数据
    let indicatorSeries: any[] = [];
    
    if (technicalData) {
      switch (indicator) {
        case 'MA':
          // 计算移动平均线
          const ma5Data = calculateMA(5, klineData);
          const ma10Data = calculateMA(10, klineData);
          const ma20Data = calculateMA(20, klineData);
          const ma30Data = calculateMA(30, klineData);
          
          indicatorSeries = [
            {
              name: 'MA5',
              type: 'line',
              data: ma5Data,
              smooth: true,
              lineStyle: {
                opacity: 0.7,
                width: 1,
                color: colors.ma5Color
              }
            },
            {
              name: 'MA10',
              type: 'line',
              data: ma10Data,
              smooth: true,
              lineStyle: {
                opacity: 0.7,
                width: 1,
                color: colors.ma10Color
              }
            },
            {
              name: 'MA20',
              type: 'line',
              data: ma20Data,
              smooth: true,
              lineStyle: {
                opacity: 0.7,
                width: 1,
                color: colors.ma20Color
              }
            },
            {
              name: 'MA30',
              type: 'line',
              data: ma30Data,
              smooth: true,
              lineStyle: {
                opacity: 0.7,
                width: 1,
                color: colors.ma30Color
              }
            }
          ];
          break;
          
        case 'MACD':
          if (technicalData.values && technicalData.values.dif) {
            const difData = technicalData.values.dif;
            const deaData = technicalData.values.dea;
            const macdData = technicalData.values.macd;
            
            // 添加MACD指标
            indicatorSeries = [
              {
                name: 'DIF',
                type: 'line',
                data: difData,
                symbol: 'none',
                lineStyle: {
                  color: '#9F44D3'
                }
              },
              {
                name: 'DEA',
                type: 'line',
                data: deaData,
                symbol: 'none',
                lineStyle: {
                  color: '#EE6666'
                }
              },
              {
                name: 'MACD',
                type: 'bar',
                data: macdData,
                itemStyle: {
                  color: function(params: any) {
                    return params.data >= 0 ? colors.upColor : colors.downColor;
                  }
                }
              }
            ];
          }
          break;
          
        case 'RSI':
          if (technicalData.values) {
            indicatorSeries = [
              {
                name: 'RSI',
                type: 'line',
                data: technicalData.values,
                lineStyle: {
                  color: '#9F44D3'
                },
                markLine: {
                  data: [
                    { yAxis: 30, lineStyle: { color: 'green' } },
                    { yAxis: 70, lineStyle: { color: 'red' } }
                  ]
                }
              }
            ];
          }
          break;
      }
    }
    
    // 配置图表选项
    const option: any = {
      title: {
        text: `${stockName} (${stockSymbol}) - ${getDisplayPeriod(period)}`,
        left: 'center',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params: any) {
          const candleParams = params.find((param: any) => param.seriesIndex === 0);
          if (!candleParams) return '';
          
          let result = `${candleParams.name}<br/>`;
          result += `开盘: ${candleParams.data[0].toFixed(2)}<br/>`;
          result += `收盘: ${candleParams.data[1].toFixed(2)}<br/>`;
          result += `最低: ${candleParams.data[2].toFixed(2)}<br/>`;
          result += `最高: ${candleParams.data[3].toFixed(2)}<br/>`;
          
          // 添加指标数据
          params.forEach((param: any) => {
            if (param.seriesIndex !== 0 && param.seriesIndex !== 1) {
              result += `${param.marker} ${param.seriesName}: ${
                typeof param.data === 'number' ? param.data.toFixed(2) : '-'
              }<br/>`;
            }
          });
          
          return result;
        }
      },
      legend: {
        data: ['K线', '成交量', ...indicatorSeries.map(series => series.name)],
        top: 30
      },
      grid: [
        {
          left: '3%',
          right: '3%',
          top: '60',
          height: indicator === 'MA' ? '60%' : '40%'
        },
        {
          left: '3%',
          right: '3%',
          top: indicator === 'MA' ? '75%' : '55%',
          height: '20%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: dates,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#999' } },
          axisLabel: {
            formatter: function(value: string) {
              return value;
            }
          },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            show: true
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: dates,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#999' } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true
          }
        },
        {
          gridIndex: 1,
          splitNumber: 3,
          axisLine: { lineStyle: { color: '#999' } },
          axisTick: { show: false },
          axisLabel: { show: true },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: Math.max(0, 100 - Math.min(100, data.length / 3)),
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: 10,
          start: Math.max(0, 100 - Math.min(100, data.length / 3)),
          end: 100
        }
      ],
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: data,
          itemStyle: {
            color: colors.upColor,
            color0: colors.downColor,
            borderColor: colors.upColor,
            borderColor0: colors.downColor
          }
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: function(params: any) {
              const i = params.dataIndex;
              return klineData[i].close > klineData[i].open 
                ? colors.upColor 
                : colors.downColor;
            }
          }
        },
        ...indicatorSeries
      ]
    };
    
    // 添加额外的技术指标图表区域
    if (indicator !== 'MA') {
      option.grid.push({
        left: '3%',
        right: '3%',
        top: '80%',
        height: '15%'
      });
      
      option.xAxis.push({
        type: 'category',
        gridIndex: 2,
        data: dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#999' } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: true },
        min: 'dataMin',
        max: 'dataMax'
      });
      
      option.yAxis.push({
        gridIndex: 2,
        scale: true,
        splitNumber: 2,
        axisLabel: { show: true },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      });
    }
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  };
  
  // 计算移动平均线
  const calculateMA = (dayCount: number, data: any[]) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < dayCount - 1) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data[i - j].close;
      }
      result.push((sum / dayCount).toFixed(2));
    }
    return result;
  };
  
  // 获取周期显示名称
  const getDisplayPeriod = (periodValue: string) => {
    const option = periodOptions.find(opt => opt.value === periodValue);
    return option ? option.label : periodValue;
  };
  
  if (error) {
    return <div className="text-center text-red-500 py-4">加载失败: {error}</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索股票名称或代码"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>搜索</Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="选择周期" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={indicator} onValueChange={setIndicator}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="技术指标" />
            </SelectTrigger>
            <SelectContent>
              {indicatorOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              fetchKlineData();
              fetchTechnicalData();
            }}
            disabled={isLoading}
          >
            刷新
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div className="h-[600px] w-full">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-[90%] w-[95%] rounded-lg" />
              </div>
            ) : (
              <div ref={chartRef} className="h-full w-full" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 