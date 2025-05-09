"use client";

import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-6">仪表盘功能建设中</h1>
        <div className="w-full max-w-md mx-auto mb-8">
          <Image 
            src="/svg图片/正在建设.svg"
            alt="正在建设"
            width={400}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>
        <p className="mt-6 text-lg text-muted-foreground">
          我们正在重新设计仪表盘功能，敬请期待...
        </p>
      </div>
    </div>
  );
} 