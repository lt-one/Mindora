'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  onReset?: () => void;
  uploadType?: 'blog' | 'avatar' | 'project';
}

export default function ImageUploader({ 
  onImageUpload, 
  currentImage, 
  onReset,
  uploadType = 'blog'
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 处理拖放事件
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  // 处理文件选择
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };
  
  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    // 重置错误状态
    setUploadError(null);
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setUploadError('请上传图片文件');
      toast.error('请上传图片文件');
      return;
    }
    
    // 检查文件大小 (限制为2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('图片大小不能超过2MB');
      toast.error('图片大小不能超过2MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log('开始上传图片:', file.name, '类型:', uploadType);
      
      // 创建FormData对象
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);
      
      // 发送请求到上传API
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      console.log('上传响应状态:', response.status);
      
      const data = await response.json();
      console.log('上传响应数据:', data);
      
      if (!response.ok) {
        throw new Error(data.error || '上传失败');
      }
      
      if (data.success && data.url) {
        const imageUrl = data.url;
        console.log('图片上传成功, URL:', imageUrl);
        setPreview(imageUrl);
        onImageUpload(imageUrl);
        toast.success('图片上传成功');
      } else {
        throw new Error(data.error || '上传失败');
      }
    } catch (error) {
      console.error('上传图片出错:', error);
      setUploadError(error.message || '上传失败，请重试');
      toast.error('上传图片失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };
  
  // 使用本地预览（不上传到服务器）- 临时解决方案
  const handleLocalPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageUpload(result); // 注意：这只是临时的本地URL
      toast.success('已使用本地预览图片');
    };
    reader.readAsDataURL(file);
  };
  
  // 重置预览和图片
  const handleReset = () => {
    setPreview(null);
    setUploadError(null);
    if (onReset) {
      onReset();
    }
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 根据上传类型设置样式
  const getContainerStyle = () => {
    if (uploadType === 'avatar') {
      return 'aspect-square rounded-full overflow-hidden';
    }
    return '';
  };
  
  return (
    <div className={`space-y-4 ${getContainerStyle()}`}>
      {/* 图片上传区域 */}
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            uploadType === 'avatar' ? 'rounded-full aspect-square flex items-center justify-center' : ''
          } ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : uploadError 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                : 'border-gray-300 dark:border-gray-700'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileSelect}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileInputChange}
          />
          
          <div className="flex flex-col items-center justify-center space-y-2">
            {uploadError ? (
              <AlertCircle className="h-8 w-8 text-red-500" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            
            <p className="text-sm font-medium">
              {isUploading 
                ? '正在上传...' 
                : uploadError
                  ? uploadError
                  : uploadType === 'avatar' ? '上传头像' : '点击或拖放图片到此处上传'}
            </p>
            {uploadType !== 'avatar' && (
            <p className="text-xs text-gray-500">
              支持 JPG, PNG, GIF 格式，最大2MB
            </p>
            )}
          </div>
        </div>
      ) : (
        <Card className={`relative overflow-hidden ${uploadType === 'avatar' ? 'rounded-full aspect-square' : ''}`}>
          <div className={`relative ${uploadType === 'avatar' ? 'h-full w-full' : 'h-40 w-full'}`}>
            <Image
              src={preview}
              alt="预览图"
              className={`object-cover ${uploadType === 'avatar' ? 'rounded-full' : ''}`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              onError={() => {
                console.error('图片加载失败:', preview);
                setPreview('/images/avatars/default.png');
              }}
            />
          </div>
          
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleReset}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      )}
    </div>
  );
} 