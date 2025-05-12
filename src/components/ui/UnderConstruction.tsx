"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface UnderConstructionProps {
  title?: string;
  message?: string;
  backUrl?: string;
  backLabel?: string;
}

export default function UnderConstruction({
  title = "页面正在建设中",
  message = "此功能正在开发中，敬请期待！",
  backUrl = "/",
  backLabel = "返回首页"
}: UnderConstructionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <div className="w-full max-w-md mx-auto mb-8">
        <Image
          src="/svg-images/正在建设.svg"
          alt="正在建设"
          width={400}
          height={400}
          className="w-full h-auto"
          priority
        />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        {message}
      </p>
      
      <Link
        href={backUrl}
        className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {backLabel}
      </Link>
    </div>
  );
} 