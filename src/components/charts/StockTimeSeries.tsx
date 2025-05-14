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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    preClose: number;
    timePoints: TimeSeriesDataPoint[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  // 添加技术指标显示控制状态
  const [visibleIndicators, setVisibleIndicators] = useState({
    macd: true,
    dif: true,
    dea: true
  });
  
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  
  // MACD计算函数
  const calculateMACD = (prices: number[], shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
    // EMA计算函数
    const calculateEMA = (data: number[], period: number) => {
      const k = 2 / (period + 1);
      const emaData: number[] = [];
      
      // 第一个值就是简单平均
      let ema = data.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
      emaData.push(ema);
      
      // 计算剩余的EMA值
      for (let i = period; i < data.length; i++) {
        ema = (data[i] * k) + (ema * (1 - k));
        emaData.push(ema);
      }
      
      return emaData;
    };
    
    // 如果数据不足以计算MACD，返回空数组
    if (prices.length < longPeriod) {
      return {
        dif: [],
        dea: [],
        bar: []
      };
    }
    
    // 计算快速和慢速EMA
    const emaShort = calculateEMA(prices, shortPeriod);
    const emaLong = calculateEMA(prices, longPeriod);
    
    // 确保两个数组长度相同
    const startIndex = longPeriod - shortPeriod;
    const shortValues = emaShort.slice(startIndex);
    
    // 计算DIF (MACD Line) = 快速EMA - 慢速EMA
    const dif: number[] = [];
    for (let i = 0; i < shortValues.length; i++) {
      dif.push(shortValues[i] - emaLong[i]);
    }
    
    // 计算DEA (Signal Line) = DIF的9日EMA
    const dea = calculateEMA(dif, signalPeriod);
    
    // 计算MACD柱状图 (Histogram) = (DIF - DEA) * 2
    const bar: number[] = [];
    for (let i = signalPeriod - 1; i < dif.length; i++) {
      bar.push((dif[i] - dea[i - (signalPeriod - 1)]) * 2);
    }
    
    // 填充前面的空值，使结果数组长度与prices匹配
    const result = {
      dif: new Array(prices.length - dif.length).fill(null).concat(dif),
      dea: new Array(prices.length - dea.length).fill(null).concat(dea),
      bar: new Array(prices.length - bar.length).fill(null).concat(bar)
    };
    
    return result;
  };
  
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
    
    // 计算MACD数据，方便后续使用
    const macdData = calculateMACD(prices);
    
    // 为主图添加一些额外的空间以容纳MACD指标
    // MACD值通常较小，需要适当缩放以在主图中可见
    const macdScaleFactor = 50; // 缩放因子，调整MACD在主图中的显示比例
    
    // 将MACD值映射到价格值范围内
    const scaledDif = macdData.dif.map(val => val !== null ? preClose + (val * macdScaleFactor) : null);
    const scaledDea = macdData.dea.map(val => val !== null ? preClose + (val * macdScaleFactor) : null);
    const scaledBar = macdData.bar.map(val => val !== null ? preClose + (val * macdScaleFactor * 0.5) : null);
    
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
          left: '8%',      // 统一所有图表的左边界
          right: '5%',
          top: '5%',       // 第一个图表从顶部5%开始
          height: '30%'    // 第一个图表占30%高度
        },
        {
          left: '8%',      // 与第一个图表左边界对齐
          right: '5%',
          top: '40%',      // 第二个图表从40%处开始
          height: '25%'    // 成交量图表占25%高度
        },
        {
          left: '8%',      // 与前两个图表左边界对齐
          right: '5%',
          top: '70%',      // 第三个图表从70%处开始
          height: '25%',   // MACD图表也占25%高度
          bottom: '5%'     // 底部保留5%空间
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
        },
        {
          type: 'category',
          gridIndex: 2,
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
            fontSize: 10,
            margin: 4,
            showMaxLabel: true,
            showMinLabel: true
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
            return Math.floor(value.min * 0.998 * 100) / 100;
          },
          max: function(value: { max: number }) {
            return Math.ceil(value.max * 1.002 * 100) / 100;
          }
        },
        {
          type: 'value',
          gridIndex: 1,
          position: 'right',
          axisLine: { show: true, lineStyle: { color: '#999' } }, // 显示轴线
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
        },
        {
          type: 'value',
          gridIndex: 2,
          position: 'right',
          axisLine: { show: true, lineStyle: { color: '#999' } },
          axisLabel: {
            show: true,
            fontSize: 9,
            formatter: (value: number) => value.toFixed(2),
            margin: 4
          },
          splitNumber: 4,
          splitLine: { 
            show: true,
            lineStyle: {
              color: ['#eee'],
              type: 'dashed'
            }
          },
          // MACD y轴范围计算
          min: function(value: { min: number }) {
            const padding = Math.abs(value.min) * 0.1;
            return value.min - padding;
          },
          max: function(value: { max: number }) {
            const padding = Math.abs(value.max) * 0.1;
            return value.max + padding;
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1, 2], // 三个图表联动缩放
          start: 0,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          xAxisIndex: [0, 1, 2], // 三个图表联动缩放
          bottom: 0,
          height: 12,
          borderColor: 'transparent',
          fillerColor: 'rgba(211, 211, 211, 0.2)',
          handleSize: 15,
          showDetail: false
        }
      ],
      legend: [{
        data: ['价格', '均价', '昨收'],
        top: 0,
        left: 'center',
        textStyle: {
          fontSize: 12
        },
        selected: {
          '价格': true,
          '均价': true,
          '昨收': true
        }
      }, {
        data: ['MACD', 'DIF', 'DEA'],
        top: '68%', // 调整MACD图例位置，对应第三个图表的位置
        left: 'center',
        textStyle: {
          fontSize: 11
        },
        selected: {
          'MACD': visibleIndicators.macd,
          'DIF': visibleIndicators.dif,
          'DEA': visibleIndicators.dea
        },
        itemWidth: 12,
        itemHeight: 8
      }],
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
            symbolSize: 30, // 增大标记点尺寸
            itemStyle: {
              shadowBlur: 5,
              shadowColor: 'rgba(0,0,0,0.3)',
              borderColor: '#fff',
              borderWidth: 1.5
            },
            data: [
              { 
                type: 'max', 
                name: '最高价',
                itemStyle: { color: '#ff5050' },
                label: { 
                  formatter: (params: any) => {
                    // 格式化价格显示
                    return formatPrice(params.data.value);
                  },
                  fontSize: 11,
                  fontWeight: 'bold',
                  color: '#fff',
                  backgroundColor: '#ff5050',
                  padding: [3, 5],
                  borderRadius: 2,
                  position: 'top', // 将标签放在标记点上方
                  distance: 5,
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowBlur: 2
                }
              },
              { 
                type: 'min', 
                name: '最低价',
                itemStyle: { color: '#10b981' },
                label: { 
                  formatter: (params: any) => {
                    // 格式化价格显示
                    return formatPrice(params.data.value);
                  },
                  fontSize: 11,
                  fontWeight: 'bold',
                  color: '#fff',
                  backgroundColor: '#10b981',
                  padding: [3, 5],
                  borderRadius: 2,
                  position: 'bottom', // 将标签放在标记点下方
                  distance: 5,
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowBlur: 2
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
          lineStyle: {
            type: 'dashed',
            color: '#7393b3',
            width: 1
          },
          tooltip: {
            valueFormatter: (value: number) => formatPrice(value)
          },
          markPoint: {
            symbol: 'circle',
            symbolSize: 5,
            data: [
              {
                type: 'max',
                name: '最高均价',
                label: {
                  show: false
                }
              }
            ]
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
          barWidth: '80%',
          // 添加成交量标签
          markLine: {
            symbol: 'none',
            data: [],
            label: {
              show: true,
              position: 'start',
              formatter: '成交量',
              fontSize: 10,
              color: '#666',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: [2, 4]
            },
            lineStyle: {
              opacity: 0
            }
          }
        } : {},
        // 添加MACD指标系列
        visibleIndicators.macd ? {
          name: 'MACD',
          type: 'bar',
          xAxisIndex: 2, // 使用第三个图表区域
          yAxisIndex: 2, // 使用第三个图表区域
          data: calculateMACD(prices).bar,
          barWidth: '70%',
          itemStyle: {
            color: (params: any) => {
              return params.data >= 0 ? '#ff5050' : '#10b981';
            }
          }
        } : {},
        visibleIndicators.dif ? {
          name: 'DIF',
          type: 'line',
          xAxisIndex: 2, // 使用第三个图表区域
          yAxisIndex: 2, // 使用第三个图表区域
          data: calculateMACD(prices).dif,
          lineStyle: {
            color: '#f1c40f',
            width: 1.5
          },
          symbol: 'none',
          // 添加最后一个点的标签
          markPoint: {
            symbol: 'circle',
            symbolSize: 0, // 隐藏标记点，只显示标签
            data: [
              {
                coord: [times.length - 1, calculateMACD(prices).dif[calculateMACD(prices).dif.length - 1]],
                label: {
                  formatter: 'DIF',
                  color: '#f1c40f',
                  fontSize: 10,
                  position: 'right'
                }
              }
            ]
          }
        } : {},
        visibleIndicators.dea ? {
          name: 'DEA',
          type: 'line',
          xAxisIndex: 2, // 使用第三个图表区域
          yAxisIndex: 2, // 使用第三个图表区域
          data: calculateMACD(prices).dea,
          lineStyle: {
            color: '#8e44ad',
            width: 1.5
          },
          symbol: 'none',
          // 添加最后一个点的标签
          markPoint: {
            symbol: 'circle',
            symbolSize: 0, // 隐藏标记点，只显示标签
            data: [
              {
                coord: [times.length - 1, calculateMACD(prices).dea[calculateMACD(prices).dea.length - 1]],
                label: {
                  formatter: 'DEA',
                  color: '#8e44ad',
                  fontSize: 10,
                  position: 'right'
                }
              }
            ]
          }
        } : {},
        // 添加MACD区域标题
        {
          type: 'line', // 使用line类型但不显示线条
          name: 'MACD_Title',
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: [],
          markLine: {
            silent: true,
            symbol: 'none',
            data: [],
            label: {
              show: true,
              position: 'insideTopLeft',
              distance: [10, 5], // 微调位置
              formatter: 'MACD指标(12,26,9)',
              fontSize: 10,
              color: '#333',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: [3, 5],
              borderRadius: 3
            },
            lineStyle: { opacity: 0 }
          }
        }
      ].filter(series => Object.keys(series).length > 0) // 过滤掉空的系列
    };
    
    chartInstance.current.setOption(option);

    // 监听图例点击事件，实现技术指标的显示/隐藏
    chartInstance.current.on('legendselectchanged', function(params: any) {
      if (['MACD', 'DIF', 'DEA'].includes(params.name)) {
        setVisibleIndicators(prev => ({
          ...prev,
          [params.name.toLowerCase()]: params.selected[params.name]
        }));
      }
    });
    
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
  }, [stockData, isLoading, visibleIndicators]);
  
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
          <div className="flex flex-col items-center py-4">
            <div className="text-center text-red-500 mb-4">加载失败: {error}</div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchTimeSeriesData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? '加载中...' : '刷新重试'}
            </Button>
          </div>
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
        <div className="w-full h-[855px] relative"> 
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
        
        {/* 添加MACD指标控制按钮 - 使用图例样式 */}
        <div className="px-4 py-3 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs font-medium mb-2 sm:mb-0">技术指标:</div>
            <div className="flex flex-wrap gap-4">
              <div 
                className="flex items-center gap-1.5 cursor-pointer" 
                onClick={() => setVisibleIndicators(prev => ({ ...prev, macd: !prev.macd }))}
                title="MACD柱状图表示多空力量对比，红色柱代表多头占优，绿色柱代表空头占优"
              >
                <div className={`w-3 h-3 rounded-sm border ${visibleIndicators.macd ? 'bg-rose-500 border-rose-600' : 'bg-transparent border-gray-400'}`}></div>
                <span className={`text-xs ${visibleIndicators.macd ? 'text-rose-500 font-medium' : 'text-gray-500'}`}>MACD柱</span>
              </div>
              <div 
                className="flex items-center gap-1.5 cursor-pointer" 
                onClick={() => setVisibleIndicators(prev => ({ ...prev, dif: !prev.dif }))}
                title="DIF是快速线(12日与26日EMA的差值)，反应价格短期变化"
              >
                <div className={`w-3 h-3 rounded-sm border ${visibleIndicators.dif ? 'bg-yellow-400 border-yellow-500' : 'bg-transparent border-gray-400'}`} style={{backgroundColor: visibleIndicators.dif ? '#f1c40f' : 'transparent'}}></div>
                <span className={`text-xs ${visibleIndicators.dif ? 'font-medium' : 'text-gray-500'}`} style={{color: visibleIndicators.dif ? '#f1c40f' : ''}}>DIF线</span>
              </div>
              <div 
                className="flex items-center gap-1.5 cursor-pointer" 
                onClick={() => setVisibleIndicators(prev => ({ ...prev, dea: !prev.dea }))}
                title="DEA是慢速线(DIF的9日EMA)，反应价格中期趋势，DIF与DEA交叉常被视为买卖信号"
              >
                <div className={`w-3 h-3 rounded-sm border ${visibleIndicators.dea ? 'bg-purple-500 border-purple-600' : 'bg-transparent border-gray-400'}`} style={{backgroundColor: visibleIndicators.dea ? '#8e44ad' : 'transparent'}}></div>
                <span className={`text-xs ${visibleIndicators.dea ? 'font-medium' : 'text-gray-500'}`} style={{color: visibleIndicators.dea ? '#8e44ad' : ''}}>DEA线</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 数据说明 - 优化布局 */}
        <div className="p-3 text-xs border-t bg-slate-50 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="mb-2 sm:mb-0">数据来源: 东方财富</div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-3 gap-y-1 items-center">
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-rose-500"></span>
                <span>上涨</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>下跌</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-5 bg-rose-500"></span>
                <span>MACD红柱</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-5 bg-emerald-500"></span>
                <span>MACD绿柱</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-5" style={{backgroundColor: '#f1c40f'}}></span>
                <span>DIF线</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-5" style={{backgroundColor: '#8e44ad'}}></span>
                <span>DEA线</span>
              </div>
            </div>
          </div>
          <div className="mt-1 text-center text-muted-foreground">
            交易时段: 9:30-11:30, 13:00-15:00
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 