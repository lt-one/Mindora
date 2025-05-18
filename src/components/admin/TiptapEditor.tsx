'use client';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import CharacterCount from '@tiptap/extension-character-count';
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote, 
  Undo, 
  Redo, 
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Type,
  Info
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 定义常用字体
const FONT_FAMILIES = [
  { name: '默认字体', value: '' },
  { name: '宋体', value: 'SimSun, serif' },
  { name: '黑体', value: 'SimHei, sans-serif' },
  { name: '微软雅黑', value: 'Microsoft YaHei, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
];

// 定义常用颜色
const TEXT_COLORS = [
  { name: '黑色', value: '#000000' },
  { name: '深灰', value: '#333333' },
  { name: '红色', value: '#ff0000' },
  { name: '绿色', value: '#008000' },
  { name: '蓝色', value: '#0000ff' },
  { name: '黄色', value: '#ffff00' },
  { name: '紫色', value: '#800080' },
  { name: '橙色', value: '#ffa500' },
];

// 定义快捷键说明
const SHORTCUTS = [
  { key: 'Ctrl+B', description: '粗体' },
  { key: 'Ctrl+I', description: '斜体' },
  { key: 'Ctrl+U', description: '下划线' },
  { key: 'Ctrl+Shift+L', description: '左对齐' },
  { key: 'Ctrl+Shift+E', description: '居中对齐' },
  { key: 'Ctrl+Shift+R', description: '右对齐' },
  { key: 'Ctrl+Shift+J', description: '两端对齐' },
  { key: 'Ctrl+K', description: '插入链接' },
  { key: 'Ctrl+Z', description: '撤销' },
  { key: 'Ctrl+Y', description: '重做' },
  { key: 'Tab', description: '增加缩进' },
  { key: 'Shift+Tab', description: '减少缩进' },
];

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

const TiptapEditor = ({ content, onChange, className = '' }: TiptapEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [currentFontFamily, setCurrentFontFamily] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const fontPopoverRef = useRef<HTMLButtonElement>(null);
  const colorPopoverRef = useRef<HTMLButtonElement>(null);
  
  // 编辑器实例
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        validate: href => /^https?:\/\//.test(href),
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'list_item', 'blockquote'],
        defaultAlignment: 'left',
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color,
      CharacterCount,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      // 更新字符计数
      try {
        if (editor.storage.characterCount?.characters) {
          setCharacterCount(editor.storage.characterCount.characters());
        }
      } catch (error) {
        console.error("Error updating character count:", error);
        setCharacterCount(0);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // 更新当前选择的文本样式
      const fontFamily = editor.getAttributes('textStyle').fontFamily || '';
      const color = editor.getAttributes('textStyle').color || '';
      setCurrentFontFamily(fontFamily);
      setCurrentColor(color);
    },
    // 编辑器属性和快捷键处理
    editorProps: {
      attributes: {
        class: 'min-h-[300px] prose dark:prose-invert max-w-none p-4 focus:outline-none',
      },
      handleKeyDown: (view, event) => {
        // Ctrl+Shift+L: 左对齐
        if (event.ctrlKey && event.shiftKey && event.key === 'L') {
          editor?.chain().focus().setTextAlign('left').run();
          return true;
        }
        
        // Ctrl+Shift+E: 居中对齐
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
          editor?.chain().focus().setTextAlign('center').run();
          return true;
        }
        
        // Ctrl+Shift+R: 右对齐
        if (event.ctrlKey && event.shiftKey && event.key === 'R') {
          editor?.chain().focus().setTextAlign('right').run();
          return true;
        }
        
        // Ctrl+Shift+J: 两端对齐
        if (event.ctrlKey && event.shiftKey && event.key === 'J') {
          editor?.chain().focus().setTextAlign('justify').run();
          return true;
        }
        
        // 其他默认快捷键会由Tiptap自动处理
        return false;
      },
    },
  });

  // 处理图片添加
  const addImage = useCallback(() => {
    const url = window.prompt('图片URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // 处理链接添加
  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('链接URL:', previousUrl);
    
    // 取消则退出
    if (url === null) return;
    
    // 清空则移除链接
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    
    // 添加链接
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  // 设置字体
  const setFontFamily = useCallback((fontFamily: string) => {
    if (!editor) return;
    
    if (fontFamily === '') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(fontFamily).run();
    }
    
    // 关闭弹出框
    if (fontPopoverRef.current) {
      fontPopoverRef.current.click();
    }
  }, [editor]);

  // 设置颜色
  const setColor = useCallback((color: string) => {
    if (!editor) return;
    
    editor.chain().focus().setColor(color).run();
    
    // 关闭弹出框
    if (colorPopoverRef.current) {
      colorPopoverRef.current.click();
    }
  }, [editor]);

  // 处理缩进
  const handleIndent = useCallback(() => {
    if (!editor) return;
    
    // 对普通段落使用内联样式增加左边距
    const attrs = editor.getAttributes('paragraph');
    const currentMargin = attrs.style?.match(/margin-left:\s*(\d+)px/) ? 
      parseInt(attrs.style.match(/margin-left:\s*(\d+)px/)[1], 10) : 0;
    
    const newMargin = currentMargin + 20;
    editor.chain().focus().updateAttributes('paragraph', {
      style: `margin-left: ${newMargin}px`,
    }).run();
  }, [editor]);

  // 减少缩进
  const handleOutdent = useCallback(() => {
    if (!editor) return;
    
    // 对普通段落使用内联样式减少左边距
    const attrs = editor.getAttributes('paragraph');
    const currentMargin = attrs.style?.match(/margin-left:\s*(\d+)px/) ? 
      parseInt(attrs.style.match(/margin-left:\s*(\d+)px/)[1], 10) : 0;
    
    const newMargin = Math.max(0, currentMargin - 20);
    editor.chain().focus().updateAttributes('paragraph', {
      style: newMargin > 0 ? `margin-left: ${newMargin}px` : '',
    }).run();
  }, [editor]);

  // 客户端渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 工具栏按钮通用样式
  const toolbarButtonClass = "p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none";
  
  // 激活样式
  const isActive = useCallback((type: string | { textAlign?: string }, options?: Record<string, any>) => {
    if (!editor) return false;
    
    if (typeof type === 'object' && type.textAlign) {
      return editor.isActive({ textAlign: type.textAlign });
    }
    
    if (options) {
      return editor.isActive(type as string, options);
    }
    
    return editor.isActive(type as string);
  }, [editor]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`border rounded-md overflow-hidden shadow-sm admin-tiptap-editor ${className}`}>
      {editor && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
          {/* 第一行工具栏 - 段落格式和基本样式 */}
          <div className="flex flex-wrap gap-1 items-center w-full border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
            {/* 字体选择器 */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  ref={fontPopoverRef}
                  type="button"
                  className={`${toolbarButtonClass} flex items-center min-w-[120px] justify-between`}
                  title="字体"
                >
                  <span className="flex items-center">
                    <Type className="h-4 w-4 mr-1" />
                    <span className="text-sm truncate max-w-[80px]">
                      {currentFontFamily 
                        ? FONT_FAMILIES.find(font => font.value === currentFontFamily)?.name || '自定义字体' 
                        : '默认字体'}
                    </span>
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
                <div className="max-h-[300px] overflow-y-auto">
                  {FONT_FAMILIES.map((font, index) => (
                    <button
                      key={index}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        currentFontFamily === font.value ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                      onClick={() => setFontFamily(font.value)}
                      style={{ fontFamily: font.value || 'inherit' }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* 颜色选择器 */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  ref={colorPopoverRef}
                  type="button"
                  className={toolbarButtonClass}
                  title="文字颜色"
                >
                  <Palette className="h-5 w-5" style={{ color: currentColor || 'currentColor' }} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1" align="start">
                <div className="grid grid-cols-4 gap-1">
                  {TEXT_COLORS.map((color, index) => (
                    <button
                      key={index}
                      className={`w-12 h-8 border rounded-sm ${
                        currentColor === color.value ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>

            {/* 标题 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`${toolbarButtonClass} ${isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="标题1"
                  >
                    <Heading1 className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>标题1</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`${toolbarButtonClass} ${isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="标题2"
                  >
                    <Heading2 className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>标题2</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`${toolbarButtonClass} ${isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="标题3"
                  >
                    <Heading3 className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>标题3</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 缩进控制 */}
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleIndent}
                    className={toolbarButtonClass}
                    title="增加缩进 (Tab)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="7 8 11 12 7 16" />
                      <line x1="21" y1="12" x2="11" y2="12" />
                      <line x1="21" y1="6" x2="3" y2="6" />
                      <line x1="21" y1="18" x2="3" y2="18" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>增加缩进 (Tab)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleOutdent}
                    className={toolbarButtonClass}
                    title="减少缩进 (Shift+Tab)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="11 8 7 12 11 16" />
                      <line x1="21" y1="12" x2="7" y2="12" />
                      <line x1="21" y1="6" x2="3" y2="6" />
                      <line x1="21" y1="18" x2="3" y2="18" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>减少缩进 (Shift+Tab)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 快捷键帮助 */}
            <div className="ml-auto">
              <Popover open={showShortcuts} onOpenChange={setShowShortcuts}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`${toolbarButtonClass} ${showShortcuts ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="键盘快捷键"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <div className="p-4">
                    <h3 className="font-medium mb-2">键盘快捷键</h3>
                    <div className="text-sm space-y-1">
                      {SHORTCUTS.map((shortcut, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{shortcut.key}</span>
                          <span>{shortcut.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 第二行工具栏 - 格式和布局 */}
          <div className="flex flex-wrap gap-1 items-center w-full">
            {/* 文本格式 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`${toolbarButtonClass} ${isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="粗体"
                  >
                    <Bold className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>粗体 (Ctrl+B)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`${toolbarButtonClass} ${isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="斜体"
                  >
                    <Italic className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>斜体 (Ctrl+I)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`${toolbarButtonClass} ${isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="下划线"
                  >
                    <UnderlineIcon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>下划线 (Ctrl+U)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
            
            {/* 对齐方式 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`${toolbarButtonClass} ${isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="左对齐"
                  >
                    <AlignLeft className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>左对齐 (Ctrl+Shift+L)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`${toolbarButtonClass} ${isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="居中"
                  >
                    <AlignCenter className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>居中对齐 (Ctrl+Shift+E)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`${toolbarButtonClass} ${isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="右对齐"
                  >
                    <AlignRight className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>右对齐 (Ctrl+Shift+R)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`${toolbarButtonClass} ${isActive({ textAlign: 'justify' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="两端对齐"
                  >
                    <AlignJustify className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>两端对齐 (Ctrl+Shift+J)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
            
            {/* 列表 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`${toolbarButtonClass} ${isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="无序列表"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>无序列表</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`${toolbarButtonClass} ${isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="有序列表"
                  >
                    <ListOrdered className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>有序列表</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
            
            {/* 链接和图片 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={setLink}
                    className={`${toolbarButtonClass} ${isActive('link') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="插入链接"
                  >
                    <LinkIcon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>插入链接 (Ctrl+K)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={addImage}
                    className={toolbarButtonClass}
                    title="插入图片"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>插入图片</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
            
            {/* 引用和代码 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`${toolbarButtonClass} ${isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="引用"
                  >
                    <Quote className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>引用</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`${toolbarButtonClass} ${isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title="代码块"
                  >
                    <Code className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>代码块</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
            
            {/* 撤销和重做 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className={toolbarButtonClass}
                    title="撤销"
                  >
                    <Undo className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>撤销 (Ctrl+Z)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className={toolbarButtonClass}
                    title="重做"
                  >
                    <Redo className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>重做 (Ctrl+Y)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      <EditorContent editor={editor} className="bg-white dark:bg-gray-800" />
      
      {/* 状态栏 */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <div>
          {characterCount} 个字符
        </div>
        <div>
          按 <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">Ctrl+/</span> 查看所有快捷键
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor; 