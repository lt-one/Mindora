/**
 * 项目类型定义文件
 * 定义项目相关的类型和接口
 */

/**
 * 项目类别类型
 */
export type ProjectCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  order?: number;
};

/**
 * 技术标签类型
 */
export type TechnologyTag = {
  id: string;
  name: string;
  slug: string;
  category?: string;
  icon?: string;
  color?: string;
};

/**
 * 项目类型
 */
export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  thumbnailUrl: string;
  images: string[];
  videoUrl?: string;
  demoUrl?: string;
  sourceCodeUrl?: string;
  technologies: string[];
  categories: string[];
  featured: boolean;
  highlightColor?: string;
  completionDate: string;
  duration?: string;
  role?: string;
  client?: string;
  challenges?: string[];
  solutions?: string[];
  results?: string[];
  relatedProjects?: string[];
  relatedPosts?: string[];
  order?: number;
} 