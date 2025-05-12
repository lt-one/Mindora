import UnderConstruction from "@/components/ui/UnderConstruction";

export const metadata = {
  title: "联系我们 | 建设中",
  description: "与我们取得联系，了解更多信息或提出问题",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      {/* 全屏背景容器 */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        {/* 主要渐变背景 */}
        <div className="w-full h-full bg-gradient-to-br from-blue-50/90 via-white/90 to-purple-50/90 dark:from-slate-900/95 dark:via-slate-950/95 dark:to-purple-950/95"></div>
        
        {/* 装饰背景元素 - 渐变球体 */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200/20 dark:bg-pink-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '25s' }}></div>
        
        {/* 点阵背景纹理 */}
        <div className="absolute inset-0 opacity-10 dark:opacity-15 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')]"></div>
      </div>

      <main className="relative z-10">
        <UnderConstruction 
          title="联系页面正在建设中" 
          message="我们正在努力完善联系页面，很快您就可以通过这里与我们取得联系。感谢您的耐心等待！"
          backUrl="/"
          backLabel="返回首页"
        />
      </main>
    </div>
  );
} 