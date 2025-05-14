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
  
  // 加载第一支股票的盘口数据
  useEffect(() => {
    // 当股票数据加载完成后，自动加载第一支股票的盘口数据
    if (stocksData && stocksData.length > 0 && !selectedStock) {
      fetchOrderBook(stocksData[0].symbol);
    }
  }, [stocksData]);
  
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
      setError(null); // 清除之前的错误
      
      // 直接使用专门的盘口深度API，而不是stock-quote
      const response = await fetch(`/api/finance/stock-depth?symbol=${symbol}`);
      
      // 添加调试信息，查看返回的数据结构
      console.log(`请求盘口API: /api/finance/stock-depth?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error('获取盘口数据失败');
      }
      
      const result = await response.json();
      
      // 添加调试信息，查看返回的数据结构
      console.log('获取到的盘口数据:', JSON.stringify(result.data, null, 2));
      
      if (result.success) {
        const fullData = {
          ...stocksData?.find(s => s.symbol === symbol),
          // 直接设置bids、asks和历史数据标记
          bids: result.data?.bids || [],
          asks: result.data?.asks || [],
          isHistoricalData: result.data?.isHistoricalData || false,
          dataMessage: result.message
        };
        setOrderBookData(fullData);
        
        // 如果没有数据但服务器返回了消息，显示这个消息
        if ((!result.data?.bids || result.data.bids.length === 0) && 
            (!result.data?.asks || result.data.asks.length === 0) && 
            result.message) {
          console.log('盘口数据为空，原因:', result.message);
        }
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
    
    const stock = orderBookData; // 现在orderBookData已包含所有必要数据
    if (!stock) return null;
    
    const isUp = stock.changePercent > 0;
    
    // 直接使用数据中的bids和asks
    const bids = stock.bids;
    const asks = stock.asks;
    
    // 检查是否有盘口数据
    const hasOrderBookData = bids?.length > 0 || asks?.length > 0;
    
    // 是否为历史数据
    const isHistoricalData = stock.isHistoricalData || false;
    
    console.log('渲染盘口数据 - 买盘:', bids);
    console.log('渲染盘口数据 - 卖盘:', asks);
    console.log('是否为历史数据:', isHistoricalData);
    
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-5 pb-3 border-b">
            <div className="flex items-center">
              <div className={`w-2 h-10 rounded-sm mr-2 ${isUp ? 'bg-red-500' : isUp === false ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div>
                <div className="flex items-center">
                  <span className="text-lg font-bold">{stock.name}</span>
                  <span className="text-xs text-muted-foreground ml-2 px-1.5 py-0.5 bg-gray-100 rounded dark:bg-gray-800">{stock.symbol}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">行情更新时间: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-3 rounded-md h-[120px]">
              <div className="text-xs text-gray-500 mb-1">最新价</div>
              <div className={`flex items-baseline justify-center ${isUp ? 'text-red-500' : isUp === false ? 'text-green-500' : 'text-gray-700'}`}>
                <div className="text-3xl font-bold">{stock.price?.toFixed(2)}</div>
              </div>
              <div className="flex items-center mt-2 justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-0.5">涨跌额</span>
                  <span className={`${isUp ? 'text-red-500' : isUp === false ? 'text-green-500' : 'text-gray-500'} font-medium`}>
                    {stock.change > 0 ? '+' : ''}{stock.change?.toFixed(2)}
                  </span>
                </div>
                <span className="mx-2 text-gray-400">|</span>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-0.5">涨跌幅</span>
                  <span className={`${isUp ? 'text-red-500' : isUp === false ? 'text-green-500' : 'text-gray-500'}`}>
                    {stock.change > 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-xs text-muted-foreground mb-1">今开</div>
                <div className="font-medium">{stock.open?.toFixed(2)}</div>
              </div>
              <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-xs text-muted-foreground mb-1">昨收</div>
                <div className="font-medium">{stock.prevClose?.toFixed(2)}</div>
              </div>
              <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-xs text-muted-foreground mb-1">最高</div>
                <div className="font-medium text-red-500">{stock.high?.toFixed(2)}</div>
              </div>
              <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-xs text-muted-foreground mb-1">最低</div>
                <div className="font-medium text-green-500">{stock.low?.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-xs text-muted-foreground mb-1">成交量</div>
                <div className="font-medium">{(stock.volume / 10000).toFixed(2)}万手</div>
              </div>
              <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-xs text-muted-foreground mb-1">成交额</div>
                <div className="font-medium">{(stock.amount / 100000000).toFixed(2)}亿</div>
              </div>
              <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-xs text-muted-foreground mb-1">换手率</div>
                <div className="font-medium">{stock.turnoverRate?.toFixed(2)}%</div>
              </div>
              <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-xs text-muted-foreground mb-1">市值</div>
                <div className="font-medium">{(stock.marketCap / 100000000).toFixed(2)}亿</div>
              </div>
            </div>
          </div>
          
          {!hasOrderBookData ? (
            <div>
              <div className="py-6 text-center text-muted-foreground">
                <p>当前没有可用的盘口数据</p>
                <p className="text-sm mt-1">可能原因：非交易时段、股票停牌或行情数据延迟</p>
              </div>
              
              <div className="mt-4 py-2 px-3 bg-slate-50 dark:bg-slate-900 border rounded-md text-xs">
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-medium">当前没有盘口数据</span>
                </div>
                <div className="ml-5 text-slate-600 dark:text-slate-400">
                  <div className="mb-1">• 非交易时段：交易日9:30-11:30, 13:00-15:00外</div>
                  <div className="mb-1">• 停牌：股票可能因公告或其他原因临时停牌</div>
                  <div className="mb-1">• 数据延迟：行情数据获取可能存在延迟</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 历史数据提示 */}
              {isHistoricalData && (
                <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-amber-700 text-sm">
                  <p>当前显示的是最后交易时段的盘口数据（非实时）</p>
                  {stock.dataMessage && <p className="text-xs mt-1">{stock.dataMessage}</p>}
                </div>
              )}
              
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
                      ) : asks && asks.length > 0 ? (
                        // 倒序显示卖盘，从卖五到卖一
                        [...asks].reverse().map((ask: any, i: number) => (
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
                      ) : bids && bids.length > 0 ? (
                        bids.map((bid: any, i: number) => (
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
            </>
          )}
          
          {/* 添加盘口数据说明 */}
          {hasOrderBookData && (
            <div className="mt-4 py-2 px-3 bg-slate-50 dark:bg-slate-900 border rounded-md text-xs">
              <div className="flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">盘口数据说明</span>
              </div>
              <div className="ml-5 text-slate-600 dark:text-slate-400 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                <div>• 买盘显示买家愿意出价购买的价格和数量</div>
                <div>• 卖盘显示卖家提供的报价和可供出售的数量</div>
                <div>• 价格以人民币显示，数量单位为手(1手=100股)</div>
                <div>• 盘口深度反映了市场流动性和买卖压力</div>
                <div>• 买卖价差较小表示流动性较好，交易活跃</div>
                <div>• 非交易时段可能显示历史数据或无数据</div>
              </div>
            </div>
          )}
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
          onClick={fetchHotStocks}
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
                  <TableRow 
                    key={stock.symbol} 
                    className={selectedStock === stock.symbol ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                  >
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
                      <div className={`${stock.changePercent > 0 ? 'text-red-500' : stock.changePercent < 0 ? 'text-green-500' : ''}`}>
                        {stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                      </div>
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
                        variant={selectedStock === stock.symbol ? "default" : "outline"}
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
          {selectedStock && (
            <>
              {renderOrderBook()}
            </>
          )}
        </>
      )}
    </div>
  );
} 