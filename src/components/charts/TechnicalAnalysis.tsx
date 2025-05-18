"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import { LineChart, BarChart, CandlestickChart } from 'echarts/charts';
import { 
  TitleComponent, TooltipComponent, GridComponent, 
  DataZoomComponent, VisualMapComponent, MarkLineComponent,
  MarkPointComponent, LegendComponent 
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { HelpCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { HOT_STOCKS } from '@/lib/data/china-stock-api';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 颜色设置
const colors = {
  upColor: '#ff5555', // 上涨颜色
  downColor: '#33aa33', // 下跌颜色
  volColor: '#8ecaee', // 成交量颜色
  ma5Color: '#ffbf66', // MA5线颜色
  ma10Color: '#ff70f0', // MA10线颜色
  ma20Color: '#5555ff', // MA20线颜色
  ma30Color: '#68e0e0', // MA30线颜色
  primary: '#9F44D3', // 主要颜色
  neutralColor: '#999999' // 中性颜色
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
  const [period, setPeriod] = useState('20'); // 默认为20日周期，适用于所有指标
  const [indicator, setIndicator] = useState('K线');
  const [klineData, setKlineData] = useState<any[] | null>(null);
  const [technicalData, setTechnicalData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChartInfoVisible, setIsChartInfoVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [forceRefresh, setForceRefresh] = useState(false);
  
  // 当指标变化时使用默认周期
  useEffect(() => {
    // 所有指标使用相同的默认周期
    setPeriod('20'); 
  }, [indicator]);
  
  // 获取K线数据
  useEffect(() => {
    fetchKlineData();
  }, [stockSymbol, period]);
  
  // 获取技术指标数据
  useEffect(() => {
    fetchTechnicalData();
  }, [stockSymbol, indicator, period]);
  
  // 处理图表渲染
  useEffect(() => {
    if (!chartRef.current || !klineData || klineData.length === 0 || isLoading) return;
    
    try {
    renderChart();
    } catch (err) {
      console.error('渲染图表出错:', err);
      setError('图表渲染失败，请尝试刷新或选择其他股票/指标');
    }
  }, [klineData, technicalData, indicator, isLoading, period]);
  
  // 添加一个响应窗口大小变化的处理函数，用于重绘图表
  useEffect(() => {
    const handleWindowResize = () => {
      // 检查图表是否已初始化
      if (chartRef.current && !isLoading && klineData) {
        try {
          // 重新渲染图表以适应新窗口大小
          renderChart();
        } catch (err) {
          console.error('调整窗口大小时重新渲染图表出错:', err);
        }
      }
    };
    
    // 添加节流函数以限制重绘频率
    let resizeTimer: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleWindowResize, 200);
    };
    
    // 监听resize事件
    window.addEventListener('resize', throttledResize);
    
    // 清理事件监听
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimer);
    };
  }, [klineData, isLoading, indicator]);
  
  // 处理股票选择变化
  const handleStockChange = (value: string) => {
    const selectedStock = HOT_STOCKS.find(stock => stock.symbol === value);
    if (selectedStock) {
      // 在开始获取新数据前先设置加载状态
      setIsLoading(true);
      setStockSymbol(selectedStock.symbol);
      setStockName(selectedStock.name);
    }
  };
  
  // 获取K线数据
  const fetchKlineData = async () => {
    try {
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
      setError(null);
      setIsLoading(true);
      
      // 判断当前技术指标类型
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
        default:
          indicatorType = '';
      }
      
      // 如果没有选择任何指标，则不发送请求
      if (!indicatorType) {
        setTechnicalData(null);
        setIsLoading(false);
        return;
      }
      
      // 构建URL，添加forceRefresh参数
      const url = `/api/finance/technical-indicators?symbol=${stockSymbol}&indicator=${indicatorType}${
        period ? `&period=${period}` : ''
      }&forceRefresh=${forceRefresh === true ? 'true' : 'false'}`;
      
      const response = await fetch(url);
      
      // 请求完成后重置强制刷新标志
      setForceRefresh(false);
      
      if (!response.ok) {
        throw new Error('获取技术指标数据失败');
      }
      
      const result = await response.json();
      
      // 添加日志输出，用于调试
      console.log(`获取${indicator}指标数据成功:`, result);
      
      if (result.success && result.data) {
        // 验证数据格式是否正确
        if (indicator === 'MACD') {
          // 调整MACD数据格式，解决API返回结构与组件期望结构不匹配的问题
          console.log('原始MACD数据格式:', result.data);
          
          // 检查数据格式，如果是旧格式（直接返回values数组）
          if (Array.isArray(result.data.values)) {
            // 重新映射数据结构
            const mappedData = {
              values: {
                dif: result.data.values.map((item: any) => item.macd),
                dea: result.data.values.map((item: any) => item.signal),
                macd: result.data.values.map((item: any) => item.histogram * 2) // MACD柱状值通常是DIF-DEA的两倍
              }
            };
            console.log('已调整MACD数据格式:', mappedData);
            setTechnicalData(mappedData);
          } else if (!result.data.values || !result.data.values.dif || !result.data.values.dea || !result.data.values.macd || 
            !Array.isArray(result.data.values.dif) || !Array.isArray(result.data.values.dea) || !Array.isArray(result.data.values.macd)) {
          console.warn('MACD数据格式不完整:', result.data);
          // 提供空数据结构而不是抛出错误，避免应用崩溃
          setTechnicalData({
            values: { 
              dif: [], 
              dea: [], 
              macd: [] 
            }
          });
        } else {
        setTechnicalData(result.data);
        }
        } else if (indicator === 'RSI') {
          // 处理RSI数据
          if (result.data && result.data.values) {
            // 转换API返回的数据格式
            let rsiData: number[] = [];
            const avgGains: number[] = [];
            const avgLosses: number[] = [];
            
            // 检查数据是否为数组格式或对象数组格式
            if (Array.isArray(result.data.values)) {
              if (typeof result.data.values[0] === 'object') {
                // 如果是对象数组格式，提取rsi, avgGain和avgLoss值
                result.data.values.forEach((item: any) => {
                  if (typeof item.rsi === 'number' && !isNaN(item.rsi)) {
                    rsiData.push(item.rsi);
      } else {
                    rsiData.push(0); // 使用0代替null
                  }
                  
                  if (typeof item.avgGain === 'number' && !isNaN(item.avgGain)) {
                    avgGains.push(item.avgGain * 100); // 乘以100，使其与RSI值比例一致
                  } else {
                    avgGains.push(0); // 使用0代替null
                  }
                  
                  if (typeof item.avgLoss === 'number' && !isNaN(item.avgLoss)) {
                    avgLosses.push(item.avgLoss * 100); // 乘以100，使其与RSI值比例一致
                  } else {
                    avgLosses.push(0); // 使用0代替null
                  }
                });
              } else {
                // 如果是数值数组格式，只提取RSI值
                rsiData = result.data.values
                  .filter((val: any) => typeof val === 'number' && !isNaN(val));
              }
            } else {
              console.warn('RSI data is not in expected format:', result.data.values);
              rsiData = [];
            }
            
            // 转换为组件期望的格式
            const processedData = {
              ...result.data,
              values: rsiData,
              avgGains: avgGains.length > 0 ? avgGains : undefined,
              avgLosses: avgLosses.length > 0 ? avgLosses : undefined
            };
            
            console.log('处理后的RSI数据:', processedData);
            setTechnicalData(processedData);
          }
        } else {
          setTechnicalData(result.data);
        }
      }
    } catch (err) {
      console.error('获取技术指标数据出错:', err);
      setError((err as Error).message);
      // 设置空数据结构，确保组件不会因为没有数据而崩溃
      setTechnicalData(indicator === 'MACD' ? { values: { dif: [], dea: [], macd: [] } } : { values: [] });
    } finally {
      // 确保在任何情况下都将加载状态设置为false
      setIsLoading(false);
    }
  };
  
  // 渲染图表
  const renderChart = () => {
    if (!chartRef.current || !klineData || klineData.length === 0) return;
    
    // 确保删除旧的图表实例
    let chart = echarts.getInstanceByDom(chartRef.current);
    if (chart) {
      chart.dispose();
    }
    
    // 创建新图表实例
    chart = echarts.init(chartRef.current);
    
    // 检查technicalData是否有效
    const hasTechnicalData = technicalData && 
                             technicalData?.values && 
                             (indicator !== 'MACD' || 
                              (technicalData?.values?.dif && Array.isArray(technicalData?.values?.dif) && 
                               technicalData?.values?.dea && Array.isArray(technicalData?.values?.dea) && 
                               technicalData?.values?.macd && Array.isArray(technicalData?.values?.macd)));
    
    // 过滤掉未来日期的数据
    const currentDate = new Date();
    // 格式化为YYYY-MM-DD以避免时区问题
    const currentDateString = currentDate.toISOString().split('T')[0];
    
    const filteredKlineData = klineData.filter(item => {
      // 移除时间部分，只比较日期部分，避免时区问题
      const itemDateString = item.date.split(' ')[0];
      return itemDateString <= currentDateString;
    });
    
    // 准备K线数据
    const dates = filteredKlineData.map(item => item.date);
    const data = filteredKlineData.map(item => [item.open, item.close, item.low, item.high]);
    const volumes = filteredKlineData.map(item => item.volume);
    
    // 准备技术指标数据
    let indicatorSeries: any[] = [];
    
    if (technicalData) {
      // 计算移动平均线 - 不管选择什么指标，都计算并添加MA均线
      const ma5Data = calculateMA(5, filteredKlineData);
      const ma10Data = calculateMA(10, filteredKlineData);
      const ma20Data = calculateMA(20, filteredKlineData);
      const ma30Data = calculateMA(30, filteredKlineData);
      
      // 添加MA均线
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
      
      // 根据当前选择的指标添加额外的技术指标数据
      switch (indicator) {
        case 'MA':
          // 仅显示MA均线，无需额外操作
          break;
          
        case 'MACD':
          if (hasTechnicalData) {
            const difData = technicalData?.values?.dif;
            const deaData = technicalData?.values?.dea;
            const macdData = technicalData?.values?.macd;
            
            // 检查MACD数据是否有效
            if (difData && Array.isArray(difData) && difData.length > 0 && 
                deaData && Array.isArray(deaData) && deaData.length > 0 && 
                macdData && Array.isArray(macdData) && macdData.length > 0) {
              // 使用完整的MACD数据系列替换默认的MA系列
              indicatorSeries = [
              {
                name: 'DIF',
                type: 'line',
                data: difData,
                  symbol: 'pin',
                  symbolSize: function(value: any, params: any) {
                    // 根据窗口大小和值的大小调整标记点大小
                    const val = params.data.value || 0;
                    // 获取当前窗口宽度用于响应式调整
                    const screenWidth = window.innerWidth;
                    // 小屏幕使用较小的基础尺寸
                    const baseSize = screenWidth < 768 ? 24 : 36;
                    const scale = Math.min(1.5, 1 + Math.abs(val) / 40);
                    return baseSize * scale;
                  },
                  showSymbol: false,
                  itemStyle: {
                    color: '#9F44D3',
                    borderWidth: 2,
                    borderColor: '#fff',
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    shadowBlur: 8
                  },
                lineStyle: {
                  color: '#9F44D3',
                  width: 1.5
                },
                label: {
                  show: false // 禁用DIF线的标签显示
                },
                  markLine: {
                    silent: true,
                    symbol: ['none', 'circle'],
                    symbolSize: [0, 8],
                    data: (() => {
                      // 生成金叉和死叉标记
                      const crossData = [];
                      if (difData && deaData && difData.length > 1 && difData.length === deaData.length) {
                        for (let i = 1; i < difData.length; i++) {
                          // 金叉：DIF从下方穿过DEA
                          if (difData[i-1] < deaData[i-1] && difData[i] > deaData[i]) {
                            crossData.push([
                              {
                                name: '金叉',
                                xAxis: i,
                                yAxis: difData[i],
                                lineStyle: {
                                  color: colors.upColor,
                                  width: 1.5,
                                  type: 'solid'
                                },
                                label: {
                                  show: true,
                                  position: 'end',
                                  formatter: '金叉',
                                  color: colors.upColor,
                                  fontSize: 12,
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  padding: [2, 4],
                                  borderRadius: 2
                                }
                              },
                              {
                                xAxis: i,
                                yAxis: difData[i]
                              }
                            ]);
                          }
                          // 死叉：DIF从上方穿过DEA
                          else if (difData[i-1] > deaData[i-1] && difData[i] < deaData[i]) {
                            crossData.push([
                              {
                                name: '死叉',
                                xAxis: i,
                                yAxis: difData[i],
                                lineStyle: {
                                  color: colors.downColor,
                                  width: 1.5,
                                  type: 'solid'
                                },
                                label: {
                                  show: true,
                                  position: 'end',
                                  formatter: '死叉',
                                  color: colors.downColor,
                                  fontSize: 12,
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  padding: [2, 4],
                                  borderRadius: 2
                                }
                              },
                              {
                                xAxis: i,
                                yAxis: difData[i]
                              }
                            ]);
                          }
                        }
                      }
                      return crossData;
                    })()
                  }
              },
              {
                name: 'DEA',
                type: 'line',
                data: deaData,
                  symbol: 'pin',
                  symbolSize: function(value: any, params: any) {
                    // 根据窗口大小和值的大小调整标记点大小
                    const val = params.data.value || 0;
                    // 获取当前窗口宽度用于响应式调整
                    const screenWidth = window.innerWidth;
                    // 小屏幕使用较小的基础尺寸
                    const baseSize = screenWidth < 768 ? 24 : 36;
                    const scale = Math.min(1.5, 1 + Math.abs(val) / 40);
                    return baseSize * scale;
                  },
                  showSymbol: false,
                  itemStyle: {
                    color: '#EE6666',
                    borderWidth: 2,
                    borderColor: '#fff',
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    shadowBlur: 8
                  },
                lineStyle: {
                  color: '#EE6666',
                  width: 1.5
                },
                label: {
                  show: false // 禁用DEA线的标签显示
                },
                  markLine: {
                    silent: true,
                    symbol: ['none', 'circle'],
                    symbolSize: [0, 8],
                    data: (() => {
                      // 生成金叉和死叉标记
                      const crossData = [];
                      if (difData && deaData && difData.length > 1 && difData.length === deaData.length) {
                        for (let i = 1; i < difData.length; i++) {
                          // 金叉：DIF从下方穿过DEA
                          if (difData[i-1] < deaData[i-1] && difData[i] > deaData[i]) {
                            crossData.push([
                              {
                                name: '金叉',
                                xAxis: i,
                                yAxis: difData[i],
                                lineStyle: {
                                  color: colors.upColor,
                                  width: 1.5,
                                  type: 'solid'
                                },
                                label: {
                                  show: true,
                                  position: 'end',
                                  formatter: '金叉',
                                  color: colors.upColor,
                                  fontSize: 12,
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  padding: [2, 4],
                                  borderRadius: 2
                                }
                              },
                              {
                                xAxis: i,
                                yAxis: difData[i]
                              }
                            ]);
                          }
                          // 死叉：DIF从上方穿过DEA
                          else if (difData[i-1] > deaData[i-1] && difData[i] < deaData[i]) {
                            crossData.push([
                              {
                                name: '死叉',
                                xAxis: i,
                                yAxis: difData[i],
                                lineStyle: {
                                  color: colors.downColor,
                                  width: 1.5,
                                  type: 'solid'
                                },
                                label: {
                                  show: true,
                                  position: 'end',
                                  formatter: '死叉',
                                  color: colors.downColor,
                                  fontSize: 12,
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  padding: [2, 4],
                                  borderRadius: 2
                                }
                              },
                              {
                                xAxis: i,
                                yAxis: difData[i]
                              }
                            ]);
                          }
                        }
                      }
                      return crossData;
                    })()
                  }
              },
              {
                name: 'MACD',
                type: 'bar',
                  data: (technicalData && technicalData.values && Array.isArray(technicalData.values.macd) ? 
                        technicalData.values.macd.map((val: number) => {
                          if (typeof val !== 'number' || isNaN(val)) return 0;
                          return parseFloat(val.toFixed(2));
                        }) : 
                        []),
                barWidth: '70%',
                barCategoryGap: '10%',
                  clipOverflow: true,
                itemStyle: {
                  color: function(params: any) {
                      const value = params.data;
                      // 修改颜色逻辑：正值为红色，负值为绿色
                      return value >= 0 ? colors.upColor : colors.downColor;
                    }
                  },
                  label: {
                    show: false, // 禁用标签显示，移除所有趋势标签
                    position: 'outside',
                    distance: 15,
                    formatter: function(params: any) {
                      const value = params.data;
                      if (value === undefined || value === null) return '';
                      
                      // 确保标签位于有效数据范围内
                      if (params.dataIndex < 0 || params.dataIndex >= dates.length) return '';
                      
                      // 获取屏幕宽度用于响应式调整
                      const screenWidth = window.innerWidth;
                      
                      // 小屏幕时减少显示的标签数量
                      if (screenWidth < 500) {
                        // 只显示最近的一个点和极值点
                        if (params.dataIndex === dates.length - 1) {
                          return typeof value === 'number' ? value.toFixed(2) : '0.00';
                        }
                        
                        // 显示极大值点(绝对值超过30)
                        if (Math.abs(value) > 30) {
                          return typeof value === 'number' ? value.toFixed(2) : '0.00';
                        }
                        
                        return '';
                      }
                      
                      // 中等屏幕减少一些标签
                      if (screenWidth < 768) {
                        // 显示最近两个点
                        if (params.dataIndex >= dates.length - 2) {
                          return typeof value === 'number' ? value.toFixed(2) : '0.00';
                        }
                        
                        // 绝对值较大的点
                        const threshold = 25; 
                        if (Math.abs(value) > threshold) {
                          return typeof value === 'number' ? value.toFixed(2) : '0.00';
                        }
                        
                        // 重要转折点
                        if (params.dataIndex > 0 && params.dataIndex < dates.length - 1) {
                          // 添加安全检查，确保context和series存在
                          if (!params.context || !params.context.series || !params.context.series.data) {
                            return '';
                          }
                          
                          const prevValue = params.context.series.data[params.dataIndex - 1];
                          const nextValue = params.context.series.data[params.dataIndex + 1];
                          
                          // 添加额外的空值检查
                          if (prevValue !== undefined && nextValue !== undefined) {
                            if ((prevValue * value < 0) || (value * nextValue < 0)) {
                              return typeof value === 'number' ? value.toFixed(2) : '0.00';
                            }
                          }
                        }
                        
                        return '';
                      }
                      
                      // 大屏幕显示更多标签
                      // 1. 最近3个数据点
                      if (params.dataIndex >= dates.length - 3) {
                        return typeof value === 'number' ? value.toFixed(2) : '0.00';
                      }
                      
                      // 2. 绝对值特别大的点
                      const threshold = 20;
                      if (Math.abs(value) > threshold) {
                        return typeof value === 'number' ? value.toFixed(2) : '0.00';
                      }
                      
                      // 3. 转折点显示值 (值变号的点)
                      if (params.dataIndex > 0 && params.dataIndex < dates.length - 1) {
                        // 添加安全检查，确保context和series存在
                        if (!params.context || !params.context.series || !params.context.series.data) {
                          return '';
                        }
                        
                        const prevValue = params.context.series.data[params.dataIndex - 1];
                        const nextValue = params.context.series.data[params.dataIndex + 1];
                        
                        // 添加额外的空值检查
                        if (prevValue !== undefined && nextValue !== undefined) {
                          if ((prevValue * value < 0) || (value * nextValue < 0)) {
                            return typeof value === 'number' ? value.toFixed(2) : '0.00';
                          }
                        }
                      }
                      
                      return '';
                    },
                    fontSize: window.innerWidth < 768 ? 10 : 12,
                    color: function(params: any) {
                      const value = params.data;
                      return value >= 0 ? colors.upColor : colors.downColor;
                    },
                    backgroundColor: 'transparent',
                    padding: [2, 4],
                    borderRadius: 3,
                    fontWeight: 'bold',
                    align: 'center',
                    overflow: 'truncate'
                  }
                }
              ];
            }
          }
          break;
          
        case 'RSI':
          if (technicalData && technicalData.values) {
            let rsiData: number[] = [];
            
            if (Array.isArray(technicalData.values)) {
              rsiData = technicalData.values
                .filter((val: any) => typeof val === 'number' && !isNaN(val));
            }
            
            // 获取平均涨幅和平均跌幅数据
            let avgGains: number[] = [];
            let avgLosses: number[] = [];
            
            if (technicalData.avgGains && Array.isArray(technicalData.avgGains)) {
              avgGains = technicalData.avgGains.filter((val: any) => val !== null && val !== undefined);
            }
            
            if (technicalData.avgLosses && Array.isArray(technicalData.avgLosses)) {
              avgLosses = technicalData.avgLosses.filter((val: any) => val !== null && val !== undefined);
            }
            
            // 只有当数据有效时才添加RSI指标系列
            if (rsiData.length > 0) {
              // 清空之前的指标系列，不显示MA均线
              indicatorSeries = [
                {
                name: 'RSI',
                type: 'line',
                data: rsiData,
                  symbol: 'circle',  // 改为圆圈，更易辨识
                  symbolSize: 3,     // 减小符号大小
                  showSymbol: false, // 关闭默认标记点，只在重要点显示
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
                  // 添加面积渐变效果
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
                    { 
                      name: '超卖区 (30)',
                      yAxis: 30, 
                      lineStyle: { color: 'green', type: 'dashed', width: 1.5 } 
                    },
                    { 
                      name: '中性区 (50)',
                      yAxis: 50, 
                      lineStyle: { color: '#666', type: 'dashed', width: 1.5 } 
                    },
                    { 
                      name: '超买区 (70)',
                      yAxis: 70, 
                      lineStyle: { color: 'red', type: 'dashed', width: 1.5 } 
                    }
                  ]
                },
                markPoint: {
                  symbol: 'pin',
                  symbolSize: 36,
                  symbolOffset: [0, 0], // 重置偏移量
                  itemStyle: {
                      color: colors.primary,
                    borderColor: '#fff',
                    borderWidth: 2,
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 8
                  },
                  data: [
                    {
                      type: 'max',
                      name: 'Max',
                      itemStyle: { color: colors.upColor },
                      label: {
                        formatter: function(params: any) {
                          const value = params.data && params.data.value;
                            return 'RSI最高: ' + (typeof value === 'number' ? value.toFixed(1) : '0.0');
                        },
                        color: '#fff',
                        fontSize: 12,
                        backgroundColor: 'rgba(255, 85, 85, 0.9)',
                        padding: [3, 5],
                        borderRadius: 3,
                        distance: 10,
                        align: 'center',
                          verticalAlign: 'middle'
                      }
                    },
                    {
                      type: 'min',
                      name: 'Min',
                      itemStyle: { color: colors.downColor },
                      label: {
                        formatter: function(params: any) {
                          const value = params.data && params.data.value;
                            return 'RSI最低: ' + (typeof value === 'number' ? value.toFixed(1) : '0.0');
                        },
                        color: '#fff',
                        fontSize: 12,
                        backgroundColor: 'rgba(51, 170, 51, 0.9)',
                        padding: [3, 5],
                        borderRadius: 3,
                        distance: 10,
                        align: 'center',
                          verticalAlign: 'middle'
                      }
                    },
                    {
                      // 当前值点
                      name: 'Current',
                        coord: [
                              dates.length - 1, 
                          typeof rsiData[rsiData.length - 1] === 'number' && 
                          rsiData[rsiData.length - 1] !== null
                            ? rsiData[rsiData.length - 1]
                                : 50 // 如果RSI值无效，使用默认值50
                        ],
                      symbol: 'circle',
                      symbolSize: 8,
                        itemStyle: { color: colors.primary },
                      label: {
                          show: true,
                        formatter: function(params: any) {
                          const value = params.data && params.data.value;
                            if (typeof value !== 'number' || value === null) return '';
                            return 'RSI: ' + value.toFixed(1);
                        },
                        color: '#fff',
                        backgroundColor: 'rgba(159, 68, 211, 0.9)',
                        padding: [4, 6],
                        borderRadius: 3,
                        fontSize: 13,
                        position: 'right',
                        distance: 15,
                        align: 'center',
                        emphasis: {
                          show: true
                        }
                      }
                    }
                  ]
                }
                }
              ];
              
              // 添加平均涨幅线（如果有数据）
              if (avgGains && avgGains.length > 0) {
                indicatorSeries.push({
                  name: '平均涨幅',
                  type: 'line',
                  data: avgGains,
                  symbol: 'none',
                  sampling: 'average',
                  lineStyle: {
                    color: colors.upColor,
                    width: 1.5,
                    type: 'dashed'
                  },
                  itemStyle: {
                    color: colors.upColor
                  }
                });
              }
              
              // 添加平均跌幅线（如果有数据）
              if (avgLosses && avgLosses.length > 0) {
                indicatorSeries.push({
                  name: '平均跌幅',
                  type: 'line',
                  data: avgLosses,
                  symbol: 'none',
                  sampling: 'average',
                  lineStyle: {
                    color: colors.downColor,
                    width: 1.5,
                    type: 'dashed'
                  },
                  itemStyle: {
                    color: colors.downColor
                  }
                });
              }
            }
          }
          break;
          
        default:
          // 默认情况下不添加额外的技术指标数据
          break;
      }
    }
    
    // 配置图表选项
    const option: any = {
      title: {
        text: `${stockName} (${stockSymbol}) - ${indicator === 'MA' ? getDisplayPeriod(period) : indicator}`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333'
        },
        padding: [5, 10, 15, 10], // 上右下左padding
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 4,
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        // 移除副标题
        subtext: ''
      },
      // 添加数据截止说明到左上角
      graphic: filteredKlineData.length > 0 ? [
        {
          type: 'text',
          left: 10,
          top: 10,
          style: {
            text: `数据截至: ${filteredKlineData[filteredKlineData.length - 1].date}`,
            fontSize: 12,
            fill: '#666',
            opacity: 0.8
          }
        }
      ] : [],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#999',
            width: 1,
            type: 'dashed'
          }
        },
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#555',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        formatter: function(params: any) {
          if (!Array.isArray(params)) {
            params = [params];
          }
          
          // 获取日期
          const date = params[0].name;
          let tooltipContent = `<div style="text-align:center;font-weight:bold;margin-bottom:5px;">${date}</div>`;
          
          if (indicator === 'RSI') {
            // RSI指标的提示信息
            for (let i = 0; i < params.length; i++) {
              const param = params[i];
              
              // 对于RSI值
              if (param.seriesName === 'RSI') {
                const rsiValue = param.value;
                
                // 确保RSI值有效
                if (rsiValue === null || rsiValue === undefined) {
                  tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;">
                    <span>${param.marker} <span style="color:${colors.primary};font-weight:bold;">RSI:</span></span>
                    <span style="font-weight:bold;">--</span>
                  </div>`;
                  continue;
                }
                
                const rsiColor = rsiValue >= 70 ? colors.upColor : 
                                (rsiValue <= 30 ? colors.downColor : colors.primary);
                
                let rsiStatus = '中性';
                if (rsiValue >= 70) rsiStatus = '超买';
                else if (rsiValue <= 30) rsiStatus = '超卖';
                
                tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;">
                  <span>${param.marker} <span style="color:${rsiColor};font-weight:bold;">RSI:</span></span>
                  <span style="font-weight:bold;">${rsiValue.toFixed(2)} (${rsiStatus})</span>
                </div>`;
              }
              
              // 对于平均涨幅
              if (param.seriesName === '平均涨幅') {
                // 显示原始值（除以100）并添加百分号
                const originalValue = (param.value !== null && param.value !== undefined) ? 
                  (param.value / 100).toFixed(2) : '0.00';
                tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;">
                  <span>${param.marker} <span style="color:${colors.upColor};font-weight:bold;">平均涨幅:</span></span>
                  <span style="font-weight:bold;">${originalValue}%</span>
                </div>`;
              }
              
              // 对于平均跌幅
              if (param.seriesName === '平均跌幅') {
                // 显示原始值（除以100）并添加百分号
                const originalValue = (param.value !== null && param.value !== undefined) ? 
                  (param.value / 100).toFixed(2) : '0.00';
                tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;">
                  <span>${param.marker} <span style="color:${colors.downColor};font-weight:bold;">平均跌幅:</span></span>
                  <span style="font-weight:bold;">${originalValue}%</span>
                </div>`;
              }
            }
            
            // 计算RS值
            const gainParam = params.find((p: any) => p.seriesName === '平均涨幅');
            const lossParam = params.find((p: any) => p.seriesName === '平均跌幅');
            
            if (gainParam && lossParam && 
                gainParam.value !== null && gainParam.value !== undefined && 
                lossParam.value !== null && lossParam.value !== undefined && lossParam.value > 0) {
              // 使用原始值计算RS比率（乘以100的值相除结果不变，所以不需要额外处理）
              const rs = gainParam.value / lossParam.value;
              tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;">
                <span><span style="color:#999;font-weight:bold;">RS比率:</span></span>
                <span style="font-weight:bold;">${rs.toFixed(2)}</span>
              </div>`;
            }
            
            return tooltipContent;
          }
          
          // 非RSI指标的提示信息
          // 检查是否有K线数据，如果有，优先显示K线数据的详细信息
          const klineParam = params.find((param: any) => param.seriesName === 'K线');
          const volumeParam = params.find((param: any) => param.seriesName === '成交量');
          
          if (klineParam && indicator !== 'MACD') {
            // 获取完整的K线数据
            const dataIndex = klineParam.dataIndex;
            if (dataIndex >= 0 && dataIndex < filteredKlineData.length) {
              const item = filteredKlineData[dataIndex];
              const open = item.open.toFixed(2);
              const close = item.close.toFixed(2);
              const high = item.high.toFixed(2);
              const low = item.low.toFixed(2);
              const volume = item.volume;
              const change = (item.close - item.open).toFixed(2);
              const changePercent = ((item.close - item.open) / item.open * 100).toFixed(2);
              
              const isUp = item.close >= item.open;
              const priceColor = isUp ? colors.upColor : colors.downColor;
              const volColor = volumeParam ? volumeParam.color : '#8ecaee';
              
              // 使用纵向排列方式显示K线数据
              tooltipContent += `
                <div style="padding:3px 0; border-bottom:1px solid #555; margin-bottom:5px;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="color:${priceColor}; font-weight:bold;">开盘价:</span>
                    <span style="color:${priceColor}; font-weight:bold;">${open}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="color:${priceColor}; font-weight:bold;">收盘价:</span>
                    <span style="color:${priceColor}; font-weight:bold;">${close}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="color:${priceColor};">最高价:</span>
                    <span style="color:${priceColor};">${high}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="color:${priceColor};">最低价:</span>
                    <span style="color:${priceColor};">${low}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="color:${priceColor};">涨跌额:</span>
                    <span style="color:${priceColor};">${change}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="color:${priceColor};">涨跌幅:</span>
                    <span style="color:${priceColor};">${changePercent}%</span>
                  </div>
                </div>
              `;
            }
          }
          
          // 显示其他指标
          params.forEach((param: any) => {
            // 跳过K线和成交量，因为已经在上面单独处理过了
            if (param.seriesName === 'K线' || param.seriesName === '成交量') {
              return;
            }
              
            const value = param.data;
            if (value !== null && value !== '-') {
              // 根据指标类型使用不同颜色
              const color = param.color;
              let prefix = '';
              
              // 为MACD值添加趋势指示
              if (param.seriesName === 'MACD') {
                prefix = value >= 0 ? '↑ ' : '↓ ';
              }
              
              tooltipContent += `<div style="display:flex;justify-content:space-between;padding:3px 0;">
                <span>${param.marker} <span style="color:${color};font-weight:bold;">${param.seriesName}</span>:</span>
                <span style="font-weight:bold;">${prefix}${typeof value === 'number' ? value.toFixed(2) : value}</span>
              </div>`;
            }
          });
          
          return tooltipContent;
        }
      },
      legend: {
        show: true,
        data: indicator === 'MACD' ? ['MACD', 'DIF', 'DEA'] : 
             (indicator === 'RSI' ? ['RSI', '平均涨幅', '平均跌幅'] : 
             ['K线', '成交量', 'MA5', 'MA10', 'MA20', 'MA30']),
        selected: indicator === 'RSI' 
          ? { 'RSI': true, '平均涨幅': true, '平均跌幅': true }
          : {},
        top: 0,
        right: 30
      },
      grid: [
        // 主图表
        {
          left: '10%',
          right: '5%',
          top: '5%',
          height: indicator === 'MACD' || indicator === 'RSI' || indicator === 'MA' ? '85%' : '60%', // 在MACD,RSI或MA指标时调整主图表高度
          containLabel: true
        },
        // 成交量图表，只有在非MACD、非RSI、非MA模式下才显示
        ...(indicator !== 'MACD' && indicator !== 'RSI' && indicator !== 'MA' ? [{
          left: '10%',
          right: '5%',
          top: '70%',
          height: '25%',
          containLabel: true
        }] : [])
      ],
      xAxis: [
        // 主图X轴
        {
          type: 'category',
          data: dates,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#999' } },
          axisTick: { 
            show: true,
            length: 4,
            inside: true,
            lineStyle: { color: '#999' }
          },
          splitLine: { show: false },
          axisLabel: { show: true },
          min: 'dataMin',
          // 设置最大值为最后一个有效日期，防止显示未来日期
          max: function() {
            if (dates && dates.length > 0) {
              return dates[dates.length - 1];
            }
            return 'dataMax';
          }
        },
        // 成交量图X轴，只有在非MACD、非RSI、非MA模式下才显示
        ...(indicator !== 'MACD' && indicator !== 'RSI' && indicator !== 'MA' ? [{
          type: 'category',
          gridIndex: 1,
          data: dates,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#999' } },
          axisTick: { 
            show: true, 
            length: 4,
            inside: true,
            lineStyle: { color: '#999' }
          },
          splitLine: { show: false },
          axisLabel: { show: true },
          min: 'dataMin',
          // 设置最大值为最后一个有效日期，防止显示未来日期
          max: function() {
            if (dates && dates.length > 0) {
              return dates[dates.length - 1];
            }
            return 'dataMax';
          }
        }] : [])
      ],
      yAxis: [
        // 主图Y轴
        {
          type: 'value', // 始终使用value类型
          min: indicator === 'RSI' ? 0 : null, // null表示自动计算
          max: indicator === 'RSI' ? 100 : null, // null表示自动计算
          interval: indicator === 'RSI' ? 10 : null, // null表示自动计算
          scale: indicator !== 'RSI',
          splitNumber: indicator === 'RSI' ? 10 : 5,
          axisLabel: { 
            show: true,
            inside: false,
            margin: 16,
            formatter: function(value: number) {
              if (indicator === 'RSI') {
                return typeof value === 'number' ? value.toFixed(0) : '0';
              }
              return typeof value === 'number' ? value.toFixed(2) : '0.00';
            }
          },
          axisLine: { 
            show: true,
            lineStyle: { color: '#999' } 
          },
          axisTick: { 
            show: true, 
            length: 4,
            inside: true,
            lineStyle: { color: '#999' }
          },
          splitLine: { 
            show: true, 
            lineStyle: { 
              color: '#f5f5f5',
              opacity: 0.6
            } 
          },
          splitArea: indicator === 'RSI' ? {
            show: true,
            areaStyle: {
              // 为RSI的不同区域添加背景色
              color: [
                'rgba(86, 228, 86, 0.05)', // 0-30 超卖区，浅绿色
                'rgba(250, 250, 250, 0.05)', // 30-70 正常区域，浅灰色
                'rgba(228, 86, 86, 0.05)'  // 70-100 超买区，浅红色
              ]
            }
          } : undefined
        },
        // 只有在非MACD、非RSI和非MA模式下才添加成交量Y轴
        ...(indicator !== 'MACD' && indicator !== 'RSI' && indicator !== 'MA' ? [{
          gridIndex: 1,
          splitNumber: 3,
          axisLine: { 
            show: true,
            lineStyle: { color: '#999' } 
          },
          axisTick: { 
            show: true, 
            length: 4,
            inside: true,
            lineStyle: { color: '#999' }
          },
          axisLabel: { 
            show: true,
            margin: 8
          },
          splitLine: { show: false }
        }] : []),
        // 只在RSI模式下添加右侧百分比Y轴
        ...(indicator === 'RSI' ? [{
          name: '百分比',
          nameLocation: 'end',
          nameTextStyle: {
            color: '#666',
            fontWeight: 'bold'
          },
          type: 'value',
          position: 'right',
          min: 0,
          max: 'dataMax',
          axisLabel: {
            formatter: '{value}%'
          },
          splitLine: {
            show: false
          }
        }] : [])
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0],
          rangeMode: ['value', 'percent'], // 改为value和percent模式
          minSpan: 5,
          // 根据数据点数量动态调整显示范围，默认显示最近的数据
          start: indicator === 'RSI' ? 0 : Math.max(0, 100 - Math.min(100, Math.min(filteredKlineData.length / 2, 90))),
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0],
          type: 'slider',
          bottom: 10,
          rangeMode: ['value', 'percent'], // 改为value和percent模式
          minSpan: 5,
          // 保持两个dataZoom组件的一致性
          start: indicator === 'RSI' ? 0 : Math.max(0, 100 - Math.min(100, Math.min(filteredKlineData.length / 2, 90))),
          end: 100
        }
      ],
      series: indicator === 'MACD' || indicator === 'MA' || indicator === 'RSI' ? 
        // MACD、MA和RSI指标时，使用indicatorSeries
        indicatorSeries
        : 
        // 其他指标时保持原有配置
        [
        {
          name: 'K线',
          type: 'candlestick',
          data: data,
          barWidth: '70%',
          barGap: '4%',
          barCategoryGap: '10%',
          itemStyle: {
            color: colors.upColor,
            color0: colors.downColor,
            borderColor: colors.upColor,
            borderColor0: colors.downColor,
            borderWidth: 1
          }
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          barWidth: '70%',
          barCategoryGap: '10%',
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
    
    // 在非MACD模式下添加额外的技术指标图表区域
    if (false) { // 修改条件，禁用这个额外区域的创建
      // 添加第三个图表区域的配置
      option.grid.push({
        left: '12%',
        right: '5%',
        top: '75%',
        height: '20%',
        containLabel: true
      });
      
      // 添加第三个x轴
      option.xAxis.push({
        type: 'category',
        gridIndex: 2,
        data: dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#999' } },
        axisTick: { 
          show: true,
          length: 4,
          inside: true,
          lineStyle: { color: '#999' }
        },
        splitLine: { show: false },
        axisLabel: { show: true },
        min: 'dataMin',
        max: 'dataMax'
      });
      
      // 添加第三个y轴
      option.yAxis.push({
        gridIndex: 2,
        scale: true,
        splitNumber: 4,
        axisLabel: { 
          show: true,
          inside: false,
          margin: 16,
          formatter: function(value: number) {
            return typeof value === 'number' ? value.toFixed(2) : '0.00';
          }
        },
        axisLine: { 
          show: true,
          lineStyle: { color: '#999' }
        },
        axisTick: { 
          show: true, 
          length: 4,
          inside: true,
          lineStyle: { color: '#999' }
        },
        splitLine: { show: true, lineStyle: { color: '#f5f5f5' } }
      });
      
      // 更新数据缩放配置
      option.dataZoom[0].xAxisIndex = [0, 1, 2];
      option.dataZoom[1].xAxisIndex = [0, 1, 2];
    } else if (indicator === 'MACD' || indicator === 'RSI' || indicator === 'MA') {
      // 对于MACD、RSI和MA模式，dataZoom只作用于主图表
      option.dataZoom[0].xAxisIndex = [0];
      option.dataZoom[1].xAxisIndex = [0];
    }
    
    // 额外防御性检查：确保所有series引用的xAxisIndex和yAxisIndex存在
    if (option.series && Array.isArray(option.series)) {
      option.series.forEach((series: any) => {
        // 确保series的data是有效的
        if (series.data && Array.isArray(series.data)) {
          // 检查data中是否存在无效值，如果是RSI系列，特别检查
          if (series.name === 'RSI') {
            series.data = series.data.map((val: any) => 
              typeof val === 'number' && !isNaN(val) ? val : null
            ).filter((val: any) => val !== null);
          }
        }
        
        // 检查并修复xAxisIndex
        if (series.xAxisIndex !== undefined) {
          // 确保xAxisIndex不超过实际xAxis数组长度
          if (series.xAxisIndex >= option.xAxis.length) {
            console.warn(`Series "${series.name}" references non-existent xAxisIndex: ${series.xAxisIndex}. Correcting to 0.`);
            series.xAxisIndex = 0;
          }
        }
        
        // 检查并修复yAxisIndex
        if (series.yAxisIndex !== undefined) {
          // 确保yAxisIndex不超过实际yAxis数组长度
          if (series.yAxisIndex >= option.yAxis.length) {
            console.warn(`Series "${series.name}" references non-existent yAxisIndex: ${series.yAxisIndex}. Correcting to 0.`);
            series.yAxisIndex = 0;
          }
        }
      });
    }
    
    // 确保dataZoom的xAxisIndex配置合法
    if (option.dataZoom && Array.isArray(option.dataZoom)) {
      option.dataZoom.forEach((zoom: any) => {
        if (zoom.xAxisIndex && Array.isArray(zoom.xAxisIndex)) {
          // 确保xAxisIndex数组中的每个索引都在合法范围内
          zoom.xAxisIndex = zoom.xAxisIndex.filter((index: number) => index < option.xAxis.length);
          // 如果过滤后为空数组，则至少包含索引0
          if (zoom.xAxisIndex.length === 0) {
            zoom.xAxisIndex = [0];
          }
        }
      });
    }
    
    // 清除之前的图表实例并创建新实例，避免状态残留
    if (chart) {
      chart.dispose();
    }
    chart = echarts.init(chartRef.current);
    
    // 确保在设置选项前数据已准备好
    try {
      chart.setOption(option, true); // 添加true参数完全替换之前的选项
    } catch (err) {
      console.error('设置图表选项时出错:', err);
      // 尝试使用简化的选项进行恢复
      try {
        const fallbackOption = {
          title: option.title,
          series: [{
            type: 'line',
            data: []
          }]
        };
        chart.setOption(fallbackOption);
        setError('图表渲染失败，请尝试刷新或选择其他指标');
      } catch (fallbackErr) {
        console.error('回退方案也失败了:', fallbackErr);
        setError('图表完全无法渲染，请刷新页面重试');
      }
    }
    
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
        result.push(null);
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data[i - j].close;
      }
      result.push(parseFloat((sum / dayCount).toFixed(2)));
    }
    return result;
  };
  
  // 获取周期显示名称
  const getDisplayPeriod = (periodValue: string) => {
    const option = periodOptions.find(opt => opt.value === periodValue);
    return option ? option.label : periodValue;
  };
  
  return (
    <div className="w-full">
      <Card className="w-full shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>技术分析 - {stockName}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChartInfoVisible(!isChartInfoVisible)}
              >
                <HelpCircle size={16} className="mr-2" />
                图表说明
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* 控制面板 */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* 股票选择改为使用Tabs */}
              <div className="space-y-1">
                <span className="text-xs font-medium ml-2">热门股票：</span>
                <div className="overflow-x-auto">
                  <Tabs
                    value={stockSymbol}
                    onValueChange={(value) => value && handleStockChange(value)}
                    className="w-full"
                  >
                    <TabsList className="h-7 inline-flex w-auto bg-muted/50">
                      {HOT_STOCKS.map((stock) => (
                        <TabsTrigger
                          key={stock.symbol}
                          value={stock.symbol}
                          className="px-2 py-0.5 h-7 text-xs whitespace-nowrap data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:shadow-sm"
                          disabled={isLoading}
                        >
                          {stock.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              {/* 指标选择改为使用Tabs */}
              <div className="space-y-1">
                <span className="text-xs font-medium ml-2">指标：</span>
                <Tabs
                  value={indicator}
                  onValueChange={(value) => value && setIndicator(value)}
                  className="w-auto"
                >
                  <TabsList className="h-7 bg-muted/50">
                    <TabsTrigger 
                      value="K线" 
                      className="px-2 h-6 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:shadow-sm"
                    >
                      K线
                    </TabsTrigger>
                    <TabsTrigger 
                      value="MA" 
                      className="px-2 h-6 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:shadow-sm"
                    >
                      MA
                    </TabsTrigger>
                    <TabsTrigger 
                      value="MACD" 
                      className="px-2 h-6 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:shadow-sm"
                    >
                      MACD
                    </TabsTrigger>
                    <TabsTrigger 
                      value="RSI" 
                      className="px-2 h-6 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:shadow-sm"
                    >
                      RSI
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {/* 刷新按钮 */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setForceRefresh(true);
                fetchTechnicalData();
              }}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="sr-only">刷新</span>
            </Button>
          </div>
          
          {/* 图表容器 */}
          <div className="h-[550px] w-full relative mt-2">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <Skeleton className="h-[90%] w-[95%] rounded-lg" />
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="text-center p-8 bg-gray-100 rounded-lg shadow-sm max-w-lg">
                  <div className="text-red-500 text-xl mb-4">图表加载失败</div>
                  <p className="text-gray-700 mb-6">{error}</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setError(null);
                      setIsLoading(true);
                      fetchKlineData();
                      fetchTechnicalData();
                    }}
                  >
                    重试
                  </Button>
                </div>
              </div>
            ) : null}
            <div ref={chartRef} className="h-full w-full" />
          </div>
          
          {/* 图表说明 */}
          {isChartInfoVisible && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indicator === 'MACD' && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">MACD指标说明</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium text-purple-500">DIF线</span>：快速移动平均线与慢速移动平均线的差值</li>
                      <li><span className="font-medium text-red-500">DEA线</span>：DIF的9日移动平均线</li>
                      <li><span className="font-medium">MACD柱状图</span>：(DIF-DEA)×2，红色表示为正值，绿色表示为负值</li>
                      <li><span className="font-medium">金叉信号</span>：DIF从下向上穿越DEA，是买入信号</li>
                      <li><span className="font-medium">死叉信号</span>：DIF从上向下穿越DEA，是卖出信号</li>
                    </ul>
                  </div>
                )}
                
                {indicator === 'RSI' && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">RSI指标说明</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium">RSI值范围</span>：0-100，衡量市场超买或超卖状态</li>
                      <li><span className="font-medium text-red-500">70线以上</span>：可能处于超买状态，是潜在的卖出区域</li>
                      <li><span className="font-medium text-green-500">30线以下</span>：可能处于超卖状态，是潜在的买入区域</li>
                      <li><span className="font-medium">50线</span>：多空分界线，RSI长期在50以上表示强势市场，反之为弱势</li>
                      <li><span className="font-medium">平均涨幅/跌幅</span>：显示平均上涨幅度和下跌幅度，用于判断市场强度</li>
                      <li><span className="font-medium">RS比率</span>：平均涨幅与平均跌幅的比值，是构成RSI的基础指标</li>
                    </ul>
        </div>
                )}
        
                {(indicator === 'K线' || indicator === 'MA') && (
              <div className="space-y-2">
                    <h4 className="font-semibold text-lg">K线图说明</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><span className="text-red-500 font-medium">红色K线</span>：表示收盘价高于开盘价，当天股价上涨</li>
                  <li><span className="text-green-500 font-medium">绿色K线</span>：表示收盘价低于开盘价，当天股价下跌</li>
                  <li><span className="font-medium">K线实体</span>：上下边界分别代表开盘价和收盘价</li>
                  <li><span className="font-medium">上下影线</span>：代表当天的最高价和最低价</li>
                </ul>
              </div>
                )}
              
                {indicator === 'MA' && (
              <div className="space-y-2">
                    <h4 className="font-semibold text-lg">均线系统说明</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium">MA5</span>：5日移动平均线，反映短期趋势</li>
                      <li><span className="font-medium">MA10</span>：10日移动平均线，反映中短期趋势</li>
                      <li><span className="font-medium">MA20</span>：20日移动平均线，反映中期趋势</li>
                      <li><span className="font-medium">MA30</span>：30日移动平均线，反映中长期趋势</li>
                  <li><span className="font-medium">多头排列</span>：短期均线在长期均线上方，表示上升趋势</li>
                  <li><span className="font-medium">空头排列</span>：短期均线在长期均线下方，表示下降趋势</li>
                </ul>
              </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-4">数据来源：东方财富API和新浪财经API</p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 