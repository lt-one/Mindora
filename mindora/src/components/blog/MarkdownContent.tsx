"use client";

import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  // 自定义组件映射
  const components = {
    // 标题处理，添加ID和样式
    h1: ({ ...props }: any) => (
      <h1 
        {...props} 
        id={props.id} 
        className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700" 
      />
    ),
    h2: ({ ...props }: any) => (
      <h2 
        {...props} 
        id={props.id} 
        className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700" 
      />
    ),
    h3: ({ ...props }: any) => (
      <h3 
        {...props} 
        id={props.id} 
        className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white" 
      />
    ),
    h4: ({ ...props }: any) => (
      <h4 
        {...props} 
        id={props.id} 
        className="text-lg font-semibold mt-5 mb-2 text-gray-900 dark:text-white" 
      />
    ),
    
    // 段落
    p: ({ ...props }: any) => (
      <p 
        {...props} 
        className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" 
      />
    ),
    
    // 列表
    ul: ({ ...props }: any) => (
      <ul 
        {...props} 
        className="mb-6 ml-6 list-disc text-gray-700 dark:text-gray-300 space-y-2" 
      />
    ),
    ol: ({ ...props }: any) => (
      <ol 
        {...props} 
        className="mb-6 ml-6 list-decimal text-gray-700 dark:text-gray-300 space-y-2" 
      />
    ),
    li: ({ ...props }: any) => (
      <li 
        {...props} 
        className="leading-relaxed" 
      />
    ),
    
    // 引用块
    blockquote: ({ ...props }: any) => (
      <blockquote 
        {...props} 
        className="mb-6 pl-4 border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 py-2 px-3 rounded-r-lg italic text-gray-700 dark:text-gray-300" 
      />
    ),
    
    // 代码块和内联代码
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="mb-6 rounded-lg overflow-hidden shadow-md">
          <div className="bg-gray-800 text-gray-200 py-2 px-4 text-xs font-mono flex justify-between">
            <span>{match[1].toUpperCase()}</span>
            <button className="text-gray-400 hover:text-white" onClick={() => {
              navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
            }}>
              复制
            </button>
          </div>
          <pre className="p-4 bg-gray-900 text-gray-100 overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code
          className="bg-gray-100 dark:bg-gray-800 rounded-md px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200"
          {...props}
        >
          {children}
        </code>
      );
    },
    
    // 图片处理，使用Next.js的Image组件
    img: ({ src, alt, ...props }: any) => {
      if (!src) return null;
      
      if (src.startsWith("http")) {
        // 外部图片使用普通img标签
        return (
          <span className="block my-6">
            <img
              src={src}
              alt={alt || ""}
              loading="lazy"
              className="rounded-lg max-w-full h-auto mx-auto shadow-md"
              {...props}
            />
            {alt && <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{alt}</span>}
          </span>
        );
      }
      
      // 本地图片使用Next.js Image组件
      return (
        <span className="block my-6">
          <Image
            src={src}
            alt={alt || ""}
            width={800}
            height={500}
            className="rounded-lg max-w-full h-auto mx-auto shadow-md"
            {...props}
          />
          {alt && <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{alt}</span>}
        </span>
      );
    },
    
    // 表格
    table: ({ ...props }: any) => (
      <div className="mb-6 overflow-x-auto">
        <table 
          {...props} 
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg" 
        />
      </div>
    ),
    thead: ({ ...props }: any) => (
      <thead 
        {...props} 
        className="bg-gray-50 dark:bg-gray-800" 
      />
    ),
    tbody: ({ ...props }: any) => (
      <tbody 
        {...props} 
        className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800" 
      />
    ),
    tr: ({ ...props }: any) => (
      <tr 
        {...props} 
        className="hover:bg-gray-50 dark:hover:bg-gray-800" 
      />
    ),
    th: ({ ...props }: any) => (
      <th 
        {...props} 
        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" 
      />
    ),
    td: ({ ...props }: any) => (
      <td 
        {...props} 
        className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300" 
      />
    ),
    
    // 水平线
    hr: ({ ...props }: any) => (
      <hr 
        {...props} 
        className="my-8 border-t border-gray-200 dark:border-gray-800" 
      />
    ),
    
    // 加强元素
    strong: ({ ...props }: any) => (
      <strong 
        {...props} 
        className="font-semibold text-gray-900 dark:text-white" 
      />
    ),
    
    // 强调元素
    em: ({ ...props }: any) => (
      <em 
        {...props} 
        className="italic text-gray-800 dark:text-gray-200" 
      />
    ),
    
    // 链接
    a: ({ href, ...props }: any) => {
      const isExternal = href && (href.startsWith("http") || href.startsWith("https"));
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          {...props}
        />
      );
    },
  };

  return (
    <div className={cn("prose prose-lg max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 