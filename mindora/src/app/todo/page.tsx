import UnderConstruction from "@/components/ui/UnderConstruction";

export const metadata = {
  title: "Todo应用 | 建设中",
  description: "使用现代化的Todo应用管理您的日常任务",
};

export default function TodoPage() {
  return (
    <UnderConstruction 
      title="Todo应用正在建设中" 
      message="我们正在努力开发一个功能强大、界面友好的Todo应用，帮助您高效管理日常任务和提高工作效率。敬请期待！"
      backUrl="/"
      backLabel="返回首页"
    />
  );
} 