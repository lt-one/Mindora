/**
 * NextAuth API路由
 */
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

// 确保使用相同的密钥
const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET || 'mindora_default_auth_secret_key_development_only',
  debug: process.env.NODE_ENV === 'development',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  }
});

// 导出GET和POST处理器
export { handler as GET, handler as POST }; 