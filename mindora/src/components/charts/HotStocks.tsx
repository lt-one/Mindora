"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpIcon, ArrowDownIcon, SearchIcon, RefreshCwIcon } from 'lucide-react';
import { HOT_STOCKS } from '@/lib/data/china-stock-api';

export default function HotStocks() {
  const [stocksData, setStocksData] = useState<any[] | null>(null);
  const [filteredStocks, setFilteredStocks] = useState<any[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [orderBookData, setOrderBookData] = useState<any | null>(null);
  const [orderBookLoading, setOrderBookLoading] = useState(false);
  
  // 获取热门股票数据
  useEffect(() => {
    fetchHotStocks();
    
    // 设置定时器，每60秒刷新一次数据
    const timer = setInterval(fetchHotStocks, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 过滤股票数据
  useEffect(() => {
    if (!stocksData) {
      setFilteredStocks(null);
      return;
    }
    
    if (!searchQuery.trim()) {
      setFilteredStocks(stocksData);
      return;
    }
    
    const filtered = stocksData.filter(stock => 
      stock.name.includes(searchQuery) || 
      stock.symbol.includes(searchQuery)
    );
    
    setFilteredStocks(filtered);
  }, [stocksData, searchQuery]);
  
  // 获取热门股票数据
  const fetchHotStocks = async () => {
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
          return {
            symbol,
            name: stockInfo?.name || data.name || symbol,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            volume: data.volume,
            turnoverRate: data.turnoverRate,
            high: data.high,
            low: data.low,
            open: data.open,
            prevClose: data.prevClose,
            amount: data.amount,
            time: data.time,
            marketCap: data.marketCap
          };
        });
        
        setStocksData(processedData);
        setFilteredStocks(processedData);
      } else {
        throw new Error(result.message || '无数据返回');
      }
    } catch (err) {
      console.error('获取热门股票数据出错:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 获取股票盘口数据
  const fetchOrderBook = async (symbol: string) => {
    try {
      setOrderBookLoading(true);
      setSelectedStock(symbol);
      
      const response = await fetch(`/api/finance/stock-quote?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error('获取盘口数据失败');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setOrderBookData(result.data);
      } else {
        throw new Error(result.message || '无数据返回');
      }
    } catch (err) {
      console.error('获取盘口数据出错:', err);
      setError((err as Error).message);
    } finally {
      setOrderBookLoading(false);
    }
  };
  
  // 渲染盘口数据
  const renderOrderBook = () => {
    if (!orderBookData) return null;
    
    const stock = stocksData?.find(s => s.symbol === selectedStock);
    if (!stock) return null;
    
    const isUp = stock.changePercent > 0;
    
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-xl font-bold">{stock.name}</span>
              <span className="text-sm text-muted-foreground ml-2">{stock.symbol}</span>
            </div>
            <Badge variant={isUp ? "destructive" : "default"}>
              {isUp ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
              {Math.abs(stock.changePercent).toFixed(2)}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-3xl font-bold">{stock.price?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                {stock.change > 0 ? '+' : ''}{stock.change?.toFixed(2)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">今开</div>
                <div className="font-medium">{stock.open?.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">昨收</div>
                <div className="font-medium">{stock.prevClose?.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">最高</div>
                <div className="font-medium text-red-500">{stock.high?.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">最低</div>
                <div className="font-medium text-green-500">{stock.low?.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">成交量</div>
                <div className="font-medium">{(stock.volume / 10000).toFixed(2)}万手</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">成交额</div>
                <div className="font-medium">{(stock.amount / 100000000).toFixed(2)}亿</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">换手率</div>
                <div className="font-medium">{stock.turnoverRate?.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">市值</div>
                <div className="font-medium">{(stock.marketCap / 100000000).toFixed(2)}亿</div>
              </div>
            </div>
          </div>
          
          {/* 五档盘口 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold mb-2">卖盘</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>价格</TableHead>
                    <TableHead className="text-right">数量(手)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderBookLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={`ask-skeleton-${i}`}>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : orderBookData.asks ? (
                    // 倒序显示卖盘，从卖五到卖一
                    [...orderBookData.asks].reverse().map((ask: any, i: number) => (
                      <TableRow key={`ask-${i}`}>
                        <TableCell className="text-red-500">{ask.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{Math.round(ask.volume / 100)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">无数据</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div>
              <div className="text-sm font-semibold mb-2">买盘</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>价格</TableHead>
                    <TableHead className="text-right">数量(手)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderBookLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={`bid-skeleton-${i}`}>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : orderBookData.bids ? (
                    orderBookData.bids.map((bid: any, i: number) => (
                      <TableRow key={`bid-${i}`}>
                        <TableCell className="text-green-500">{bid.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{Math.round(bid.volume / 100)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">无数据</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (error) {
    return <div className="text-center text-red-500 py-4">加载失败: {error}</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索股票名称或代码"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchHotStocks}
          disabled={isLoading}
        >
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          刷新
        </Button>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-[400px] w-full rounded-lg" />
      ) : (
        <>
          <Table>
            <TableCaption>热门股票实时行情</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>股票</TableHead>
                <TableHead>最新价</TableHead>
                <TableHead>涨跌幅</TableHead>
                <TableHead className="hidden md:table-cell">成交量(万手)</TableHead>
                <TableHead className="hidden md:table-cell">换手率</TableHead>
                <TableHead className="hidden md:table-cell">市值(亿)</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks && filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell>
                      <div className="font-medium">{stock.name}</div>
                      <div className="text-xs text-muted-foreground">{stock.symbol}</div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-bold ${stock.changePercent > 0 ? 'text-red-500' : stock.changePercent < 0 ? 'text-green-500' : ''}`}>
                        {stock.price?.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stock.changePercent > 0 ? "destructive" : "default"}>
                        {stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {(stock.volume / 10000).toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {stock.turnoverRate?.toFixed(2)}%
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {(stock.marketCap / 100000000).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchOrderBook(stock.symbol)}
                      >
                        盘口
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {searchQuery ? '没有匹配的股票' : '暂无数据'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* 盘口数据 */}
          {selectedStock && renderOrderBook()}
        </>
      )}
    </div>
  );
} 