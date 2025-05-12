import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: Breadcrumb[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav aria-label="面包屑导航" className="flex py-4 mb-4">
      <ol className="flex flex-wrap items-center space-x-1">
        <li>
          <Link
            href="/"
            className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Home className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">首页</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            {item.href ? (
              <Link
                href={item.href}
                className="ml-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 text-sm text-gray-700 dark:text-gray-300 font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 