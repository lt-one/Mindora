"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCcw, AlertTriangle, Info } from 'lucide-react';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption, LineSeriesOption, BarSeriesOption } from 'echarts';
import { HOT_STOCKS } from '@/lib/data/china-stock-api';

// 颜色设置
const colors = {
  upColor: '#ff5555',
  downColor: '#33aa33',
  volColor: '#8ecaee',
  ma5Color: '#ffbf66',
  ma10Color: '#ff70f0',
  ma20Color: '#5555ff',
  ma30Color: '#68e0e0',
  primary: '#9F44D3',
  neutralColor: '#999999',
  gridLine: '#f0f0f0',
  axisLine: '#999'
};

interface MarketRSIProps {
  className?: string;
  title?: string;
  days?: number;
}

export default function MarketRSI({ className, title = '市场RSI分析', days = 90 }: MarketRSIProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    dates: string[];
    avgGains: number[];
    avgLosses: number[];
    rsi: number[];
    stockCount: number;
  } | null>(null);
  const [period, setPeriod] = useState('90');
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);
  
  // 获取数据
  useEffect(() => {
    fetchMarketRSIData();
  }, [period]);
  
  // 创建图表
  useEffect(() => {
    if (!chartRef.current || !data || isLoading) return;
    
    // 清除旧图表
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }
    
    // 初始化图表
    renderChart();
    
    // 清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data, isLoading]);
  
  // 响应窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current && !isLoading && data) {
        chartInstance.current.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, isLoading]);
  
  // 获取市场RSI数据
  const fetchMarketRSIData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/finance/market-breadth?days=${period}`);
      
      if (!response.ok) {
        throw new Error('获取市场RSI数据失败');
      }
      
      const result = await response.json();
      
      console.log('[MarketRSI] Raw API Response:', result);
      if (result.data && result.data.dates) {
        console.log('[MarketRSI] Dates received from API (first 20):', result.data.dates.slice(0, 20));
        console.log('[MarketRSI] Last date from API:', result.data.dates[result.data.dates.length - 1]);
        console.log('[MarketRSI] RSI data from API (first 20):', result.data.rsi?.slice(0, 20));
        console.log('[MarketRSI] RSI data from API (last 10 entries):', result.data.rsi?.slice(-10));
        console.log('[MarketRSI] AvgGains data from API (first 20 entries):', result.data.avgGains?.slice(0, 20));
        console.log('[MarketRSI] AvgLosses data from API (first 20 entries):', result.data.avgLosses?.slice(0, 20));
      }
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.message || '无数据返回');
      }
    } catch (err) {
      console.error('获取市场RSI数据出错:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 渲染图表
  const renderChart = () => {
    if (!chartRef.current || !data || data.dates.length === 0) return;
    
    // 创建图表实例
    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;
    
    // 准备数据
    const dates = data.dates;
    const rsiData = data.rsi;
    const avgGainsData = data.avgGains.map(val => typeof val === 'number' ? val * 100 : 0);
    const avgLossesData = data.avgLosses.map(val => typeof val === 'number' ? val * 100 : 0);
    
    console.log('[MarketRSI] Data prepared for chart:');
    console.log('[MarketRSI] Chart Dates (first 20):', dates.slice(0, 20));
    console.log('[MarketRSI] Chart Dates (last 10):', dates.slice(-10));
    console.log('[MarketRSI] Chart RSI Data (first 20):', rsiData.slice(0, 20));
    console.log('[MarketRSI] Chart RSI Data (last 10):', rsiData.slice(-10));
    console.log('[MarketRSI] Chart AvgGains Data (transformed, first 20):', avgGainsData.slice(0, 20));
    console.log('[MarketRSI] Chart AvgLosses Data (transformed, first 20):', avgLossesData.slice(0, 20));
    
    // 定义RSI线系列
    const rsiSeries: LineSeriesOption = {
      name: 'RSI',
      type: 'line',
      data: rsiData,
      yAxisIndex: 0,
      connectNulls: true,
      symbol: 'circle',
      symbolSize: 3,
      showSymbol: false,
      sampling: 'average',
      itemStyle: {
        color: colors.primary,
        borderWidth: 2,
        borderColor: '#fff'
      },
      lineStyle: {
        color: colors.primary,
        width: 2.5
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(159, 68, 211, 0.3)' },
          { offset: 1, color: 'rgba(159, 68, 211, 0.05)' }
        ])
      },
      markLine: {
        silent: true,
        label: {
          show: true,
          position: 'start',
          formatter: '{b}',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#333',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: [3, 6],
          borderRadius: 2
        },
        lineStyle: {
          width: 1.5
        },
        data: [
          { name: '超卖区 (30)', yAxis: 30, lineStyle: { color: colors.downColor, type: 'dashed', width: 1.5 } },
          { name: '中性区 (50)', yAxis: 50, lineStyle: { color: colors.neutralColor, type: 'dashed', width: 1.5 } },
          { name: '超买区 (70)', yAxis: 70, lineStyle: { color: colors.upColor, type: 'dashed', width: 1.5 } }
        ]
      },
      markPoint: {
        symbol: 'pin',
        symbolSize: 36,
        itemStyle: {
          color: colors.primary,
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 8
        },
        data: [
          {
            type: 'max', name: 'Max', itemStyle: { color: colors.upColor },
            label: {
              formatter: function(params: any) {
                const value = params.data && params.data.value;
                return 'RSI最高: ' + (typeof value === 'number' ? value.toFixed(1) : '0.0');
              },
              color: '#fff', fontSize: 12, backgroundColor: 'rgba(255, 85, 85, 0.9)',
              padding: [3, 5], borderRadius: 3, distance: 10, align: 'center', verticalAlign: 'middle'
            }
          },
          {
            type: 'min', name: 'Min', itemStyle: { color: colors.downColor },
            label: {
              formatter: function(params: any) {
                const value = params.data && params.data.value;
                return 'RSI最低: ' + (typeof value === 'number' ? value.toFixed(1) : '0.0');
              },
              color: '#fff', fontSize: 12, backgroundColor: 'rgba(51, 170, 51, 0.9)',
              padding: [3, 5], borderRadius: 3, distance: 10, align: 'center', verticalAlign: 'middle'
            }
          },
          {
            name: 'Current',
            coord: dates.length > 0 && rsiData && rsiData.length > 0 && typeof rsiData[rsiData.length - 1] === 'number' && rsiData[rsiData.length - 1] !== null
                   ? [dates.length - 1, rsiData[rsiData.length - 1]]
                   : undefined,
            symbol: 'circle', symbolSize: 8, itemStyle: { color: colors.primary },
            label: {
              show: true,
              formatter: function(params: any) {
                const value = params.data && params.data.value;
                if (typeof value !== 'number' || value === null) return '';
                return 'RSI: ' + value.toFixed(1);
              },
              color: '#fff', backgroundColor: 'rgba(159, 68, 211, 0.9)',
              padding: [4, 6], borderRadius: 3, fontSize: 13, position: 'right',
              distance: 15, align: 'center'
            }
          }
        ]
      }
    };
    
    const seriesArray = [rsiSeries];
    
    // 添加平均涨幅和平均跌幅系列
    if (avgGainsData && avgGainsData.length > 0) {
      seriesArray.push({
      name: '平均涨幅',
        type: 'line',
        data: avgGainsData,
      yAxisIndex: 1,
        connectNulls: true,
        symbol: 'none',
        sampling: 'average',
        lineStyle: { color: colors.upColor, width: 1.5, type: 'dashed' },
        itemStyle: { color: colors.upColor }
      });
    }
    if (avgLossesData && avgLossesData.length > 0) {
      seriesArray.push({
      name: '平均跌幅',
        type: 'line',
        data: avgLossesData,
      yAxisIndex: 1,
        connectNulls: true,
        symbol: 'none',
        sampling: 'average',
        lineStyle: { color: colors.downColor, width: 1.5, type: 'dashed' },
        itemStyle: { color: colors.downColor }
      });
    }
    
    const option: EChartsOption = {
      title: {
        text: `${title} (基于${data.stockCount}只股票)`,
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
        padding: [5, 10, 15, 10],
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 4,
      },
      graphic: dates.length > 0 ? [
        {
          type: 'text',
          left: 30,
          top: 0,
          style: {
            text: `数据截至: ${dates[dates.length - 1]}`,
            fontSize: 12,
            fill: '#666',
            opacity: 0.8
        }
        }
      ] : [],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', lineStyle: { color: '#999', width: 1, type: 'dashed' }},
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#555',
        borderWidth: 1,
        textStyle: { color: '#fff', fontSize: 14 },
        formatter: function(params: any) {
          if (!Array.isArray(params)) params = [params];
          const date = params[0].name;
          let tooltipContent = `<div style="text-align:center;font-weight:bold;margin-bottom:5px;">${date}</div>`;
          
          for (let i = 0; i < params.length; i++) {
            const param = params[i];
            if (param.seriesName === 'RSI') {
              const rsiValue = param.value;
              if (rsiValue === null || rsiValue === undefined) {
                tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>${param.marker} <span style="color:${colors.primary};font-weight:bold;">RSI:</span></span><span style="font-weight:bold;">--</span></div>`;
                continue;
              }
              const rsiColor = rsiValue >= 70 ? colors.upColor : (rsiValue <= 30 ? colors.downColor : colors.primary);
          let rsiStatus = '中性';
              if (rsiValue >= 70) rsiStatus = '超买'; else if (rsiValue <= 30) rsiStatus = '超卖';
              tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>${param.marker} <span style="color:${rsiColor};font-weight:bold;">RSI:</span></span><span style="font-weight:bold;">${(typeof rsiValue === 'number' ? rsiValue.toFixed(2) : '--')} (${rsiStatus})</span></div>`;
            }
            if (param.seriesName === '平均涨幅') {
              const originalValue = (param.value !== null && param.value !== undefined) ? (param.value / 100).toFixed(2) : '0.00';
              tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>${param.marker} <span style="color:${colors.upColor};font-weight:bold;">平均涨幅:</span></span><span style="font-weight:bold;">${originalValue}%</span></div>`;
            }
            if (param.seriesName === '平均跌幅') {
              const originalValue = (param.value !== null && param.value !== undefined) ? (param.value / 100).toFixed(2) : '0.00';
              tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;"><span>${param.marker} <span style="color:${colors.downColor};font-weight:bold;">平均跌幅:</span></span><span style="font-weight:bold;">${originalValue}%</span></div>`;
            }
          }
          const gainParam = params.find((p: any) => p.seriesName === '平均涨幅');
          const lossParam = params.find((p: any) => p.seriesName === '平均跌幅');
          if (gainParam && lossParam && gainParam.value !== null && gainParam.value !== undefined && lossParam.value !== null && lossParam.value !== undefined && lossParam.value !== 0) {
            const rs = gainParam.value / lossParam.value;
            tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;"><span><span style="color:${colors.neutralColor};font-weight:bold;">RS比率:</span></span><span style="font-weight:bold;">${rs.toFixed(2)}</span></div>`;
          }
          return tooltipContent;
        }
      },
      legend: {
        show: true,
        data: ['RSI', '平均涨幅', '平均跌幅'],
        selected: { 'RSI': true, '平均涨幅': true, '平均跌幅': true },
        top: 0,
        right: 30
      },
      grid: [{
        left: '10%',
        right: '8%',
        top: '10%',
        bottom: '15%',
        containLabel: true
      }],
      xAxis: [{
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: colors.axisLine } },
        axisTick: { show: true, length: 4, inside: true, lineStyle: { color: colors.axisLine } },
        splitLine: { show: false },
        axisLabel: { 
          show: true, 
          formatter: function(value: string) {
            const parts = value.split('-');
            if (parts.length >= 3) {
              return `${parts[1]}-${parts[2]}`;
            }
            return value;
          },
          margin: 12,
          rotate: dates.length > 60 ? 30 : 0
        },
        min: 'dataMin',
        max: function() { if (dates && dates.length > 0) return dates[dates.length - 1]; return 'dataMax'; }
      }],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 100,
          interval: 10,
          scale: false,
          splitNumber: 10,
          axisLabel: { show: true, inside: false, margin: 16, formatter: '{value}' },
          axisLine: { show: true, lineStyle: { color: colors.axisLine } },
          axisTick: { show: true, length: 4, inside: true, lineStyle: { color: colors.axisLine } },
          splitLine: { show: true, lineStyle: { color: colors.gridLine, opacity: 0.6 } },
          splitArea: {
            show: true,
            areaStyle: {
              color: [
                'rgba(86, 228, 86, 0.05)',
                'rgba(250, 250, 250, 0.05)',
                'rgba(228, 86, 86, 0.05)'
              ]
            }
          }
        },
        {
          name: '百分比',
          nameLocation: 'middle',
          nameGap: 30,
          nameRotate: 90,
          nameTextStyle: { color: '#666', fontWeight: 'bold', padding: [0, 0, 10, 0], fontSize: 12 },
          type: 'value',
          position: 'right',
          min: 0,
          max: function (value) {
            let maxVal = 0;
            if (value.max > 1000) {
                maxVal = Math.min(value.max, 1000);
            } else {
                maxVal = Math.max(10, Math.ceil(value.max * 1.2));
            }
            const typicalMaxGain = Math.max(...avgGainsData.filter(v => v < 1000));
            const typicalMaxLoss = Math.max(...avgLossesData.filter(v => v < 1000));
            const overallTypicalMax = Math.max(typicalMaxGain, typicalMaxLoss, 10);

            return Math.min(maxVal, Math.ceil(overallTypicalMax * 1.5));
          },
          offset: 10,
          axisLabel: { formatter: '{value}%', margin: 4, fontSize: 11 },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0],
          rangeMode: ['value', 'percent'],
          minSpan: 5,
          start: 0,
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0],
          type: 'slider',
          bottom: 15,
          height: 20,
          rangeMode: ['value', 'percent'],
          minSpan: 5,
          start: 0,
          end: 100
        }
      ],
      series: seriesArray
    };
    
    // 设置图表选项
    chart.setOption(option);
  };
  
  // 处理周期变化
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };
  
  // 根据RSI的最新值判断市场状态
  const getMarketStatus = () => {
    if (!data || !data.rsi || data.rsi.length === 0) return null;
    
    const latestRSI = data.rsi[data.rsi.length - 1];
    
    if (latestRSI >= 70) {
      return { status: '超买', color: colors.upColor, description: '市场可能处于超买状态，风险较高' };
    } else if (latestRSI <= 30) {
      return { status: '超卖', color: colors.downColor, description: '市场可能处于超卖状态，机会增加' };
    } else if (latestRSI >= 60) {
      return { status: '偏强', color: '#ff9966', description: '市场处于强势状态' };
    } else if (latestRSI <= 40) {
      return { status: '偏弱', color: '#66cc99', description: '市场处于弱势状态' };
    } else {
      return { status: '中性', color: colors.neutralColor, description: '市场处于中性状态' };
    }
  };
  
  const marketStatus = getMarketStatus();
  
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="选择周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">最近30天</SelectItem>
                <SelectItem value="60">最近60天</SelectItem>
                <SelectItem value="90">最近90天</SelectItem>
                <SelectItem value="180">最近180天</SelectItem>
                <SelectItem value="365">最近1年</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              className="h-9 w-9"
              onClick={() => fetchMarketRSIData()}
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">刷新</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* 市场状态摘要 */}
        {!isLoading && !error && data && marketStatus && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-sm font-medium">当前市场RSI: </span>
              <span className="font-bold ml-1" style={{ color: marketStatus.color }}>
                {data.rsi[data.rsi.length - 1].toFixed(2)}
              </span>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full" 
                style={{ backgroundColor: marketStatus.color, color: 'white' }}>
                {marketStatus.status}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {marketStatus.description}
            </span>
          </div>
        )}
        
        <div className="h-[530px] w-full relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Skeleton className="h-[90%] w-[95%] rounded-lg" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm max-w-lg">
                <div className="text-red-500 text-xl mb-4 flex items-center justify-center">
                  <AlertTriangle className="mr-2" />
                  <span>图表加载失败</span>
                </div>
                <p className="text-gray-700 mb-6">{error}</p>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    fetchMarketRSIData();
                  }}
                >
                  重试
                </Button>
              </div>
            </div>
          ) : null}
          <div ref={chartRef} className="h-full w-full" />
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>* RSI数据基于市场中{data?.stockCount || '多只'}股票的平均涨跌幅计算</p>
          <p>* RSI &gt; 70: 市场可能超买; RSI &lt; 30: 市场可能超卖; 其他区间为中性</p>
        </div>
      </CardContent>
    </Card>
  );
} 