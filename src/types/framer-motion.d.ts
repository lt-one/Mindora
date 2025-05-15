/**
 * framer-motion类型声明扩展
 */
import { HTMLMotionProps as OriginalHTMLMotionProps } from 'framer-motion';

declare module 'framer-motion' {
  // 扩展HTMLMotionProps类型，确保它包含所有React中DOM元素原生属性
  interface HTMLMotionProps<T extends keyof JSX.IntrinsicElements> 
    extends OriginalHTMLMotionProps<T>, 
      React.HTMLAttributes<Element> {
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler;
    key?: React.Key;
    children?: React.ReactNode;
  }
} 