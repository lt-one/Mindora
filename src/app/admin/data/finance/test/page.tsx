import { notFound } from 'next/navigation';

export default function TestNotFoundPage() {
  // 始终触发notFound()函数，以测试not-found.tsx页面是否正常工作
  notFound();
  
  // 以下代码永远不会执行，因为notFound()会中断渲染
  return (
    <div>
      <h1>测试页面</h1>
      <p>如果你看到这个页面，说明notFound()函数没有正常工作。</p>
    </div>
  );
} 