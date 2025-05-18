import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * 扩展 Session 类型
   * 由 useSession、getSession 返回的类型，以及SessionProvider中作为props接收的类型
   */
  interface Session {
    user: {
      /**
       * 用户ID
       */
      id: string
      /**
       * 用户角色
       */
      role: string
      /**
       * 邮箱验证时间
       */
      emailVerified: Date | null
    } & DefaultSession["user"]
  }

  /**
   * 扩展默认的User类型
   */
  interface User {
    /**
     * 用户ID
     */
    id: string
    /**
     * 用户角色
     */
    role: string
    /**
     * 邮箱验证时间
     */
    emailVerified?: Date | null
  }
}

declare module "next-auth/jwt" {
  /**
   * 扩展JWT类型
   * 由jwt回调返回，使用JWT会话时由getToken返回
   */
  interface JWT {
    /**
     * 用户ID
     */
    id: string
    /**
     * 用户角色
     */
    role: string
    /**
     * 邮箱验证时间
     */
    emailVerified?: Date | null
  }
} 