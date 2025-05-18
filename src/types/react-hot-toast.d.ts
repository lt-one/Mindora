// 为react-hot-toast库创建类型声明
declare module 'react-hot-toast' {
  import { ReactNode } from 'react';

  export interface ToastOptions {
    id?: string;
    icon?: ReactNode;
    duration?: number;
    ariaProps?: {
      role: string;
      'aria-live': string;
    };
    className?: string;
    style?: React.CSSProperties;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    iconTheme?: {
      primary: string;
      secondary: string;
    };
  }

  export interface ToasterProps {
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    toastOptions?: ToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
  }

  export const Toaster: React.FC<ToasterProps>;

  export function toast(message: ReactNode, options?: ToastOptions): string;
  
  toast.success = (message: ReactNode, options?: ToastOptions): string => '';
  toast.error = (message: ReactNode, options?: ToastOptions): string => '';
  toast.loading = (message: ReactNode, options?: ToastOptions): string => '';
  toast.custom = (element: ReactNode, options?: ToastOptions): string => '';
  toast.dismiss = (toastId?: string): void => {};

  export default toast;
} 