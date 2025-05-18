/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! 警告 !!
    // 忽略TypeScript错误以允许构建成功
    // 请尽快解决类型错误
    ignoreBuildErrors: true,
  },
  transpilePackages: ['axios', 'axios-cookiejar-support', 'tough-cookie', 'framer-motion'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "192.168.155.143:3000"],
      bodySizeLimit: "2mb"
    }
  },
  outputFileTracingExcludes: {
    '**': ['./src/generated/prisma/**/*']
  },
  webpack: (config, { isServer, webpack }) => {
    // 处理Node.js模块，使其在浏览器环境中不报错
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
        child_process: false,
      };
      
      // 为 Buffer 添加 polyfill
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
      
      // 处理 node: 协议导入
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:crypto': 'crypto-browserify',
        'node:stream': 'stream-browserify',
        'node:buffer': 'buffer',
        'node:util': 'util',
        'node:path': false,
        'node:os': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;