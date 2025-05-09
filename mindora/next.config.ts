import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // 添加eslint配置，忽略构建时的eslint错误
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 使用assetPrefix来解决ChunkLoadError问题
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  
  // webpack配置以解决其他问题
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 这里可以添加其他非publicPath相关的webpack配置
    return config;
  },
};

export default nextConfig;
