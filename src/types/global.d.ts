/**
 * 全局类型声明文件
 * 用于解决TypeScript无法识别的模块导入问题
 */

// UI组件类型声明
declare module '@/components/ui/table' {
  import * as React from 'react'
  
  export const Table: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableElement> & React.RefAttributes<HTMLTableElement>>
  export const TableHeader: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>
  export const TableBody: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>
  export const TableFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>
  export const TableHead: React.ForwardRefExoticComponent<React.ThHTMLAttributes<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>>
  export const TableRow: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableRowElement> & React.RefAttributes<HTMLTableRowElement>>
  export const TableCell: React.ForwardRefExoticComponent<React.TdHTMLAttributes<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>>
  export const TableCaption: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableCaptionElement> & React.RefAttributes<HTMLTableCaptionElement>>
}

// 图表组件类型声明
declare module '@/components/charts/MarketOverview' {
  export default function MarketOverview(): JSX.Element
}

declare module '@/components/charts/HotStocks' {
  export default function HotStocks(): JSX.Element
}

declare module '@/components/charts/TechnicalAnalysis' {
  export default function TechnicalAnalysis(): JSX.Element
}

declare module '@/components/charts/DataAnalysis' {
  export default function DataAnalysis(): JSX.Element
}

declare module '@/components/charts/VolatilityAnalysisChart' {
  interface VolatilityAnalysisChartProps {
    symbol: string;
    initialData?: any;
    onRefresh?: () => void;
  }
  export default function VolatilityAnalysisChart(props: VolatilityAnalysisChartProps): JSX.Element
}

declare module '@/components/charts/StockComparisonChart' {
  interface StockComparisonChartProps {
    mainSymbol?: string;
    initialData?: any;
    onRefresh?: () => void;
  }
  export default function StockComparisonChart(props: StockComparisonChartProps): JSX.Element
}

declare module '@/components/charts/StockMetricsRadarChart' {
  interface StockMetric {
    symbol: string;
    name: string;
    metrics: Array<{
      name: string;
      value: number;
      max: number;
      description?: string;
    }>;
  }
  
  interface StockMetricsRadarChartProps {
    stocksData: StockMetric[];
    title?: string;
    description?: string;
    onRefresh?: () => void;
  }
  
  export default function StockMetricsRadarChart(props: StockMetricsRadarChartProps): JSX.Element
}

declare module '@/components/charts/TimeSeriesChart' {
  interface TimeSeriesChartProps {
    symbol: string;
    name?: string;
    initialData?: any;
    refreshInterval?: number;
    onRefresh?: () => void;
  }
  
  export default function TimeSeriesChart(props: TimeSeriesChartProps): JSX.Element
}

declare module 'bcryptjs';
declare module 'jsonwebtoken'; 