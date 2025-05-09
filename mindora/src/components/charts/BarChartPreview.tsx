"use client";

const BarChartPreview = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-center p-4">
        <div className="mb-4 text-gray-400 dark:text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 3v18h18"></path>
            <path d="M20 16H8"></path>
            <path d="M20 12H6"></path>
            <path d="M20 8h-3"></path>
            <path d="M4 8v12"></path>
            <path d="M8 5v15"></path>
            <path d="M12 10v10"></path>
            <path d="M16 7v13"></path>
          </svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          图表功能建设中...
        </p>
      </div>
    </div>
  );
};

export default BarChartPreview; 