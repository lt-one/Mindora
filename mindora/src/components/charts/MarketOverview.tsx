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
  
  // 生成备用模拟数据（在API数据加载失败时使用）
  const generateBackupData = (symbol: string, data: any) => {
    if (!data || !(data.price || data.currentPoint)) return [];
    
    // 获取价格和基准价
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
    
    // 生成模拟数据点
    const now = new Date();
    const baseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30);
    const points = [];
    
    // 使用简化的波动算法
    const volatility = 0.002;
    let lastValue = baseValue;
    
    // 生成上午时段数据
    for (let i = 0; i < 120; i++) {
      const time = new Date(baseTime.getTime() + i * 60000);
      
      // 11:30停盘
      if (time.getHours() === 11 && time.getMinutes() === 30) {
        break;
      }
      
      const random = (Math.random() - 0.5) * 2 * volatility;
      lastValue = lastValue * (1 + random);
      
      // 格式化时间
      const formattedTime = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      points.push([formattedTime, lastValue]);
    }
    
    // 生成下午时段数据
    baseTime.setHours(13, 0, 0);
    for (let i = 0; i < 120; i++) {
      const time = new Date(baseTime.getTime() + i * 60000);
      
      // 15:00收盘
      if (time.getHours() === 15 && time.getMinutes() === 0) {
        break;
      }
      
      const random = (Math.random() - 0.5) * 2 * volatility;
      lastValue = lastValue * (1 + random);
      
      // 格式化时间
      const formattedTime = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      points.push([formattedTime, lastValue]);
    }
    
    // 确保最后一个点是当前实际价格
    if (points.length > 0) {
      points[points.length - 1][1] = currentPrice;
    }
    
    return points;
  };
  
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
      
      // 使用真实API数据或备用模拟数据
      let points = [];
      const hasRealData = timeSeriesData[symbol] && timeSeriesData[symbol].length > 0;
      
      if (hasRealData) {
        // 使用真实分时数据
        for (const point of timeSeriesData[symbol]) {
          points.push([point.time, point.price]);
        }
      } else {
        // 使用备用模拟数据
        points = generateBackupData(symbol, data);
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
          symbol: 'circle',
          symbolSize: 6,
          data: [
            { 
              type: 'max', 
              name: '最高', 
              label: {
                show: false  // 隐藏标签，避免重叠
              }
            },
            { 
              type: 'min', 
              name: '最低', 
              label: {
                show: false  // 隐藏标签，避免重叠
              }
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
        bottom: '5%',
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
          bottom: 5,
          height: 20
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
    
    // 创建新的图表实例
    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current.setOption(chartOptions);
    
    // 添加视图切换动画效果
    chartInstance.current.setOption({
      animation: true,
      animationDuration: 500,
      animationEasing: 'cubicOut'
    });
    
    // 响应窗口大小变化
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
        
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
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始调整
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      window.removeEventListener('resize', handleResize);
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
    const width = 100;
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
      <div className="relative" style={{ height: `${height}px`, width: `${width}px` }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
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
          chartInstance.current?.dispatchAction({
            type: 'downplay',
            seriesName: indexName
          });
        });
        
        // 然后高亮选中的指数
        chartInstance.current.dispatchAction({
          type: 'highlight',
          seriesName: name
        });
        
        // 滚动到视图中间
        chartInstance.current.dispatchAction({
          type: 'showTip',
          seriesName: name,
          dataIndex: Math.floor((timeSeriesData[symbol]?.length || 0) / 2)
        });
      }
    }
  };
  
  // 渲染指数卡片
  const renderIndexCard = (symbol: string, data: any) => {
    if (!data) return null;
    
    const isUp = data.changePercent > 0;
    const name = indexNames[symbol as keyof typeof indexNames] || symbol;
    const color = indexColors[symbol as keyof typeof indexColors] || '#5470c6';
    
    // 判断是否为指数类型，并进行价格缩放处理
    const isIndex = symbol.startsWith('sh000') || symbol.startsWith('sz399');
    
    // 为每个指数定义缩放因子
    const scalingFactors: Record<string, number> = {
      'sh000001': 100, // 上证指数
      'sz399001': 1,   // 深证成指
      'sz399006': 1,   // 创业板指
      'sh000300': 1    // 沪深300
    };
    
    // 获取价格数据
    let price = data.price || data.currentPoint;
    let change = data.change;
    let changePercent = data.changePercent;
    
    // 对于指数数据，根据缩放因子进行处理
    if (isIndex) {
      const scalingFactor = scalingFactors[symbol] || 1;
      
      // 如果价格明显需要缩放（数据源未处理），进行缩放处理
      if (price > 1000 && scalingFactor > 1) {
        price = price / scalingFactor;
        change = change / scalingFactor;
      }
      
      // 检查涨跌幅是否也需要处理（有些数据源可能对百分比也进行了放大）
      if (Math.abs(changePercent) > 100 && scalingFactor > 1) {
        changePercent = changePercent / scalingFactor;
      }
      
      // 统一格式化，确保显示的值与其他位置一致
      price = Number(price.toFixed(2));
      change = Number(change.toFixed(2));
      changePercent = Number(changePercent.toFixed(2));
    }
    
    // 添加加载状态或错误指示
    const isLoading = loadingIndices.includes(symbol);
    const hasError = !!dataFetchErrors[symbol];
    const hasData = timeSeriesData[symbol] && timeSeriesData[symbol].length > 0;
    
    // 判断是否有迷你趋势图数据
    const hasSparklineData = hasData && timeSeriesData[symbol].length > 5;
    
    // 判断是否为激活状态
    const isActive = activeSymbol === symbol;
    
    // 获取更新时间的简化格式
    const updateTime = lastUpdated ? `更新: ${lastUpdated.substring(0, 5)}` : '';
    
    // 为卡片创建涨跌色的渐变背景
    const gradientStyle = {
      background: isUp 
        ? 'linear-gradient(to right, rgba(255, 80, 80, 0.05), rgba(255, 80, 80, 0.15))' 
        : 'linear-gradient(to right, rgba(0, 170, 0, 0.05), rgba(0, 170, 0, 0.15))'
    };
    
    return (
      <Card 
        key={symbol} 
        className={`transition-all overflow-hidden ${isActive ? 'ring-2 ring-primary ring-offset-1' : ''}`} 
        onClick={() => handleCardClick(symbol)}
      >
        <CardContent className="p-0">
          {/* 标题栏 */}
          <div className="px-3 py-2 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <div className="font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">{updateTime}</div>
            </div>
            <Badge variant={isUp ? "destructive" : "default"} className="h-5">
              {isUp ? <ArrowUpIcon className="h-3 w-3 mr-0.5" /> : <ArrowDownIcon className="h-3 w-3 mr-0.5" />}
              {formatChangePercent(changePercent)}
            </Badge>
          </div>
          
          {/* 主体内容 */}
          <div className="grid grid-cols-5 h-[70px]" style={gradientStyle}>
            {/* 左侧价格和涨跌信息 */}
            <div className="col-span-3 flex flex-col justify-center px-4 py-2">
              <div className="text-3xl font-bold" style={{ color: isUp ? '#f43f5e' : '#10b981' }}>
                {formatPrice(price)}
                {isLoading && <span className="text-xs ml-2 text-muted-foreground animate-pulse">加载中...</span>}
                {hasError && !hasData && <span className="text-xs ml-2 text-red-500">数据错误</span>}
              </div>
              <div className="flex gap-2 items-center mt-1">
                <span style={{ color: isUp ? '#f43f5e' : '#10b981' }}>
                  {formatChange(change)}
                </span>
                <span className="text-sm text-muted-foreground">
                  成交量: {(data.volume / 10000).toFixed(1)}万手
                </span>
              </div>
            </div>
            
            {/* 右侧趋势图 */}
            <div className="col-span-2 flex items-center justify-end pr-4">
              {hasSparklineData ? (
                <div className="h-[60px] w-[100px]">
                  {renderSparkline(symbol, 50)}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">暂无趋势数据</div>
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
                <div className="flex justify-between items-center">
                  <div className="font-semibold truncate mr-1" title={stock.name}>
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
                <div className="text-sm text-muted-foreground">
                  涨跌: {formatChange(stockData.change)} | 
                  成交量: {((stockData.volume || 0) / 10000).toFixed(2)}万手
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };
  
  if (error) {
    return <div className="text-center text-red-500 py-4">加载失败: {error}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        {/* 市场概览标题和工具栏 */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">市场概览</h2>
          <div className="flex items-center gap-3">
            {/* 视图切换按钮组 */}
            <div className="border rounded-md overflow-hidden flex">
              <button
                className={`px-3 py-1 text-sm transition-colors ${
                  viewType === 'percent' ? 'bg-primary text-white' : 'bg-background'
                }`}
                onClick={() => setViewType('percent')}
              >
                涨跌幅
              </button>
              <button
                className={`px-3 py-1 text-sm transition-colors ${
                  viewType === 'price' ? 'bg-primary text-white' : 'bg-background'
                }`}
                onClick={() => setViewType('price')}
              >
                价格
              </button>
            </div>
            
            {/* 刷新按钮 */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCwIcon 
                className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`}
              /> 
              刷新
            </Button>
            
            {/* 最后更新时间 */}
            <div className="text-sm text-muted-foreground flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {lastUpdated ? `${lastUpdated}` : ''}
            </div>
          </div>
        </div>
        
        {/* 刷新通知 */}
        {refreshNotice && (
          <div className="bg-primary-foreground text-primary px-3 py-2 rounded-md text-sm animate-fade-in">
            {refreshNotice}
          </div>
        )}
        
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
    </div>
  );
} 