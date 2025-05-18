/**
 * 金融数据导入组件
 */
'use client';

import { useState } from 'react';
import { 
  RefreshCw, 
  Check, 
  AlertCircle,
  BarChart2, 
  TrendingUp,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DataSourceOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

// 数据源选项
const DATA_SOURCES: DataSourceOption[] = [
  {
    id: 'market-indices',
    name: '市场指数',
    description: '获取主要市场指数数据，包括上证指数、深证成指等',
    icon: BarChart2
  },
  {
    id: 'hot-sectors',
    name: '热门板块',
    description: '获取当前市场热门板块和行业数据',
    icon: TrendingUp
  },
  {
    id: 'industry-data',
    name: '行业数据',
    description: '获取各行业的详细数据和指标',
    icon: Building2
  }
];

export default function FinanceDataImport() {
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [results, setResults] = useState<{[key: string]: {success: boolean, message: string} | null}>({});
  const [expandedResults, setExpandedResults] = useState<{[key: string]: boolean}>({});
  
  // 切换结果详情展开状态
  const toggleResultExpand = (sourceId: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [sourceId]: !prev[sourceId]
    }));
  };
  
  // 导入数据
  const importData = async (sourceId: string) => {
    // 设置加载状态
    setLoading(prev => ({ ...prev, [sourceId]: true }));
    
    // 清除之前的结果
    setResults(prev => {
      const newResults = { ...prev };
      newResults[sourceId] = null;
      return newResults;
    });
    
    try {
      // 构造请求正文
      const body = {
        fetchFromExternal: true
      };
      
      // 根据数据源类型选择不同的API端点
      let endpoint = '';
      
      switch (sourceId) {
        case 'market-indices':
          endpoint = '/api/dashboard/financial-data/batch';
          break;
        case 'hot-sectors':
          endpoint = '/api/dashboard/market-trends/hot-sectors';
          break;
        case 'industry-data':
          endpoint = '/api/dashboard/market-trends/industries';
          break;
        default:
          throw new Error('未知的数据源类型');
      }
      
      // 发送请求
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setResults(prev => ({ 
          ...prev, 
          [sourceId]: { 
            success: true,
            message: `成功导入 ${result.insertedCount || result.data?.length || 0} 条数据`
          } 
        }));
        toast.success(`${sourceId} 数据导入成功`);
      } else {
        setResults(prev => ({ 
          ...prev, 
          [sourceId]: { 
            success: false,
            message: result.message || result.error || '导入失败，未知错误'
          } 
        }));
        toast.error(`${sourceId} 数据导入失败`);
      }
    } catch (error) {
      console.error(`导入${sourceId}数据时出错:`, error);
      setResults(prev => ({ 
        ...prev, 
        [sourceId]: { 
          success: false,
          message: error instanceof Error ? error.message : '导入失败，未知错误'
        } 
      }));
      toast.error(`${sourceId} 数据导入失败`);
    } finally {
      setLoading(prev => ({ ...prev, [sourceId]: false }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">金融数据导入</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          从外部源获取最新金融数据并导入系统
        </p>
      </div>
      
      <div>
        {DATA_SOURCES.map((source) => (
          <div key={source.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-start mb-4 md:mb-0">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400 mr-4">
                  <source.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {source.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {source.description}
                  </p>
                  
                  {/* 结果显示 */}
                  {results[source.id] && (
                    <div className={`mt-2 text-sm p-2 rounded-md ${
                      results[source.id]?.success 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    }`}>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleResultExpand(source.id)}
                      >
                        {results[source.id]?.success ? (
                          <Check className="h-4 w-4 mr-1 inline" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mr-1 inline" />
                        )}
                        <span>
                          {results[source.id]?.success ? '导入成功' : '导入失败'}
                        </span>
                      </div>
                      
                      {expandedResults[source.id] && (
                        <div className="mt-1 ml-5">
                          {results[source.id]?.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <button
                  onClick={() => importData(source.id)}
                  disabled={loading[source.id]}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${loading[source.id]
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'}
                  `}
                >
                  {loading[source.id] ? (
                    <span className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      导入中...
                    </span>
                  ) : '导入数据'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
