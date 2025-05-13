import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '散场之后 | 书页留思与光影随想',
  description: '记录阅读与观影后的感悟，分享对文化作品的思考和批评',
};

export default function AfterSceneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* 主渐变背景层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 pointer-events-none"></div>
      
      {/* 辅助渐变层 - 增加视觉深度 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-50/10 to-transparent dark:from-transparent dark:via-cyan-900/10 dark:to-transparent pointer-events-none"></div>
      
      {/* 轻微纹理效果 - 使用极其淡化的渐变代替纹理 */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 20%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.03) 0%, transparent 20%)'
        }}>
      </div>
      
      {/* 浮动形状背景元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-shape w-96 h-96 top-[2%] left-[8%] opacity-15" style={{ animationDuration: '18s' }}></div>
        <div className="floating-shape w-[500px] h-[500px] top-[15%] right-[-10%] opacity-10" style={{ animationDuration: '28s' }}></div>
        <div className="floating-shape w-[450px] h-[450px] bottom-[5%] left-[-5%] opacity-15" style={{ animationDuration: '24s' }}></div>
        <div className="floating-shape w-[400px] h-[400px] bottom-[15%] right-[10%] opacity-10" style={{ animationDuration: '22s' }}></div>
      </div>
      
      {/* 内容层 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 