"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpIcon, ArrowDownIcon, SearchIcon, BarChart3Icon, PieChartIcon, RefreshCwIcon } from 'lucide-react';
import { HOT_STOCKS } from '@/lib/data/china-stock-api';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// 排序标准选项
const sortOptions = [
  { value: 'changePercent', label: '涨跌幅', order: 'desc' },
  { value: 'marketCap', label: '市值', order: 'desc' },
  { value: 'turnoverRate', label: '换手率', order: 'desc' },
  { value: 'volume', label: '成交量', order: 'desc' },
  { value: 'amount', label: '成交额', order: 'desc' }
];

export default function DataAnalysis() {
  const [stocksData, setStocksData] = useState<any[] | null>(null);
  const [filteredStocks, setFilteredStocks] = useState<any[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('changePercent');
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  
  // 初始化加载数据
  useEffect(() => {
    fetchStocksData();
  }, []);
  
  // 添加时间更新逻辑
  useEffect(() => {
    // 初始设置时间
    const updateTime = () => {
      const timeString = stocksData && stocksData[0]?.time 
        ? new Date(stocksData[0].time).toLocaleString('zh-CN')
        : new Date().toLocaleString('zh-CN');
      setCurrentTime(timeString);
    };
    
    updateTime();
    
    // 每分钟更新一次时间
    const timer = setInterval(updateTime, 60000);
    
    return () => clearInterval(timer);
  }, [stocksData]);
  
  // 过滤股票数据
  useEffect(() => {
    if (!stocksData) {
      setFilteredStocks(null);
      return;
    }
    
    let filtered = [...stocksData];
    
    // 应用搜索过滤
    if (searchQuery.trim()) {
      filtered = filtered.filter(stock => 
        stock.name.includes(searchQuery) || 
        stock.symbol.includes(searchQuery)
      );
    }
    
    // 应用排序
    const sortOption = sortOptions.find(opt => opt.value === sortBy);
    if (sortOption) {
      filtered.sort((a, b) => {
        const aValue = a[sortOption.value] || 0;
        const bValue = b[sortOption.value] || 0;
        return sortOption.order === 'desc' ? bValue - aValue : aValue - bValue;
      });
    }
    
    setFilteredStocks(filtered);
  }, [stocksData, searchQuery, sortBy]);
  
  // 获取股票数据
  const fetchStocksData = async () => {
    try {
      setIsLoading(true);
      
      // 获取预定义的热门股票代码
      const symbols = HOT_STOCKS.map(stock => stock.symbol).join(',');
      
      const response = await fetch(`/api/finance/stock-quote?symbol=${symbols}`);
      
      if (!response.ok) {
        throw new Error('获取股票数据失败');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // 处理数据，转换为数组格式
        const processedData = Object.entries(result.data).map(([symbol, data]: [string, any]) => {
          const stockInfo = HOT_STOCKS.find(stock => stock.symbol === symbol);
          // 添加空值检查，确保所有字段都有默认值
          return {
            symbol,
            name: stockInfo?.name || data?.name || symbol,
            price: data?.price || 0,
            change: data?.change || 0,
            changePercent: data?.changePercent || 0,
            volume: data?.volume || 0,
            turnoverRate: data?.turnoverRate || 0,
            high: data?.high || 0,
            low: data?.low || 0,
            open: data?.open || 0,
            prevClose: data?.prevClose || 0,
            amount: data?.amount || 0,
            time: data?.time || new Date().toISOString(),
            marketCap: data?.marketCap || 0,
            pe: data?.pe || 0,
            pb: data?.pb || 0
          };
        });
        
        setStocksData(processedData);
      } else {
        throw new Error(result.message || '无数据返回');
      }
    } catch (err) {
      console.error('获取股票数据出错:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理股票选择
  const toggleStockSelection = (symbol: string) => {
    setSelectedStocks(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else {
        // 最多选择5只股票
        const newSelection = [...prev, symbol];
        return newSelection.length > 5 ? newSelection.slice(1) : newSelection;
      }
    });
  };
  
  // 清除选择
  const clearSelection = () => {
    setSelectedStocks([]);
    setCompareMode(false);
  };
  
  // 获取排序名称
  const getSortName = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : sortBy;
  };
  
  // 渲染指标对比表格
  const renderComparisonTable = () => {
    if (!stocksData || selectedStocks.length === 0) return null;
    
    const selectedStocksData = stocksData.filter(stock => selectedStocks.includes(stock.symbol));
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>股票指标对比</CardTitle>
          <CardDescription>
            选定股票的主要指标对比分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>指标</TableHead>
                {selectedStocksData.map(stock => (
                  <TableHead key={stock.symbol}>{stock.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">最新价</TableCell>
                {selectedStocksData.map(stock => (
                  <TableCell key={`${stock.symbol}-price`} className={stock.change > 0 ? 'text-red-500' : stock.change < 0 ? 'text-green-500' : ''}>
                    {stock.price?.toFixed(2) || '0.00'}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">涨跌幅</TableCell>
                {selectedStocksData.map(stock => (
                  <TableCell key={`${stock.symbol}-change`}>
                    <Badge variant={stock.changePercent > 0 ? "destructive" : "default"}>
                      {stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(2) || '0.00'}%
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">成交量(万手)</TableCell>
                {selectedStocksData.map(stock => (
                  <TableCell key={`${stock.symbol}-volume`}>
                    {((stock.volume || 0) / 10000).toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">换手率</TableCell>
                {selectedStocksData.map(stock => (
                  <TableCell key={`${stock.symbol}-turnover`}>
                    {stock.turnoverRate?.toFixed(2) || '0.00'}%
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">市值(亿)</TableCell>
                {selectedStocksData.map(stock => (
                  <TableCell key={`${stock.symbol}-marketcap`}>
                    {((stock.marketCap || 0) / 100000000).toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">市盈率</TableCell>
                {selectedStocksData.map(stock => (
                  <TableCell key={`${stock.symbol}-pe`}>
                    {stock.pe ? stock.pe.toFixed(2) : '-'}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">市净率</TableCell>
                {selectedStocksData.map(stock => (
                  <TableCell key={`${stock.symbol}-pb`}>
                    {stock.pb ? stock.pb.toFixed(2) : '暂无'}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="mt-4 text-sm text-muted-foreground">
            注: 市值单位为亿元人民币，成交量单位为万手
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border">
        <div className="text-red-500 text-lg font-medium mb-4">加载失败: {error}</div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchStocksData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '加载中...' : '刷新重试'}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索股票名称或代码"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">排序:</span>
            <Tabs
              value={sortBy}
              onValueChange={(value) => value && setSortBy(value)}
              className="w-auto"
            >
              <TabsList className="h-7 bg-muted/50">
                {sortOptions.map(option => (
                  <TabsTrigger
                    key={option.value}
                    value={option.value}
                    className="px-2 h-6 text-xs whitespace-nowrap"
                  >
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedStocks.length > 0 && (
            <>
              <Badge variant="outline" className="mr-2">
                已选：{selectedStocks.length}只
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompareMode(!compareMode)}
              >
                {compareMode ? '返回列表' : '对比分析'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                清除选择
              </Button>
            </>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchStocksData}
            disabled={isLoading}
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-[500px] w-full rounded-lg" />
      ) : compareMode && selectedStocks.length > 0 ? (
        renderComparisonTable()
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>股票排行榜 - {getSortName()}排序</CardTitle>
            <CardDescription>
              点击股票可选择进行多股对比分析（最多选择5只）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>股票</TableHead>
                  <TableHead>最新价</TableHead>
                  <TableHead>涨跌幅</TableHead>
                  <TableHead>成交量(万手)</TableHead>
                  <TableHead className="hidden md:table-cell">换手率</TableHead>
                  <TableHead className="hidden md:table-cell">市值(亿)</TableHead>
                  <TableHead className="hidden md:table-cell">市盈率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks && filteredStocks.length > 0 ? (
                  filteredStocks.map((stock, index) => (
                    <TableRow 
                      key={stock.symbol}
                      className={`cursor-pointer ${selectedStocks.includes(stock.symbol) ? 'bg-accent' : ''}`}
                      onClick={() => toggleStockSelection(stock.symbol)}
                    >
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{stock.name}</div>
                        <div className="text-xs text-muted-foreground">{stock.symbol}</div>
                      </TableCell>
                      <TableCell className={stock.change > 0 ? 'text-red-500' : stock.change < 0 ? 'text-green-500' : ''}>
                        {stock.price?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={stock.changePercent > 0 ? "destructive" : "default"}>
                          {stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(2) || '0.00'}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {((stock.volume || 0) / 10000).toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {stock.turnoverRate?.toFixed(2) || '0.00'}%
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {((stock.marketCap || 0) / 100000000).toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {stock.pe ? stock.pe.toFixed(2) : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      {searchQuery ? '没有匹配的股票' : '暂无数据'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <div className="text-sm text-center text-muted-foreground">
        数据更新时间：{currentTime || "数据加载中..."}
      </div>
    </div>
  );
} 