"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProjectImageGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectImageGallery({ images, title }: ProjectImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  // 如果没有图片
  if (images.length === 0) {
    return null;
  }
  
  // 如果只有一张图片
  if (images.length === 1) {
    return (
      <div className="rounded-xl overflow-hidden shadow-md">
        <Image
          src={images[0]}
          alt={title}
          width={1200}
          height={675}
          className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => openLightbox(0)}
        />
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        {/* 主图 */}
        <div className="relative rounded-xl overflow-hidden shadow-md">
          <Image
            src={images[currentIndex]}
            alt={`${title} - 图片 ${currentIndex + 1}`}
            width={1200}
            height={675}
            className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => openLightbox(currentIndex)}
          />
          
          {/* 导航按钮 */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 rounded-full shadow-md backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="上一张图片"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 rounded-full shadow-md backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="下一张图片"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* 缩略图 */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? "ring-2 ring-blue-500 dark:ring-blue-400"
                  : "hover:opacity-80"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image}
                alt={`${title} - 缩略图 ${index + 1}`}
                width={200}
                height={150}
                className="w-full h-16 md:h-20 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* 灯箱 */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full z-50"
            onClick={closeLightbox}
            aria-label="关闭灯箱"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            onClick={prevImage}
            aria-label="上一张图片"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={images[currentIndex]}
              alt={`${title} - 大图 ${currentIndex + 1}`}
              width={1920}
              height={1080}
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            onClick={nextImage}
            aria-label="下一张图片"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
} 