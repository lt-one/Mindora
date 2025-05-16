/**
 * 博客系统类型定义文件
 * 定义博客相关的类型和接口
 */

/**
 * 博客分类类型
 */
export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  image?: string;
  order?: number;
  count?: number;
};

/**
 * 博客标签类型
 */
export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  color?: string;
};

/**
 * 博客作者类型
 */
export type BlogAuthor = {
  name: string;
  avatar: string;
  bio?: string;
  email?: string;
  social?: {
    github?: string;
    website?: string;
  };
};

/**
 * 文章SEO信息
 */
export type BlogSEO = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
};

/**
 * 目录项类型
 */
export type TOCItem = {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
};

/**
 * 博客文章类型
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  author: BlogAuthor;
  categories: string[];
  tags: string[];
  featured: boolean;
  status: 'published' | 'draft';
  readingTime: string;
  viewCount: number;
  toc: TOCItem[];
  relatedPosts?: string[];
  seo?: BlogSEO;
  contentType: 'article' | 'tutorial' | 'note' | 'case-study';
}

/**
 * 评论类型
 */
export interface BlogComment {
  id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    website?: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  parentId?: string;
  status: 'approved' | 'pending' | 'spam';
  likes: number;
} 