import { NextRequest, NextResponse } from 'next/server';
import { logAccess } from './lib/edge-logger';
import { initializeServices } from './lib/init-services';
import { getToken } from 'next-auth/jwt';

// 服务初始化标识
let isServicesInitialized = false;

// 需要保护的路由前缀
const PROTECTED_ROUTES = [
  '/admin',
  '/api/admin'
];

// 认证相关路由
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/api/auth'
];

// 调试信息（仅在开发环境启用）
function debug(message: string, ...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware Debug] ${message}`, ...args);
  }
}

export async function middleware(request: NextRequest) {
  // 仅在服务器端运行时初始化服务，且只初始化一次
  if (typeof window === 'undefined' && !isServicesInitialized) {
    console.log('开始初始化应用服务...');
    initializeServices();
    isServicesInitialized = true;
  }
  
  // 获取请求信息
  const { method, url, nextUrl } = request;
  const userAgent = request.headers.get('user-agent') || undefined;
  const pathname = nextUrl.pathname;
  
  // 记录请求开始时间
  const start = Date.now();
  
  // 跳过对静态资源的检查
  if (
    pathname.includes('/_next/') || 
    pathname.includes('/public/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // 跳过对API路由的检查，除了admin相关API - 避免会话检查循环
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }
  
  // 检查是否需要认证保护
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  
  // 防止无限循环重定向 - 检查URL是否包含特定参数
  const hasRedirectPrevent = nextUrl.searchParams.has('prevent_redirect');
  
  try {
    // 获取会话令牌 - 修改配置以确保正确读取
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || 'mindora_default_auth_secret_key_development_only',
      secureCookie: process.env.NODE_ENV === 'production',
      cookieName: 'next-auth.session-token',
    });
    
    // 调试令牌信息
    if (process.env.NODE_ENV === 'development') {
      debug('令牌信息:', token ? {
        email: token.email,
        role: token.role,
        exp: token.exp ? new Date(Number(token.exp) * 1000).toISOString() : 'undefined'
      } : 'null');
    }
    
    // 保护的路由 - 检查认证
    if (isProtectedRoute) {
      if (!token) {
        // 记录访问拒绝日志
        logAccess(
          method, 
          pathname, 
          401, 
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown', 
          userAgent,
          '未授权访问'
        );
        
        debug('未授权访问，重定向到登录页', pathname);
        
        // 保存原始URL，以便登录后重定向回来
        const callbackUrl = encodeURIComponent(request.url);
        const loginUrl = new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url);
        
        return NextResponse.redirect(loginUrl);
      }
      
      // 检查角色权限（如果路径以/admin开头，则需要admin角色）
      if (pathname.startsWith('/admin') && token.role !== 'admin') {
        // 记录访问拒绝日志
        logAccess(
          method, 
          pathname, 
          403, 
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown', 
          userAgent,
          '权限不足'
        );
        
        debug('权限不足，重定向到首页', { role: token.role, requiredRole: 'admin' });
        
        // 重定向到首页或错误页
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // 用户已认证且有权限，继续访问
      const response = NextResponse.next();
      
      // 添加缓存控制头，确保每次请求都会到服务器验证
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      
      return response;
    }
    
    // 已登录用户访问登录页时，重定向到首页
    if (isAuthRoute && pathname === '/auth/login' && token) {
      debug('用户已登录，重定向离开登录页:', token.email);
      
      // 判断用户角色，管理员跳转到管理页面，其他用户跳转到首页
      const redirectUrl = token.role === 'admin' ? '/admin' : '/';
      
      // 重定向并确保不缓存
      const response = NextResponse.redirect(new URL(redirectUrl, request.url));
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      
      return response;
    }
  } catch (error) {
    console.error('认证检查错误:', error);
    
    // 发生错误时，记录错误但不中断用户体验
    if (isProtectedRoute && process.env.NODE_ENV === 'development') {
      console.error('令牌验证错误:', error);
    }
  }
  
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
  
  // 对认证相关路由添加缓存控制 - 强化缓存控制
  if (isAuthRoute || isProtectedRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  // 记录访问日志
  logAccess(
    method, 
    pathname, 
    200, // 中间件无法获取真实状态码，使用默认200
    ip, 
    userAgent
  );
  
  return response;
}

// 应用中间件的路由匹配
export const config = {
  matcher: [
    /*
     * 匹配所有不是静态资源的路径:
     * - 不匹配以下路径:
     *   - /_next/ (Next.js内部路径)
     *   - /public/ (静态资源)
     *   - .*\\.(.*) (文件扩展名，如图片、CSS等)
     */
    {
      source: '/((?!_next/|public/|.*\\..*|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
}; 