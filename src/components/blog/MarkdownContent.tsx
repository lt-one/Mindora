"use client";

import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

/**
 * 从文本生成有效的ID
 */
function generateIdFromText(text: string): string {
  if (!text) return `heading-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格替换为-
    .replace(/[^\w\-]/g, '') // 移除特殊字符
    .replace(/\-+/g, '-') // 多个-替换为单个-
    .replace(/^-|-$/g, ''); // 移除开头和结尾的-
}

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  const [processedContent, setProcessedContent] = useState(content);
  const [isHTML, setIsHTML] = useState(false);
  const [processedHTML, setProcessedHTML] = useState(content);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 检测内容是否为HTML
    const containsHTMLTags = /<\/?[a-z][\s\S]*>/i.test(content);
    const isCompleteHTML = containsHTMLTags && 
      (content.indexOf('<h1') !== -1 || content.indexOf('<p') !== -1); // 判断是否包含常见HTML块级元素
    
    setIsHTML(isCompleteHTML);
    
    if (isCompleteHTML) {
      // HTML内容处理 - 确保所有标题都有ID
      let processedHTML = content;
      // 匹配所有没有id属性的h1-h6标签
      processedHTML = processedHTML.replace(
        /<h([1-6])(?![^>]*\bid=["'][^"']*["'])[^>]*>([\s\S]*?)<\/h\1>/gi,
        (match, level, content) => {
          // 移除HTML标签获取纯文本用于生成ID
          const text = content.replace(/<[^>]+>/g, '').trim();
          if (!text) return match; // 如果没有文本内容，返回原标签
          
          // 生成ID
          const id = generateIdFromText(text);
          
          // 在开始标签中添加id属性
          return `<h${level} id="${id}"${match.substring(3 + level.toString().length, match.indexOf('>'))}>${content}</h${level}>`;
        }
      );
      
      setProcessedHTML(processedHTML);
    } else {
      // 只有在非HTML内容时才进行Markdown处理
      // 处理HTML标签问题，移除或转换HTML标签
      let processed = content;
      
      // 处理各种常见HTML标签
      // 段落标签
      processed = processed.replace(/<p>\s*([\s\S]*?)\s*<\/p>/g, "$1\n\n");
      
      // 标题标签
      processed = processed.replace(/<h([1-6])>\s*([\s\S]*?)\s*<\/h[1-6]>/g, (_, level, text) => {
        const hashes = '#'.repeat(Number(level));
        return `${hashes} ${text}\n\n`;
      });
      
      // 强调标签
      processed = processed.replace(/<strong>\s*([\s\S]*?)\s*<\/strong>/g, "**$1**");
      processed = processed.replace(/<b>\s*([\s\S]*?)\s*<\/b>/g, "**$1**");
      processed = processed.replace(/<em>\s*([\s\S]*?)\s*<\/em>/g, "*$1*");
      processed = processed.replace(/<i>\s*([\s\S]*?)\s*<\/i>/g, "*$1*");
      
      // 列表标签
      processed = processed.replace(/<ul>\s*([\s\S]*?)\s*<\/ul>/g, "$1\n");
      processed = processed.replace(/<ol>\s*([\s\S]*?)\s*<\/ol>/g, "$1\n");
      processed = processed.replace(/<li>\s*([\s\S]*?)\s*<\/li>/g, "* $1\n");
      
      // 链接标签
      processed = processed.replace(/<a href="([^"]+)">\s*([\s\S]*?)\s*<\/a>/g, "[$2]($1)");
      
      // 图片标签
      processed = processed.replace(/<img src="([^"]+)" alt="([^"]*)"[^>]*>/g, "![$2]($1)");
      
      // 换行标签
      processed = processed.replace(/<br\s*\/?>/g, "\n");
      
      // 横线标签
      processed = processed.replace(/<hr\s*\/?>/g, "---\n\n");
      
      // 处理可能剩余的其他HTML标签
      processed = processed.replace(/<[^>]+>/g, "");
      
      setProcessedContent(processed);
    }
  }, [content]);

  // 在HTML内容渲染后处理标题ID
  useEffect(() => {
    if (isHTML && contentRef.current) {
      // 查找所有标题元素
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const usedIds = new Set<string>();
      
      headings.forEach(heading => {
        // 检查是否已有ID
        let id = heading.getAttribute('id');
        
        // 如果没有ID或者ID是空的，则生成一个
        if (!id || id.trim() === '') {
          // 获取文本内容
          const text = heading.textContent || '';
          
          // 生成ID
          id = generateIdFromText(text);
        }
        
        // 确保ID唯一
        if (usedIds.has(id)) {
          id = `${id}-${usedIds.size}`;
        }
        usedIds.add(id);
        
        // 设置ID属性
        heading.setAttribute('id', id);
        
        // 添加锚点样式
        heading.classList.add('scroll-mt-20');
        
        // 可选：添加可视锚点
        const htmlHeading = heading as HTMLElement;
        htmlHeading.style.position = 'relative';
        
        // 当鼠标悬停时显示锚点
        heading.addEventListener('mouseenter', () => {
          const anchor = heading.querySelector('.heading-anchor');
          if (anchor) {
            anchor.classList.remove('opacity-0');
            anchor.classList.add('opacity-100');
          }
        });
        
        heading.addEventListener('mouseleave', () => {
          const anchor = heading.querySelector('.heading-anchor');
          if (anchor) {
            anchor.classList.remove('opacity-100');
            anchor.classList.add('opacity-0');
          }
        });
        
        // 添加可点击的锚点链接
        if (!heading.querySelector('.heading-anchor')) {
          const anchor = document.createElement('a');
          anchor.href = `#${id}`;
          anchor.className = 'heading-anchor absolute -left-5 opacity-0 text-blue-500 transition-opacity';
          anchor.textContent = '#';
          anchor.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.pushState(null, '', `#${id}`);
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          });
          
          heading.prepend(anchor);
        }
      });
    }
  }, [isHTML, processedHTML]);

  // 自定义组件映射
  const components = {
    // 标题处理，添加ID和样式
    h1: ({ node, ...props }: any) => {
      // 生成ID (如果没有，则使用标题文本生成)
      const text = typeof props.children === 'string' 
        ? props.children 
        : Array.isArray(props.children) 
          ? props.children.join('') 
          : '';
      
      const id = props.id || text
        .toLowerCase()
        .replace(/\s+/g, '-') // 空格替换为-
        .replace(/[^\w\-]/g, '') // 移除特殊字符
        .replace(/\-+/g, '-'); // 多个-替换为单个-
      
      return (
        <h1 
          {...props} 
          id={id} 
          className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700" 
        />
      );
    },
    h2: ({ node, ...props }: any) => {
      // 生成ID (如果没有，则使用标题文本生成)
      const text = typeof props.children === 'string' 
        ? props.children 
        : Array.isArray(props.children) 
          ? props.children.join('') 
          : '';
      
      const id = props.id || text
        .toLowerCase()
        .replace(/\s+/g, '-') // 空格替换为-
        .replace(/[^\w\-]/g, '') // 移除特殊字符
        .replace(/\-+/g, '-'); // 多个-替换为单个-
      
      return (
        <h2 
          {...props} 
          id={id} 
          className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700" 
        />
      );
    },
    h3: ({ node, ...props }: any) => {
      // 生成ID (如果没有，则使用标题文本生成)
      const text = typeof props.children === 'string' 
        ? props.children 
        : Array.isArray(props.children) 
          ? props.children.join('') 
          : '';
      
      const id = props.id || text
        .toLowerCase()
        .replace(/\s+/g, '-') // 空格替换为-
        .replace(/[^\w\-]/g, '') // 移除特殊字符
        .replace(/\-+/g, '-'); // 多个-替换为单个-
      
      return (
        <h3 
          {...props} 
          id={id} 
          className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white" 
        />
      );
    },
    h4: ({ node, ...props }: any) => {
      // 生成ID (如果没有，则使用标题文本生成)
      const text = typeof props.children === 'string' 
        ? props.children 
        : Array.isArray(props.children) 
          ? props.children.join('') 
          : '';
      
      const id = props.id || text
        .toLowerCase()
        .replace(/\s+/g, '-') // 空格替换为-
        .replace(/[^\w\-]/g, '') // 移除特殊字符
        .replace(/\-+/g, '-'); // 多个-替换为单个-
      
      return (
        <h4 
          {...props} 
          id={id} 
          className="text-lg font-semibold mt-5 mb-2 text-gray-900 dark:text-white" 
        />
      );
    },
    
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

  // HTML直接渲染的CSS样式
  const htmlContentStyles = `
    .blog-content h1 { 
      font-size: 2rem;
      font-weight: 700;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    .dark .blog-content h1 { color: #f9fafb; border-color: #374151; }
    
    .blog-content h2 { 
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    .dark .blog-content h2 { color: #f9fafb; border-color: #374151; }
    
    .blog-content h3 { 
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: #1f2937;
    }
    .dark .blog-content h3 { color: #f9fafb; }
    
    .blog-content h4 { 
      font-size: 1.125rem;
      font-weight: 600;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      color: #1f2937;
    }
    .dark .blog-content h4 { color: #f9fafb; }
    
    .blog-content p { 
      margin-bottom: 1rem;
      color: #4b5563;
      line-height: 1.7;
    }
    .dark .blog-content p { color: #d1d5db; }
    
    .blog-content ul, .blog-content ol { 
      margin-bottom: 1.5rem;
      margin-left: 1.5rem;
      color: #4b5563;
    }
    .dark .blog-content ul, .dark .blog-content ol { color: #d1d5db; }
    
    .blog-content ul { list-style-type: disc; }
    .blog-content ol { list-style-type: decimal; }
    
    .blog-content li { 
      margin-bottom: 0.5rem;
      line-height: 1.7;
    }
    
    .blog-content blockquote {
      margin: 1.5rem 0;
      padding: 0.5rem 1rem;
      border-left: 4px solid #3b82f6;
      background-color: #eff6ff;
      border-radius: 0 0.25rem 0.25rem 0;
      font-style: italic;
      color: #4b5563;
    }
    .dark .blog-content blockquote { 
      border-color: #60a5fa; 
      background-color: rgba(37, 99, 235, 0.2);
      color: #d1d5db;
    }
    
    .blog-content a {
      color: #2563eb;
      text-decoration: none;
    }
    .blog-content a:hover { text-decoration: underline; }
    .dark .blog-content a { color: #3b82f6; }
    
    .blog-content code {
      background-color: #f3f4f6;
      border-radius: 0.25rem;
      padding: 0.25rem 0.375rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 0.875rem;
      color: #1f2937;
    }
    .dark .blog-content code { background-color: #1f2937; color: #e5e7eb; }
    
    .blog-content pre {
      margin: 1.5rem 0;
      background-color: #1f2937;
      border-radius: 0.375rem;
      padding: 1rem;
      overflow-x: auto;
      color: #e5e7eb;
    }
    .dark .blog-content pre { background-color: #111827; }
    
    .blog-content img {
      max-width: 100%;
      height: auto;
      border-radius: 0.375rem;
      margin: 1.5rem auto;
      display: block;
    }
    
    .blog-content hr {
      margin: 2rem 0;
      border: 0;
      border-top: 1px solid #e5e7eb;
    }
    .dark .blog-content hr { border-color: #374151; }
    
    .blog-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      overflow: hidden;
    }
    .dark .blog-content table { border-color: #374151; }
    
    .blog-content th {
      background-color: #f9fafb;
      color: #4b5563;
      font-weight: 600;
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .dark .blog-content th { background-color: #1f2937; color: #e5e7eb; border-color: #374151; }
    
    .blog-content td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
      color: #4b5563;
    }
    .dark .blog-content td { border-color: #374151; color: #d1d5db; }
    
    .blog-content tr:last-child td { border-bottom: none; }
    
    .blog-content tr:nth-child(even) {
      background-color: #f9fafb;
    }
    .dark .blog-content tr:nth-child(even) { background-color: #1f2937; }
  `;

  return (
    <div className={cn("prose prose-lg max-w-none dark:prose-invert", className)}>
      {isHTML ? (
        <>
          <style>{htmlContentStyles}</style>
          <div 
            ref={contentRef}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: processedHTML }} 
          />
        </>
      ) : (
        <ReactMarkdown
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      )}
    </div>
  );
} 