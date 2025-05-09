"use client";

import { useEffect } from 'react';

/**
 * DOM操作保护组件
 * 解决与浏览器翻译扩展相关的React DOM操作错误
 */
export default function DOMProtection() {
  useEffect(() => {
    // 仅在浏览器环境中运行
    if (typeof window === 'undefined' || typeof Node === 'undefined') return;

    // 防止重复修改
    if ((window as any).__DOM_PROTECTION_APPLIED__) return;
    (window as any).__DOM_PROTECTION_APPLIED__ = true;

    try {
      // 保护removeChild方法
      const originalRemoveChild = Node.prototype.removeChild;
      // 使用类型断言解决泛型约束问题
      (Node.prototype as any).removeChild = function(child: Node): Node {
        if (child.parentNode !== this) {
          console.warn('React DOM操作错误: 尝试移除非子节点元素', child, this);
          return child;
        }
        return originalRemoveChild.call(this, child);
      };
      
      // 保护insertBefore方法
      const originalInsertBefore = Node.prototype.insertBefore;
      // 使用类型断言解决泛型约束问题
      (Node.prototype as any).insertBefore = function(newNode: Node, referenceNode: Node | null): Node {
        if (referenceNode && referenceNode.parentNode !== this) {
          console.warn('React DOM操作错误: 参考节点不是当前节点的子节点', referenceNode, this);
          return newNode;
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
      };

      console.log('DOM操作保护已启用');
    } catch (error) {
      console.error('启用DOM操作保护时出错:', error);
    }
  }, []);

  // 该组件不渲染任何内容
  return null;
} 