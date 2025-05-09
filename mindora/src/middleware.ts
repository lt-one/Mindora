import { NextRequest, NextResponse } from 'next/server';
import { logAccess } from './lib/edge-logger';

export function middleware(request: NextRequest) {
  // 获取请求信息
  const { method, url, nextUrl } = request;
  const userAgent = request.headers.get('user-agent') || undefined;
  const pathname = nextUrl.pathname;
  
  // 记录请求开始时间
  const start = Date.now();
  
  // 创建响应
  const response = NextResponse.next();
  
  // 获取IP (Next.js 14中可以通过请求头获取)
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // 添加处理时间的响应头（仅开发环境）
  if (process.env.NODE_ENV !== 'production') {
    const duration = Date.now() - start;
    response.headers.set('X-Response-Time', `${duration}ms`);
  }
  
  // 记录访问日志 (在next.js中间件中无法使用waitUntil)
  logAccess(
    method, 
    pathname, 
    200, // 中间件无法获取真实状态码，使用默认200
    ip, 
    userAgent
  );
  
  return response;
}

// 仅对应用请求应用中间件，忽略静态资源
export const config = {
  matcher: [
    /*
     * 匹配所有不是静态资源的路径:
     * - 不匹配以下路径:
     *   - /_next/ (Next.js内部路径)
     *   - /public/ (静态资源)
     *   - .*\\.(.*) (文件扩展名，如图片、CSS等)
     *   - /api/auth (认证API)
     */
    {
      source: '/((?!_next/|public/|.*\\..*|api/auth).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
}; 