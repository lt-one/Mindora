"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowUpIcon, ArrowDownIcon, RefreshCwIcon } from 'lucide-react';
import * as echarts from 'echarts';
import { cn } from '@/lib/utils';
import { formatPrice, formatChange, formatChangePercent, calculateChangePercent } from '@/lib/utils';
import logger from '@/lib/logger';

interface TimeSeriesDataPoint {
  time: string;
  price: number;
  avgPrice?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  amount?: number;
}

interface StockTimeSeriesProps {
  symbol: string;
  name?: string;
  refreshInterval?: number;
  className?: string;
}

export default function StockTimeSeries({
  symbol,
  name,
  refreshInterval = 60000,
  className
}: StockTimeSeriesProps) {
  const [stockData, setStockData] = useState<{
    symbol: string;
    name: string;
    timePoints: TimeSeriesDataPoint[];
    preClose: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // 图表引用
  const chartRef = useRef<HTMLDivElement>(null);
  
  // 图表实例
  const chartInstance = useRef<echarts.ECharts | null>(null);
  
  // 获取分时数据
  const fetchTimeSeriesData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/finance/time-series?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error('获取分时数据失败');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setStockData(result.data);
        setLastUpdated(new Date().toLocaleTimeString('zh-CN'));
      } else {
        throw new Error(result.message || '无分时数据返回');
      }
    } catch (err) {
      console.error('获取分时数据出错:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载数据和设置刷新定时器
  useEffect(() => {
    fetchTimeSeriesData();
    
    // 设置定时器，定期刷新数据
    let timer: NodeJS.Timeout | null = null;
    if (refreshInterval > 0) {
      timer = setInterval(fetchTimeSeriesData, refreshInterval);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [symbol, refreshInterval]);
  
  // 渲染价格和成交量图表
  useEffect(() => {
    if (!chartRef.current || !stockData || isLoading) return;
    
    // 清理旧的图表实例
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }
    
    // 创建图表实例
    chartInstance.current = echarts.init(chartRef.current);
    
    // 准备数据
    const times = stockData.timePoints.map(point => point.time);
    const prices = stockData.timePoints.map(point => point.price);
    const avgPrices = stockData.timePoints
      .filter(point => point.avgPrice !== undefined)
      .map(point => point.avgPrice!);
    const volumes = stockData.timePoints
      .filter(point => point.volume !== undefined)
      .map(point => point.volume!);
    
    // 计算价格范围以确保y轴比例合适
    const preClose = stockData.preClose;
    const minPrice = Math.min(...prices, preClose) * 0.998;
    const maxPrice = Math.max(...prices, preClose) * 1.002;
    
    // 设置图表选项
    const option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#555',
            width: 1,
            type: 'dashed'
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: [8, 10],
        textStyle: {
          color: '#333',
          fontSize: 12
        },
        formatter: function(params: any) {
          const timeIndex = params[0].dataIndex;
          const time = times[timeIndex];
          const price = prices[timeIndex];
          const avgPrice = stockData.timePoints[timeIndex].avgPrice;
          const volumeValue = stockData.timePoints[timeIndex].volume || 0;
          
          // 计算价格涨跌幅，使用统一的计算函数
          const priceChange = Number((price - preClose).toFixed(2));
          const priceChangePercent = calculateChangePercent(price, preClose);
          
          // 计算成交量占比
          const maxVolume = Math.max(...volumes);
          const volumePercent = maxVolume > 0 ? (volumeValue / maxVolume) * 100 : 0;
          
          // 添加标签颜色
          const priceColor = price >= preClose ? '#f43f5e' : '#10b981';
          
          let result = `<div style="font-weight:bold">${time}</div>`;
          result += `<div style="margin-top:4px;">
            <span style="display:inline-block;width:60px;">价格:</span>
            <span style="color:${priceColor};font-weight:bold">${formatPrice(price)}</span>
          </div>`;
          result += `<div>
            <span style="display:inline-block;width:60px;">涨跌:</span>
            <span style="color:${priceChange >= 0 ? '#f43f5e' : '#10b981'}">${formatChange(priceChange)} (${priceChangePercent >= 0 ? '+' : ''}${formatChangePercent(priceChangePercent)})</span>
          </div>`;
          
          if (avgPrice !== undefined) {
            result += `<div>
              <span style="display:inline-block;width:60px;">均价:</span>
              <span>${formatPrice(avgPrice)}</span>
            </div>`;
          }
          
          if (volumeValue !== undefined) {
            result += `<div>
              <span style="display:inline-block;width:60px;">成交量:</span>
              <span>${(volumeValue / 100).toFixed(0)}手 (${volumePercent.toFixed(1)}%)</span>
            </div>`;
          }
          
          return result;
        }
      },
      axisPointer: {
        link: [{xAxisIndex: 'all'}]
      },
      grid: [
        {
          left: '3%',
          right: '4%',
          top: '5%',
          height: '70%'  // 增加主图高度
        },
        {
          left: '3%',
          right: '4%',
          top: '78%',  // 上移成交量图表位置
          height: '17%'  // 减少成交量图表高度
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: times,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#999' } },
          axisLabel: {
            fontSize: 10,
            formatter: function(value: string) {
              // 格式化x轴标签，重要时间点特殊标记
              if (value === '09:30' || value === '15:00' || value === '13:00' || value === '11:30') {
                return `{a|${value}}`;
              }
              return value;
            },
            rich: {
              a: {
                color: '#f43f5e',
                fontWeight: 'bold'
              }
            }
          },
          min: 'dataMin',
          max: 'dataMax',
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
              type: 'dashed'
            }
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: times,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#999' } },
          axisTick: { show: false },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          position: 'right',
          axisLine: { 
            show: true, 
            lineStyle: { color: '#999' }
          },
          axisLabel: {
            formatter: (value: number) => formatPrice(value),
            fontSize: 10
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
              type: 'dashed'
            }
          },
          splitNumber: 4,
          min: function(value: { min: number }) {
            // 确保y轴下限低于最低价一定比例
            return Math.floor(value.min * 0.998 * 100) / 100;
          },
          max: function(value: { max: number }) {
            // 确保y轴上限高于最高价一定比例
            return Math.ceil(value.max * 1.002 * 100) / 100;
          }
        },
        {
          type: 'value',
          gridIndex: 1,
          position: 'right',
          axisLine: { show: false },
          axisLabel: {
            show: true,
            formatter: (value: number) => {
              if (value >= 10000000) {
                return (value / 10000000).toFixed(1) + '千万';
              } else if (value >= 10000) {
                return (value / 10000).toFixed(1) + '万';
              }
              return value;
            },
            fontSize: 9
          },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 0,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          xAxisIndex: [0, 1],
          bottom: 5,
          start: 0,
          end: 100,
          height: 20
        }
      ],
      series: [
        // 价格线
        {
          name: '价格',
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: prices,
          symbol: 'none',
          itemStyle: {
            color: '#ff5050'
          },
          lineStyle: {
            width: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 80, 80, 0.4)' },
              { offset: 0.5, color: 'rgba(255, 80, 80, 0.2)' },
              { offset: 1, color: 'rgba(255, 80, 80, 0.05)' }
            ])
          },
          // 添加标记点，显示最高和最低价
          markPoint: {
            symbol: 'pin',
            symbolSize: 35,
            data: [
              { 
                type: 'max', 
                name: '最高价',
                itemStyle: { color: '#ff5050' },
                label: { 
                  formatter: '{c}',
                  fontSize: 10,
                  color: '#fff'
                }
              },
              { 
                type: 'min', 
                name: '最低价',
                itemStyle: { color: '#10b981' },
                label: { 
                  formatter: '{c}',
                  fontSize: 10,
                  color: '#fff'
                }
              }
            ]
          }
        },
        // 均价线
        avgPrices.length > 0 ? {
          name: '均价',
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: avgPrices,
          symbol: 'none',
          itemStyle: {
            color: '#FAB040'
          },
          lineStyle: {
            width: 1.5,
            type: 'dashed'
          }
        } : {},
        // 昨收线
        {
          name: '昨收',
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: Array(prices.length).fill(preClose),
          symbol: 'none',
          itemStyle: {
            color: '#777777'
          },
          lineStyle: {
            width: 1.5,
            type: 'solid'
          },
          markLine: {
            symbol: 'none',
            label: {
              formatter: '昨收: {c}',
              position: 'start',
              fontSize: 10,
              color: '#777',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: [2, 4]
            },
            lineStyle: {
              color: '#777',
              width: 1.5,
              type: 'solid'
            },
            data: [
              {
                yAxis: preClose
              }
            ]
          }
        },
        // 成交量柱状图
        volumes.length > 0 ? {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes.map((volume, index) => {
            const price = prices[index];
            const prevPrice = index > 0 ? prices[index - 1] : preClose;
            
            return {
              value: volume,
              itemStyle: {
                color: price >= prevPrice 
                  ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: 'rgba(255, 80, 80, 0.8)' },
                      { offset: 1, color: 'rgba(255, 80, 80, 0.3)' }
                    ])
                  : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: 'rgba(16, 185, 129, 0.8)' },
                      { offset: 1, color: 'rgba(16, 185, 129, 0.3)' }
                    ])
              }
            };
          }),
          barWidth: '80%'
        } : {}
      ].filter(series => Object.keys(series).length > 0) // 过滤掉空的系列
    };
    
    chartInstance.current.setOption(option);
    
    // 处理窗口大小变化
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [stockData, isLoading]);
  
  // 计算当前价格与昨收的涨跌
  const calculatePriceChange = () => {
    if (!stockData || stockData.timePoints.length === 0) return null;
    
    const latestData = stockData.timePoints[stockData.timePoints.length - 1];
    const latestPrice = latestData.price;
    const preClose = stockData.preClose;
    
    // 使用统一的计算和格式化方式
    const change = Number((latestPrice - preClose).toFixed(2));
    const changePercent = Number(((change / preClose) * 100).toFixed(2));
    
    return {
      price: latestPrice,
      change,
      changePercent,
      isUp: change >= 0
    };
  };
  
  const priceChangeInfo = calculatePriceChange();
  
  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>分时走势图</CardTitle>
          <CardDescription>{symbol}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-4">加载失败: {error}</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("w-full shadow-sm", className)}>
      <CardContent className="p-0">
        {/* 添加卡片标题栏 */}
        <div className="flex justify-between items-center p-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{stockData?.name || name || symbol}</h3>
            <div className="text-xs text-muted-foreground">
              {lastUpdated ? `更新: ${lastUpdated}` : ''}
            </div>
          </div>
          
          {/* 添加刷新按钮 */}
          <button 
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={fetchTimeSeriesData}
            disabled={isLoading}
            title="刷新数据"
          >
            <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
          </button>
        </div>
        
        {/* 股票价格和涨跌信息摘要 */}
        {stockData && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/30 flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold" style={{ 
                  color: stockData.timePoints.length > 0 
                    ? (stockData.timePoints[stockData.timePoints.length - 1].price >= stockData.preClose ? '#f43f5e' : '#10b981') 
                    : 'inherit' 
                }}>
                  {stockData.timePoints.length > 0 
                    ? formatPrice(stockData.timePoints[stockData.timePoints.length - 1].price) 
                    : '0.00'}
                </span>
                
                {stockData.timePoints.length > 0 && (
                  <div className="flex items-center">
                    <Badge variant={stockData.timePoints[stockData.timePoints.length - 1].price >= stockData.preClose ? "destructive" : "default"}>
                      {stockData.timePoints[stockData.timePoints.length - 1].price >= stockData.preClose 
                        ? <ArrowUpIcon className="h-3 w-3 mr-0.5" /> 
                        : <ArrowDownIcon className="h-3 w-3 mr-0.5" />}
                      {formatChangePercent(calculateChangePercent(
                        stockData.timePoints[stockData.timePoints.length - 1].price, 
                        stockData.preClose
                      ))}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                昨收: {formatPrice(stockData.preClose)}
              </div>
            </div>
            
            <div className="text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-muted-foreground">最高:</span> 
                  <span className="ml-1 text-red-500 font-medium">
                    {formatPrice(Math.max(...stockData.timePoints.map(p => p.price)))}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">最低:</span> 
                  <span className="ml-1 text-green-500 font-medium">
                    {formatPrice(Math.min(...stockData.timePoints.map(p => p.price)))}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">总量:</span> 
                  <span className="ml-1 font-medium">
                    {stockData.timePoints.reduce((sum, p) => sum + (p.volume || 0), 0) / 100000}万手
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">总额:</span> 
                  <span className="ml-1 font-medium">
                    {stockData.timePoints.reduce((sum, p) => sum + (p.amount || 0), 0) / 100000000}亿
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
          
        {/* 图表区域 */}
        <div className="w-full h-[400px] relative">
          {isLoading && !stockData ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <div ref={chartRef} className="w-full h-full" />
          )}
        </div>
        
        {/* 数据说明 */}
        <div className="mt-1 p-2 text-xs text-muted-foreground border-t">
          数据来源: 东方财富 · 分时图数据每分钟更新一次 · 交易时段 9:30-11:30, 13:00-15:00
        </div>
      </CardContent>
    </Card>
  );
} 