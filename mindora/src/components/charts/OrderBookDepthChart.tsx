"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import * as echarts from 'echarts';

interface OrderBookData {
  asks: Array<{ price: number; volume: number }>;
  bids: Array<{ price: number; volume: number }>;
}

interface OrderBookDepthChartProps {
  symbol: string;
  initialData?: OrderBookData;
  onRefresh?: () => void;
}

export default function OrderBookDepthChart({ 
  symbol, 
  initialData, 
  onRefresh 
}: OrderBookDepthChartProps) {
  const [orderBookData, setOrderBookData] = useState<OrderBookData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [depthLevel, setDepthLevel] = useState<string>("20"); // 默认显示20档深度
  const chartRef = useRef<HTMLDivElement>(null);
  
  // 获取盘口数据
  useEffect(() => {
    if (initialData) {
      setOrderBookData(initialData);
      return;
    }
    
    fetchOrderBookData();
  }, [symbol, initialData]);
  
  // 渲染图表
  useEffect(() => {
    if (!chartRef.current || !orderBookData || isLoading) return;
    
    const chart = echarts.init(chartRef.current);
    
    const option = generateChartOption(orderBookData, parseInt(depthLevel));
    chart.setOption(option);
    
    // 响应窗口大小变化
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [orderBookData, isLoading, depthLevel]);
  
  // 获取盘口数据函数
  const fetchOrderBookData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/finance/stock-quote?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error('获取盘口数据失败');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // 提取盘口数据
        const bids = [];
        const asks = [];
        
        // 处理买盘数据
        if (result.data.bid1Price) {
          bids.push({ price: result.data.bid1Price, volume: result.data.bid1Volume });
        }
        if (result.data.bid2Price) {
          bids.push({ price: result.data.bid2Price, volume: result.data.bid2Volume });
        }
        if (result.data.bid3Price) {
          bids.push({ price: result.data.bid3Price, volume: result.data.bid3Volume });
        }
        if (result.data.bid4Price) {
          bids.push({ price: result.data.bid4Price, volume: result.data.bid4Volume });
        }
        if (result.data.bid5Price) {
          bids.push({ price: result.data.bid5Price, volume: result.data.bid5Volume });
        }
        
        // 处理卖盘数据
        if (result.data.ask1Price) {
          asks.push({ price: result.data.ask1Price, volume: result.data.ask1Volume });
        }
        if (result.data.ask2Price) {
          asks.push({ price: result.data.ask2Price, volume: result.data.ask2Volume });
        }
        if (result.data.ask3Price) {
          asks.push({ price: result.data.ask3Price, volume: result.data.ask3Volume });
        }
        if (result.data.ask4Price) {
          asks.push({ price: result.data.ask4Price, volume: result.data.ask4Volume });
        }
        if (result.data.ask5Price) {
          asks.push({ price: result.data.ask5Price, volume: result.data.ask5Volume });
        }
        
        // 如果数据来自东方财富API，格式可能不同
        if (result.data.bids && result.data.asks) {
          setOrderBookData({
            bids: result.data.bids,
            asks: result.data.asks
          });
        } else {
          setOrderBookData({
            bids,
            asks
          });
        }
      } else {
        throw new Error(result.message || '无盘口数据返回');
      }
    } catch (err) {
      console.error('获取盘口数据出错:', err);
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
      fetchOrderBookData();
    }
  };
  
  // 生成图表配置
  const generateChartOption = (data: OrderBookData, depthLevel: number = 20) => {
    // 计算价格区间
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    // 限制显示的深度
    const limitedBids = data.bids.slice(0, depthLevel);
    const limitedAsks = data.asks.slice(0, depthLevel);
    
    // 找出最低和最高价格
    limitedBids.forEach(bid => {
      if (bid.price < minPrice) minPrice = bid.price;
    });
    
    limitedAsks.forEach(ask => {
      if (ask.price > maxPrice) maxPrice = ask.price;
    });
    
    // 计算价格间隔
    const priceSpread = maxPrice - minPrice;
    
    // 设置价格区间，稍微扩大一些以便更好地展示
    minPrice = minPrice - priceSpread * 0.1;
    maxPrice = maxPrice + priceSpread * 0.1;
    
    // 计算累计数量
    let bidCumulative: [number, number][] = [];
    let bidVolumeSum = 0;
    
    // 按价格排序（降序）
    const sortedBids = [...limitedBids].sort((a, b) => b.price - a.price);
    
    for (const bid of sortedBids) {
      bidVolumeSum += bid.volume;
      bidCumulative.push([bid.price, bidVolumeSum]);
    }
    
    let askCumulative: [number, number][] = [];
    let askVolumeSum = 0;
    
    // 按价格排序（升序）
    const sortedAsks = [...limitedAsks].sort((a, b) => a.price - b.price);
    
    for (const ask of sortedAsks) {
      askVolumeSum += ask.volume;
      askCumulative.push([ask.price, askVolumeSum]);
    }
    
    return {
      title: {
        text: '盘口深度图',
        left: 'center',
        top: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: function(params: any) {
          let result = `价格: ${params[0].data[0].toFixed(2)}<br/>`;
          if (params[0].seriesName === '买盘') {
            result += `累计买入量: ${params[0].data[1] / 100} 手`;
          } else {
            result += `累计卖出量: ${params[0].data[1] / 100} 手`;
          }
          return result;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '价格',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: '{value}'
        },
        min: minPrice,
        max: maxPrice
      },
      yAxis: {
        type: 'value',
        name: '累计数量',
        nameLocation: 'middle',
        nameGap: 40,
        axisLabel: {
          formatter: function(value: number) {
            return (value / 100).toFixed(0) + ' 手';
          }
        }
      },
      series: [
        {
          name: '买盘',
          type: 'line',
          step: 'end',
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: '#33aa33'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(51, 170, 51, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(51, 170, 51, 0.1)'
              }
            ])
          },
          data: bidCumulative
        },
        {
          name: '卖盘',
          type: 'line',
          step: 'start',
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: '#ff5050'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(255, 80, 80, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(255, 80, 80, 0.1)'
              }
            ])
          },
          data: askCumulative
        }
      ]
    };
  };
  
  // 处理深度级别变化
  const handleDepthLevelChange = (value: string) => {
    setDepthLevel(value);
  };
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>盘口深度图</CardTitle>
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
        <CardTitle>盘口深度图 - {symbol}</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={depthLevel} onValueChange={handleDepthLevelChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="深度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5档</SelectItem>
              <SelectItem value="10">10档</SelectItem>
              <SelectItem value="20">20档</SelectItem>
              <SelectItem value="50">50档</SelectItem>
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
        <div className="h-[400px] w-full">
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
  );
} 