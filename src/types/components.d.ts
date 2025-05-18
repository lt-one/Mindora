/**
 * 为自定义组件创建类型声明
 */

// 声明管理后台组件模块
declare module '@/components/admin/FinanceDataImport' {
  export default function FinanceDataImport(): JSX.Element;
}

declare module '@/components/admin/FinanceDataStats' {
  export default function FinanceDataStats(): JSX.Element;
}

declare module '@/components/admin/AdminNav' {
  export default function AdminNav(): JSX.Element;
}

declare module '@/components/admin/AdminLayoutClient' {
  interface AdminLayoutClientProps {
    children: React.ReactNode;
  }
  export default function AdminLayoutClient(props: AdminLayoutClientProps): JSX.Element;
}

// 好站分享相关组件
declare module '@/components/good-sites/SiteGridContainer' {
  interface SiteGridContainerProps {
    categories: string[];
  }
  export default function SiteGridContainer(props: SiteGridContainerProps): JSX.Element;
}

declare module '@/components/good-sites/SiteGrid' {
  interface SiteGridProps {
    sites: any[];
  }
  export default function SiteGrid(props: SiteGridProps): JSX.Element;
} 