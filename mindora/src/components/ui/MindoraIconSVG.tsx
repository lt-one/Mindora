import React from 'react';

interface MindoraIconSVGProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Mindora图标的SVG版本，适合用于favicon和PWA图标
 */
const MindoraIconSVG: React.FC<MindoraIconSVGProps> = ({
  width = 32,
  height = 32,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 背景 */}
      <rect width="32" height="32" rx="6" fill="#0F172A" />
      
      {/* M字母 */}
      <path
        d="M8 8V24L12 20L16 24L20 20L24 24V8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="url(#mindora-icon-gradient)"
      />
      
      {/* 梯度定义 */}
      <defs>
        <linearGradient
          id="mindora-icon-gradient"
          x1="8"
          y1="8"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#9C5CF6" />
          <stop offset="50%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/**
 * 获取Mindora图标的base64编码数据URL
 * 用于favicon和PWA图标
 */
export const getMindoraIconDataURL = (): string => {
  // 这是预先生成的favicon的base64编码
  return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI2IiBmaWxsPSIjMEYxNzJBIi8+PHBhdGggZD0iTTggOFYyNEwxMiAyMEwxNiAyNEwyMCAyMEwyNCAyNFY4IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlPSJ1cmwoI21pbmRvcmEtaWNvbi1ncmFkaWVudCkiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Im1pbmRvcmEtaWNvbi1ncmFkaWVudCIgeDE9IjgiIHkxPSI4IiB4Mj0iMjQiIHkyPSIyNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM5QzVDRjYiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzIyRDNFRSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzNCODJGNiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==`;
};

export default MindoraIconSVG; 