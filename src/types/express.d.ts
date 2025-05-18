declare module 'bcryptjs';
declare module 'jsonwebtoken';

import { User, Session, Verification } from '@prisma/client';

// 扩展 User 类型
declare global {
  namespace PrismaClient {
    interface User extends User {
      isActive: boolean;
      role: string;
      emailVerified: Date | null;
      refreshToken: string | null;
      tokenExpiry: Date | null;
      lastLogin: Date | null;
    }
  }
} 