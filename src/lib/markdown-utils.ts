import { TOCItem } from '@/types/blog';

/**
 * 从Markdown内容中解析生成TOC目录结构
 * @param markdown Markdown格式的文本内容或HTML内容
 * @returns 目录结构数组
 */
export function parseTOC(markdown: string): TOCItem[] {
  if (!markdown || typeof markdown !== 'string') return [];
  
  // 检查内容类型
  const isHTML = markdown.indexOf('<h') !== -1 && markdown.indexOf('</h') !== -1;
  
  // 如果是HTML格式，尝试直接解析HTML标题
  if (isHTML) {
    console.log('[TOC] 检测到HTML格式内容，使用HTML解析模式');
    return parseHTMLTOC(markdown);
  }
  
  // 匹配所有标题行 # 到 ######
  const headingRegex = /^\s*(#{1,6})\s+(.+?)(?:\s*{#([^}]+)})?$/gm;
  const headings: TOCItem[] = [];
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length; // # 的数量表示级别
    const text = match[2].trim();
    
    // 生成ID (如果有自定义id，使用它；否则使用文本生成)
    let id = match[3] || generateIdFromText(text);
    
    headings.push({
      id,
      text,
      level,
      children: []
    });
  }
  
  // 重新组织层级结构
  return buildTOCHierarchy(headings);
}

/**
 * 从文本生成有效的ID
 * @param text 文本内容
 * @returns 生成的ID
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

/**
 * 解析HTML内容中的标题元素
 * @param html HTML内容
 * @returns 扁平的TOC项数组
 */
function parseHTMLTOC(html: string): TOCItem[] {
  // 匹配HTML标题标签，不论是否有style属性或其他属性
  // 注意：这个正则表达式可以匹配带有任意属性的h1-h6标签
  const headingRegex = /<h([1-6])(?:[^>]*?)(?:id=['"]([^'"]+)['"])?[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings: TOCItem[] = [];
  let match;
  let uniqueIds = new Set<string>(); // 用于跟踪已使用的ID
  
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    let id = match[2] || '';
    const rawText = match[3];
    
    // 移除HTML标签获取纯文本
    const text = rawText.replace(/<[^>]+>/g, '').trim();
    
    if (!text) continue; // 跳过空文本
    
    // 如果没有ID属性，则从文本生成一个
    if (!id) {
      id = generateIdFromText(text);
    }
    
    // 确保ID唯一
    if (uniqueIds.has(id)) {
      id = `${id}-${uniqueIds.size}`;
    }
    uniqueIds.add(id);
    
    headings.push({
      id,
      text,
      level,
      children: []
    });
  }
  
  console.log(`[TOC] 从HTML中解析到${headings.length}个标题`);
  if (headings.length > 0) {
    headings.forEach((h, i) => console.log(`[TOC] 标题${i+1}: ${h.text} (id: ${h.id}, level: ${h.level})`));
  }
  
  // 重新组织层级结构
  return buildTOCHierarchy(headings);
}

/**
 * 构建层级结构的目录
 * @param headings 扁平的标题数组
 * @returns 层级结构的目录
 */
function buildTOCHierarchy(headings: TOCItem[]): TOCItem[] {
  if (headings.length === 0) return [];
  
  const result: TOCItem[] = [];
  const stack: TOCItem[] = [];
  
  // 找到最小标题级别作为基准
  let minLevel = 6;
  headings.forEach(h => {
    if (h.level < minLevel) minLevel = h.level;
  });
  
  headings.forEach(heading => {
    // 调整所有标题级别，使最小级别为2
    const adjustedLevel = Math.max(2, heading.level - minLevel + 2);
    const item = { ...heading, level: adjustedLevel, children: [] };
    
    // 清理栈，直到找到当前标题的父级
    while (
      stack.length > 0 && 
      stack[stack.length - 1].level >= item.level
    ) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      // 顶级标题
      result.push(item);
    } else {
      // 子标题
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    }
    
    stack.push(item);
  });
  
  return result;
} 