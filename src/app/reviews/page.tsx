import UnderConstruction from "@/components/ui/UnderConstruction";

export const metadata = {
  title: "散场之后 | 书页留思 & 光影随想 | 建设中",
  description: "散场之后的思绪：分享关于书籍的「书页留思」与电影的「光影随想」",
};

export default function ReviewsPage() {
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
          title="「散场之后」正在建设中" 
          message="我们正在用心打造「散场之后」栏目，这里将包含「书页留思」(书本读后感)和「光影随想」(电影观后感)两个专区，记录那些在书页间与银幕前的点滴感悟。敬请期待！"
          backUrl="/"
          backLabel="返回首页"
        />
      </main>
    </div>
  );
} 