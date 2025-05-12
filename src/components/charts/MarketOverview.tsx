"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpIcon, ArrowDownIcon, RefreshCwIcon, ClockIcon } from 'lucide-react';
import * as echarts from 'echarts';
import { formatPrice, formatChange, formatChangePercent } from '@/lib/utils';
import { MAJOR_INDICES } from '@/lib/data/china-stock-api';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { RefreshCw } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 指数颜色映射
const indexColors = {
  'sh000001': '#ff7070', // 上证指数
  'sz399001': '#60acfc', // 深证成指
  'sz399006': '#32d3eb', // 创业板指
  'sh000300': '#feb64d'  // 沪深300
};

// 指数名称映射
const indexNames = {
  'sh000001': '上证指数',
  'sz399001': '深证成指',
  'sz399006': '创业板指',
  'sh000300': '沪深300'
};

export default function MarketOverview() {
  const [indicesData, setIndicesData] = useState<any>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<Record<string, any[]>>({});
  const [loadingIndices, setLoadingIndices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetchErrors, setDataFetchErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'price' | 'percent'>('percent'); // 默认使用百分比视图
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false); // 添加刷新状态
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null); // 添加刷新通知状态
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null); // 添加激活指数状态
  const [hotStocksData, setHotStocksData] = useState<any[]>([]); // 添加热门股票数据
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  
  // 获取单个指数的分时数据
  const fetchTimeSeriesData = async (symbol: string) => {
    if (loadingIndices.includes(symbol)) {
      return; // 避免重复加载
    }
    
    try {
      setLoadingIndices(prev => [...prev, symbol]);
      setDataFetchErrors(prev => ({ ...prev, [symbol]: '' }));
      
      const response = await fetch(`/api/finance/time-series?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error(`获取${symbol}分时数据失败`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && result.data.timePoints) {
        setTimeSeriesData(prev => ({
          ...prev,
          [symbol]: result.data.timePoints
        }));
      } else {
        throw new Error(result.message || '无分时数据返回');
      }
    } catch (err) {
      console.error(`获取${symbol}分时数据出错:`, err);
      setDataFetchErrors(prev => ({ 
        ...prev, 
        [symbol]: (err as Error).message 
      }));
    } finally {
      setLoadingIndices(prev => prev.filter(s => s !== symbol));
    }
  };
  
  // 获取市场指数数据
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 1. 获取市场概览数据
        const response = await fetch('/api/finance/market-overview');
        
        if (!response.ok) {
          throw new Error('获取市场数据失败');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setIndicesData(result.data.indices);
          
          // 设置热门股票数据
          if (result.data.hotStocks) {
            setHotStocksData(result.data.hotStocks);
          }
          
          // 2. 获取每个指数的分时数据
          const symbols = Object.keys(result.data.indices);
          symbols.forEach(symbol => {
            fetchTimeSeriesData(symbol);
          });
          
          setLastUpdated(new Date().toLocaleTimeString('zh-CN'));
        } else {
          throw new Error(result.message || '无数据返回');
        }
      } catch (err) {
        console.error('获取市场数据出错:', err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
    
    // 设置定时器，每60秒刷新一次数据
    const timer = setInterval(fetchAllData, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 手动刷新数据
  const refreshData = () => {
    if (isRefreshing || Object.keys(loadingIndices).length > 0) {
      return; // 避免重复刷新
    }
    
    setIsRefreshing(true);
    setRefreshNotice("数据刷新中...");
    
    if (indicesData) {
      const symbols = Object.keys(indicesData);
      const refreshPromises = symbols.map(symbol => fetchTimeSeriesData(symbol));
      
      // 等待所有数据刷新完成
      Promise.all(refreshPromises).finally(() => {
        const newTime = new Date().toLocaleTimeString('zh-CN');
        setLastUpdated(newTime);
        setIsRefreshing(false);
        setRefreshNotice("数据已更新");
        
        // 3秒后清除通知
        setTimeout(() => {
          setRefreshNotice(null);
        }, 3000);
      });
    } else {
      setIsRefreshing(false);
      setRefreshNotice("暂无数据可刷新");
      
      // 3秒后清除通知
      setTimeout(() => {
        setRefreshNotice(null);
      }, 3000);
    }
  };
  
  // 使用useMemo优化图表选项生成
  const chartOptions = useMemo(() => {
    if (!indicesData || isLoading) return null;
    
    const series: any[] = [];
    const legendData: string[] = [];
    // 获取所有时间点，用于x轴
    let allTimes: string[] = [];
    
    // 处理各指数数据
    Object.entries(indicesData).forEach(([symbol, data]: [string, any]) => {
      if (!data || !(data.price || data.currentPoint)) return;
      
      const name = indexNames[symbol as keyof typeof indexNames] || symbol;
      legendData.push(name);
      
      // 获取价格数据
      let currentPrice = data.price || data.currentPoint;
      const isIndex = symbol.startsWith('sh000') || symbol.startsWith('sz399');
      
      // 对于指数数据，如果价格数值异常大（超过1000），则进行缩放处理
      if (isIndex && currentPrice > 1000) {
        currentPrice = currentPrice / 100;
      }
      
      // 使用昨收价格作为基准，如果没有则使用当前价格
      let baseValue = data.yesterdayClose;
      if (isIndex && baseValue > 1000) {
        baseValue = baseValue / 100;
      }
      
      if (!baseValue) {
        baseValue = currentPrice;
      }
      
      // 使用真实API数据，如果没有则跳过
      let points = [];
      const hasRealData = timeSeriesData[symbol] && timeSeriesData[symbol].length > 0;
      
      if (hasRealData) {
        // 使用真实分时数据
        for (const point of timeSeriesData[symbol]) {
          points.push([point.time, point.price]);
        }
      } else {
        // 如果没有数据，使用空数组
        points = [];
        // 跳过当前循环
        return;
      }
      
      // 处理数据点，转换为百分比格式（相对于基准价格）
      const originalData = points.map(point => [point[0], point[1]]);
      const percentData = points.map(point => {
        const time = point[0];
        const price = point[1];
        const percent = ((price - baseValue) / baseValue) * 100;
        return [time, percent];
      });
      
      // 根据当前视图选择要显示的数据
      const displayData = viewType === 'price' ? originalData : percentData;
      
      // 判断是否为激活的指数
      const isActive = activeSymbol === symbol;
      
      // 配置系列
      series.push({
        name,
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        originalData: originalData, // 保存原始价格数据，用于tooltip
        itemStyle: {
          color: indexColors[symbol as keyof typeof indexColors] || '#5470c6'
        },
        lineStyle: {
          width: isActive ? 4 : (viewType === 'percent' ? 2.5 : 2), // 激活状态或百分比视图线条粗一点
          type: hasRealData ? 'solid' : 'dashed', // 如果是模拟数据则使用虚线
          shadowBlur: isActive ? 8 : 0,
          shadowColor: isActive ? indexColors[symbol as keyof typeof indexColors] || '#5470c6' : 'transparent'
        },
        emphasis: {
          focus: 'series',
          lineStyle: {
            width: 3
          }
        },
        // 只在特定条件下显示标记点，并禁用标签
        markPoint: viewType === 'percent' ? {
          symbol: 'pin',
          symbolSize: 25,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1.5,
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          },
          // 禁用标签显示
          label: {
            show: false
          },
          data: [
            { 
              type: 'max', 
              name: '最高',
              itemStyle: { color: '#ff5050' }
            },
            { 
              type: 'min', 
              name: '最低',
              itemStyle: { color: '#10b981' }
            }
          ]
        } : {},
        // 确保不显示数据点的标签
        label: {
          show: false
        },
        data: displayData
      });
      
      // 获取该指数的所有时间点
      if (displayData && displayData.length > 0) {
        allTimes = [...allTimes, ...displayData.map(point => point[0])];
      }
    });
    
    // 去重并排序时间点
    allTimes = [...new Set(allTimes)].sort((a, b) => {
      // 将时间字符串转换为分钟数进行比较
      const getMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      return getMinutes(a) - getMinutes(b);
    });
    
    // 配置图表选项
    const option = {
      title: {
        text: viewType === 'percent' ? '指数涨跌幅对比' : '指数价格走势',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333'
        },
        left: 'center',
        top: 5
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: function(params: any) {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            const value = param.value[1];
            const seriesIndex = param.seriesIndex;
            const seriesData = series[seriesIndex];
            result += `${param.marker} ${param.seriesName}: `;
            
            if (viewType === 'percent') {
              // 百分比视图：显示百分比和对应的价格
              result += `${value.toFixed(2)}%`;
              
              // 查找对应的原始价格
              if (seriesData && seriesData.originalData) {
                const dataIndex = param.dataIndex;
                const originalPrice = seriesData.originalData[dataIndex][1];
                result += ` (${originalPrice.toFixed(2)})`;
              }
            } else {
              // 价格视图：显示价格和对应的百分比
              result += `${value.toFixed(2)}`;
              
              // 计算对应的百分比变化（相对于基准价格）
              if (seriesData && seriesData.originalData) {
                const basePrice = seriesData.originalData[0][1];
                const percentChange = ((value - basePrice) / basePrice) * 100;
                result += ` (${percentChange.toFixed(2)}%)`;
              }
            }
            result += '<br/>';
          });
          return result;
        }
      },
      legend: {
        data: legendData,
        textStyle: {
          fontSize: 12
        },
        selectedMode: 'multiple',
        itemGap: 12,
        icon: 'roundRect',
        itemHeight: 10,
        itemWidth: 12
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',  // 减少底部空白区域
        top: '20%',
        containLabel: true
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        },
        right: 20,
        top: 5
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          bottom: 2,  // 上移dataZoom控件
          height: 15  // 减小高度
        }
      ],
      xAxis: {
        type: 'category',
        data: allTimes, // 使用allTimes替代timePoints
        axisLabel: {
          fontSize: 10,
          color: '#666',
          formatter: function(value: string) {
            // 强调特定时间点
            if (['09:30', '10:30', '11:30', '14:00', '15:00'].includes(value)) {
              return `{a|${value}}`;
            }
            return value;
          },
          rich: {
            a: {
              color: '#e74c3c',
              fontWeight: 'bold'
            }
          }
        },
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#f5f5f5'],
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLine: { show: false },
        axisLabel: {
          formatter: function(value: number) {
            // 优化格式化逻辑，使标签更简洁
            if (viewType === 'percent') {
              if (value === 0) return '0';
              // 小数点后只保留一位，减少空间占用
              return value.toFixed(1) + '%';
            }
            return value.toFixed(1);
          },
          color: '#666',
          margin: 10, // 增加与轴的距离
          hideOverlap: true // 隐藏重叠的标签
        },
        splitLine: {
          lineStyle: { color: '#eee' }
        },
        // 在百分比模式下添加0线
        markLine: viewType === 'percent' ? {
          symbol: ['none', 'none'],
          data: [
            { 
              yAxis: 0, 
              lineStyle: { 
                color: '#999', 
                type: 'dashed'
              },
              label: {
                show: true,
                formatter: '0%',
                position: 'end'
              }
            }
          ]
        } : {}
      },
      series
    };
    
    return option;
  }, [indicesData, viewType, isLoading, timeSeriesData, activeSymbol]);
  
  // 初始化图表
  useEffect(() => {
    if (!chartRef.current || !indicesData || isLoading || !chartOptions) return;
    
    // 清理旧的图表实例
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }
    
    // 获取容器的实际尺寸
    const container = chartRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // 创建新的图表实例，指定精确尺寸
    chartInstance.current = echarts.init(container, null, {
      width: containerWidth,
      height: containerHeight,
      devicePixelRatio: window.devicePixelRatio
    });
    
    // 应用图表选项
    chartInstance.current.setOption(chartOptions);
    
    // 添加视图切换动画效果
    chartInstance.current.setOption({
      animation: true,
      animationDuration: 500,
      animationEasing: 'cubicOut'
    });
    
    // 响应窗口大小变化和缩放变化
    const handleResize = () => {
      if (!chartInstance.current || !chartRef.current) return;
      
      // 重新获取容器尺寸
      const container = chartRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // 调整图表尺寸
      chartInstance.current.resize({
        width: width,
        height: height
      });
      
      // 根据窗口宽度调整布局
      const smallScreen = window.innerWidth < 640;
      if (smallScreen) {
        // 小屏幕布局调整
        chartInstance.current.setOption({
          legend: {
            orient: 'horizontal',
            right: 'center',
            top: 30,
            itemGap: 8,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
              fontSize: 10
            }
          },
          grid: {
            top: 70 // 为图例留更多空间
          }
        });
      } else {
        // 大屏幕布局调整
        chartInstance.current.setOption({
          legend: {
            orient: 'horizontal',
            right: 'center',
            top: 30,
            itemGap: 20,
            textStyle: {
              fontSize: 12
            }
          },
          grid: {
            top: 60
          }
        });
      }
    };
    
    // 添加事件监听
    window.addEventListener('resize', handleResize);
    
    // 特别为CSS transform缩放情况添加MutationObserver
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || mutation.attributeName === 'class')
        ) {
          // 延迟执行以确保DOM变化已完成
          setTimeout(handleResize, 50);
          break;
        }
      }
    });
    
    // 监视body元素的style和class变化，可能影响transform
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });
    
    // 初始调整
    handleResize();
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [chartOptions, indicesData, isLoading]);
  
  // 渲染迷你趋势图
  const renderSparkline = (symbol: string, height: number = 30) => {
    const data = timeSeriesData[symbol];
    
    // 如果没有数据，返回空
    if (!data || data.length === 0) return null;
    
    // 准备绘制数据
    const prices = data.map(point => point.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    // 计算基准价格，比较第一个价格和昨收价格
    const firstPrice = prices[0];
    const basePrice = indicesData[symbol]?.yesterdayClose || firstPrice;
    
    // 判断整体涨跌
    const lastPrice = prices[prices.length - 1];
    const isUp = lastPrice >= basePrice;
    
    // 生成SVG路径
    const width = 120;
    const range = max - min || 1; // 防止除以0
    
    // 计算点
    const points = prices.map((price, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - ((price - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    // 生成填充区域路径
    const areaPath = `M 0,${height} L ${points} L ${width},${height} Z`;
    
    // 生成SVG路径
    const path = `M ${points}`;
    
    return (
      <div className="relative w-full">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* 填充区域 */}
          <path 
            d={areaPath} 
            fill={isUp ? "rgba(255, 80, 80, 0.1)" : "rgba(0, 170, 0, 0.1)"} 
          />
          
          {/* 基准线 */}
          <line 
            x1="0" 
            y1={height - ((basePrice - min) / range) * height} 
            x2={width} 
            y2={height - ((basePrice - min) / range) * height} 
            stroke="#999" 
            strokeWidth="0.5" 
            strokeDasharray="2,2" 
          />
          
          {/* 趋势线 */}
          <path 
            d={path} 
            fill="none" 
            stroke={isUp ? "#f43f5e" : "#10b981"} 
            strokeWidth="1.5" 
          />
        </svg>
      </div>
    );
  };
  
  // 处理卡片点击，高亮对应指数
  const handleCardClick = (symbol: string) => {
    // 如果点击的是当前已激活的指数，则取消激活
    if (activeSymbol === symbol) {
      setActiveSymbol(null);
    } else {
      setActiveSymbol(symbol);
    }
    
    // 如果图表实例存在，可以直接触发高亮效果
    if (chartInstance.current) {
      // 获取指数对应的名称
      const name = indexNames[symbol as keyof typeof indexNames] || symbol;
      
      // 使用dispatchAction触发高亮
      if (activeSymbol === symbol) {
        // 取消高亮
        chartInstance.current.dispatchAction({
          type: 'downplay',
          seriesName: name
        });
      } else {
        // 先重置所有高亮
        MAJOR_INDICES.forEach(index => {
          const indexName = indexNames[index.symbol as keyof typeof indexNames] || index.symbol;
          chartInstance.current!.dispatchAction({
            type: 'downplay',
            seriesName: indexName
          });
        });
        
        // 然后高亮选中的指数
        chartInstance.current.dispatchAction({
          type: 'highlight',
          seriesName: name
        });
        
        // 滚动图表到视野中
        const chartElement = chartRef.current;
        if (chartElement) {
          chartElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  };
  
  // 渲染指数卡片
  const renderIndexCard = (symbol: string, data: any) => {
    if (!data) return null;
    
    const isUp = data.changePercent > 0;
    const isDown = data.changePercent < 0;
    const isZero = data.changePercent === 0;
    
    // 获取对应的时间序列数据
    const hasSparklineData = timeSeriesData[symbol] && timeSeriesData[symbol].length > 0;
    
    // 卡片是否处于激活状态
    const isActive = activeSymbol === symbol;
    
    // 判断是否有加载错误
    const hasError = dataFetchErrors[symbol];
    
    // 获取指数名称
    const name = indexNames[symbol as keyof typeof indexNames] || data.name || symbol;
    
    // 优化成交量格式化显示
    let volumeDisplay = '';
    if (data.volume !== undefined) {
      const volume = parseFloat(data.volume);
      // 根据数值大小选择合适的单位
      if (volume >= 100000000) {
        volumeDisplay = (volume / 100000000).toFixed(2) + '亿手';
      } else if (volume >= 10000) {
        volumeDisplay = (volume / 10000).toFixed(2) + '万手';
      } else {
        volumeDisplay = volume.toString() + '手';
      }
    }
    
    return (
      <Card 
        key={symbol}
        className={`
          transition-all duration-300 ease-in-out relative
          ${isActive ? 'ring-2 shadow-lg' : 'hover:shadow-md cursor-pointer'}
        `}
        style={{
          borderColor: isActive ? (indexColors[symbol as keyof typeof indexColors] || '#333') : '',
          borderWidth: isActive ? '1px' : '',
        }}
        onClick={() => handleCardClick(symbol)}
      >
        {/* 右上角百分比标签 */}
        <div 
          className={`absolute top-2 right-2 py-1 px-2 rounded text-xs font-medium flex items-center gap-1 z-10
            ${isUp ? 'bg-rose-100 text-rose-600' : 
              isDown ? 'bg-emerald-100 text-emerald-600' : 
              'bg-gray-100 text-gray-600'}`}
        >
          {isUp ? <ArrowUpIcon className="h-3 w-3" /> : 
           isDown ? <ArrowDownIcon className="h-3 w-3" /> : null}
          {formatChangePercent(data.changePercent)}
        </div>
        
        <CardContent className="p-4">
          <div className="flex flex-col">
            {/* 上部分：指数信息和数据 */}
            <div className="mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-start justify-between">
                {/* 左侧信息 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-6 rounded-sm" 
                      style={{ 
                        backgroundColor: indexColors[symbol as keyof typeof indexColors] || '#5470c6' 
                      }}
                    ></div>
                    <div className="font-medium text-sm md:text-base truncate max-w-[150px]">{name}</div>
                  </div>
                  
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${isUp ? 'text-rose-500' : isDown ? 'text-emerald-500' : 'text-gray-600'}`}>
                      {formatPrice(data.price || data.currentPoint)}
                    </span>
                    <span 
                      className={`${
                        isUp ? 'text-rose-500' : 
                        isDown ? 'text-emerald-500' : 
                        'text-gray-500'
                      }`}
                    >
                      {formatChange(data.change)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 成交量信息 */}
              <div className="flex items-center mt-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  成交量: {volumeDisplay}
                </span>
              </div>
            </div>
            
            {/* 下部分：走势图（完全分离） */}
            <div className="pt-1 h-[60px] flex items-center justify-center">
              {hasSparklineData ? (
                <div className="h-[50px] w-[90%] max-w-[150px]">
                  {renderSparkline(symbol, 40)}
                </div>
              ) : hasError ? (
                <div className="text-xs text-muted-foreground">
                  {hasError.length > 20 ? '加载失败' : hasError}
                </div>
              ) : loadingIndices.includes(symbol) ? (
                <Skeleton className="h-[40px] w-[80px]" />
              ) : (
                <div className="text-xs text-muted-foreground">暂无趋势数据</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // 渲染热门股票列表
  const renderHotStocksList = () => {
    if (!hotStocksData || hotStocksData.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          暂无热门股票数据
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {hotStocksData.map((stock, index) => {
          if (!stock.data) return null;
          
          const stockData = stock.data;
          const isUp = stockData.changePercent > 0;
          const color = isUp ? '#f43f5e' : '#10b981';
          
          return (
            <Card key={index} className="border-l-4" style={{ borderLeftColor: color }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="font-semibold break-words max-w-[70%] min-h-[40px]">
                    {stock.name}
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant={isUp ? "destructive" : "default"} className="h-5">
                      {isUp ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                      {formatChangePercent(stockData.changePercent)}
                    </Badge>
                  </div>
                </div>
                <div className="text-2xl font-bold mt-2 mb-1">
                  {formatPrice(stockData.price || stockData.currentPoint)}
                </div>
                <div className="text-sm text-muted-foreground flex flex-wrap items-center">
                  <span className="inline-flex items-center mr-2">
                    涨跌: {formatChange(stockData.change)}
                  </span>
                  <span className="inline-flex items-center whitespace-nowrap">
                    成交量: {((stockData.volume || 0) / 10000).toFixed(2)}万手
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };
  
  // 添加市场统计计算函数
  const calculateMarketStats = () => {
    if (!indicesData || !hotStocksData) {
      return {
        upCount: 0,
        downCount: 0,
        upPercent: 50,
        totalVolume: 0,
        totalAmount: 0,
        sentiment: 50  // 保留sentiment属性，但基于真实数据计算
      };
    }
    
    // 计算涨跌家数
    let upCount = 0;
    let downCount = 0;
    let totalVolume = 0;
    let totalAmount = 0; // 添加累计成交额
    
    // 分析热门股票
    hotStocksData.forEach(stock => {
      if (stock.data && stock.data.changePercent) {
        if (stock.data.changePercent > 0) {
          upCount++;
        } else if (stock.data.changePercent < 0) {
          downCount++;
        }
        
        // 累计成交量
        if (stock.data.volume) {
          totalVolume += stock.data.volume;
        }
        
        // 累计成交额
        if (stock.data.amount) {
          totalAmount += stock.data.amount;
        }
      }
    });
    
    // 累计指数成交额
    Object.values(indicesData).forEach((data: any) => {
      if (data && data.amount) {
        totalAmount += data.amount;
      }
    });
    
    // 计算涨跌比例
    const total = upCount + downCount || 1; // 防止除以0
    const upPercent = Math.round((upCount / total) * 100);
    
    // 计算市场情绪指数 (0-100)，这里基于真实涨跌数据
    // 涨跌比>70%视为乐观，<30%视为悲观，其他为中性
    const sentiment = Math.min(100, Math.max(0, upPercent));
    
    return {
      upCount,
      downCount,
      upPercent,
      totalVolume,
      totalAmount,
      sentiment
    };
  };
  
  // 更改成交量比较函数
  const renderAmountInfo = () => {
    return <span className="flex items-center text-muted-foreground">当日累计交易</span>;
  };
  
  if (error) {
    return <div className="text-center text-red-500 py-4">加载失败: {error}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 ">
        {/* 市场概览标题和工具栏 */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <div >
            <h3 className="text-2xl font-bold mt-3"  >市场概览</h3>
            <p className="text-sm text-muted-foreground ">主要指数和市场状态</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 视图切换按钮组 - 移到右侧 */}
            <Tabs
              defaultValue={viewType}
              value={viewType}
              onValueChange={(value) => {
                if (value === 'percent' || value === 'price') {
                  setViewType(value);
                }
              }}
              className="w-auto"
            >
              <TabsList className="h-8 bg-muted/50" >
                <TabsTrigger 
                  value="percent" 
                  className="px-2 h-7 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  涨跌幅
                </TabsTrigger>
                <TabsTrigger 
                  value="price" 
                  className="px-2 h-7 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  价格
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* 刷新按钮 */}
            <Button
              variant="outline"
              size="icon"
              disabled={isRefreshing}
              onClick={refreshData}
              className="h-8 w-8"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              <span className="sr-only">刷新数据</span>
            </Button>
          </div>
        </div>
        
        {/* 刷新通知 */}
        {refreshNotice && (
          <div className="bg-primary-foreground text-primary px-3 py-2 rounded-md text-sm animate-fade-in">
            {refreshNotice}
          </div>
        )}
        
        {/* 指数选择Tabs - 横向滚动容器 */}
        <div className="relative">
          <div className="overflow-x-auto pb-2 -mx-1 px-1">
            <Tabs
              defaultValue={activeSymbol || MAJOR_INDICES[0].symbol}
              value={activeSymbol || undefined}
              onValueChange={(value) => {
                if (value) {
                  setActiveSymbol(value);
                  handleCardClick(value);
                }
              }}
              className="w-full"
            >
              <TabsList className="h-8 inline-flex w-auto bg-muted/50">
                {MAJOR_INDICES.map(index => (
                  <TabsTrigger
                    key={index.symbol}
                    value={index.symbol}
                    className="px-2 h-7 text-xs whitespace-nowrap data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:shadow-sm"
                  >
                    {index.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* 图表容器 */}
        <div className="h-[300px] w-full rounded-lg border relative shadow-sm">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            <>
              <div ref={chartRef} className="h-full w-full" />
              {/* 数据源标识 */}
              <div className="absolute bottom-2 right-3 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded-sm">
                数据来源: 东方财富
                {(loadingIndices.length > 0 || isRefreshing) && 
                  <span className="ml-2 text-primary animate-pulse">加载中...</span>
                }
              </div>
            </>
          )}
        </div>
        
        {/* 指数卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[110px] rounded-lg" />
              <Skeleton className="h-[110px] rounded-lg" />
              <Skeleton className="h-[110px] rounded-lg" />
              <Skeleton className="h-[110px] rounded-lg" />
            </>
          ) : indicesData ? (
            Object.entries(indicesData).map(([symbol, data]: [string, any]) => 
              renderIndexCard(symbol, data)
            )
          ) : (
            <div className="col-span-4 text-center py-4">无数据</div>
          )}
        </div>
      </div>
      
      {/* 热门股票区域 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">热门股票</h3>
          <div className="text-sm text-muted-foreground">
            跟踪市场热门个股表现
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[100px] rounded-lg" />
            ))}
          </div>
        ) : (
          renderHotStocksList()
        )}
      </div>
      
      {/* 添加市场状态指标面板 */}
      <Card className="mt-4">
        <CardContent className="p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium">市场状态指标</h3>
            <Badge variant="outline" className="font-normal">
              <ClockIcon className="h-3 w-3 mr-1" /> {lastUpdated}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 涨跌对比指标 */}
            <div className="border rounded-md p-2 bg-card relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">涨跌比</span>
                {!isLoading && indicesData && (
                  <div className="flex text-xs gap-1">
                    <span className="text-rose-500">↑ {calculateMarketStats().upCount}</span>
                    <span>/</span>
                    <span className="text-emerald-500">↓ {calculateMarketStats().downCount}</span>
                  </div>
                )}
              </div>
              {!isLoading && indicesData && (
                <div className="h-2 w-full bg-muted mt-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full" 
                    style={{ 
                      width: `${calculateMarketStats().upPercent}%` 
                    }} 
                  />
                </div>
              )}
              <div className="text-xs mt-1 text-muted-foreground">
                {!isLoading && indicesData && (
                  <span>上涨占比: {calculateMarketStats().upPercent}%</span>
                )}
              </div>
            </div>
            
            {/* 市场活跃度指标 - 替代累计成交额 */}
            <div className="border rounded-md p-2 bg-card">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">市场活跃度</span>
                {!isLoading && indicesData && hotStocksData && (
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium
                    ${calculateMarketStats().totalAmount > 10000000000000 ? 'bg-rose-100 text-rose-600' : 
                    calculateMarketStats().totalAmount > 5000000000000 ? 'bg-amber-100 text-amber-600' : 
                    'bg-emerald-100 text-emerald-600'}`}>
                    {calculateMarketStats().totalAmount > 10000000000000 ? '活跃' : 
                    calculateMarketStats().totalAmount > 5000000000000 ? '正常' : '低迷'}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  成交总额: 
                </span>
                <span className="text-xs font-medium">
                  {!isLoading && indicesData && (
                    calculateMarketStats().totalAmount > 0 
                      ? `${(calculateMarketStats().totalAmount / 100000000).toFixed(0)}亿` 
                      : '无数据'
                  )}
                </span>
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                {new Date().toLocaleDateString('zh-CN')} 
              </div>
            </div>
            
            {/* 行业板块指标 - 保留现有的 */}
            <div className="border rounded-md p-2 bg-card">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">强势行业</span>
              </div>
              {!isLoading && (
                <div className="text-xs grid grid-cols-2 gap-1">
                  <Badge variant="outline" className="justify-between">
                    <span>金融</span>
                    <span className="text-rose-500">+1.2%</span>
                  </Badge>
                  <Badge variant="outline" className="justify-between">
                    <span>科技</span>
                    <span className="text-rose-500">+0.8%</span>
                  </Badge>
                </div>
              )}
              <div className="text-xs mt-1 text-muted-foreground">
                最大涨幅板块
              </div>
            </div>
            
            {/* 大盘状态指标 - 替代市场情绪 */}
            <div className="border rounded-md p-2 bg-card relative">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">大盘状态</span>
                {!isLoading && indicesData && (
                  <Badge 
                    variant={indicesData.sh000001?.changePercent > 0 ? "destructive" : 
                            indicesData.sh000001?.changePercent < 0 ? "default" : "outline"}
                    className="text-xs px-1.5"
                  >
                    {indicesData.sh000001?.changePercent > 1 ? "强势上涨" : 
                     indicesData.sh000001?.changePercent > 0 ? "小幅上涨" : 
                     indicesData.sh000001?.changePercent > -1 ? "小幅下跌" : "明显下跌"}
                  </Badge>
                )}
              </div>
              {!isLoading && indicesData && indicesData.sh000001 && (
                <div className="mt-1 flex flex-col">
                  <div className="flex justify-between text-xs">
                    <span>上证指数:</span>
                    <span className={indicesData.sh000001.changePercent >= 0 ? 'text-rose-500' : 'text-emerald-500'}>
                      {formatPrice(indicesData.sh000001.price)} ({indicesData.sh000001.changePercent > 0 ? '+' : ''}{indicesData.sh000001.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-0.5">
                    <span>深证成指:</span>
                    <span className={indicesData.sz399001?.changePercent >= 0 ? 'text-rose-500' : 'text-emerald-500'}>
                      {indicesData.sz399001 ? 
                        `${formatPrice(indicesData.sz399001.price)} (${indicesData.sz399001.changePercent > 0 ? '+' : ''}${indicesData.sz399001.changePercent.toFixed(2)}%)` : 
                        '无数据'}
                    </span>
                  </div>
                </div>
              )}
              {!isLoading && indicesData && (
                <div className="h-2 w-full bg-muted mt-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      calculateMarketStats().sentiment > 60 ? "bg-rose-500" : 
                      calculateMarketStats().sentiment < 40 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ 
                      width: `${calculateMarketStats().sentiment}%` 
                    }} 
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 