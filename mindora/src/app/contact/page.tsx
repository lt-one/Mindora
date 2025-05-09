import UnderConstruction from "@/components/ui/UnderConstruction";

export const metadata = {
  title: "联系我们 | 建设中",
  description: "与我们取得联系，了解更多信息或提出问题",
};

export default function ContactPage() {
  return (
    <UnderConstruction 
      title="联系页面正在建设中" 
      message="我们正在努力完善联系页面，很快您就可以通过这里与我们取得联系。感谢您的耐心等待！"
      backUrl="/"
      backLabel="返回首页"
    />
  );
} 