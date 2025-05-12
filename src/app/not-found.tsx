import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center px-4 py-16 min-h-screen">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <Image
              src="/svg-images/404.svg"
              alt="404 页面未找到"
              width={400}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          找不到页面
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
          抱歉，您请求的页面不存在或已被移动。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-full shadow-sm hover:shadow-md transition-all"
          >
            返回首页
          </Link>
          
          <Link
            href="/projects"
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            浏览所有项目
          </Link>
        </div>
      </div>
    </main>
  );
} 