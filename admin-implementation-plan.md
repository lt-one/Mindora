# Mindora 管理系统实施方案

*作者: 系统架构团队*
*日期: 2025年5月22日*

## 背景

目前Mindora项目的管理后台已经有了UI界面设计，但缺乏与实际网站内容交互的功能。为了使管理系统真正能够控制影响网站内容，需要开发完整的内容管理功能。

## 实施目标

将管理系统从纯UI展示升级为功能完整的内容管理系统，使管理员能够：

1. 管理博客文章（创建、编辑、删除）
2. 管理项目展示（创建、编辑、删除）
3. 管理好站分享（创建、编辑、删除）
4. 管理系统设置和用户

## 技术架构

- 前端：Next.js（App Router），React，TailwindCSS
- 后端：Next.js API Routes，Prisma ORM
- 数据库：MySQL
- 认证：NextAuth.js

## 详细实施方案

### 1. 博客管理系统

#### 1.1 API功能实现

创建 `src/lib/api/admin/blog.ts`，实现以下功能：

```typescript
// 创建博客文章
export async function createBlogPost(data: BlogPostCreateInput, userId: string): Promise<BlogPost>

// 更新博客文章
export async function updateBlogPost(id: string, data: BlogPostUpdateInput): Promise<BlogPost>

// 删除博客文章
export async function deleteBlogPost(id: string): Promise<boolean>

// 获取博客文章草稿
export async function getDraftBlogPosts(): Promise<BlogPost[]>
```

#### 1.2 API路由

创建以下API路由：

1. `src/app/api/admin/blog/posts/route.ts`
   - GET：获取博客文章列表（支持筛选已发布/草稿）
   - POST：创建新博客文章

2. `src/app/api/admin/blog/posts/[id]/route.ts`
   - GET：获取单篇博客文章
   - PUT：更新博客文章
   - DELETE：删除博客文章

#### 1.3 前端组件

1. 创建 `src/components/admin/BlogManagementClient.tsx`
   - 博客文章列表管理
   - 支持搜索、筛选、分页
   - 提供删除、编辑、查看功能

2. 创建 `src/components/admin/BlogEditor.tsx`
   - 博客文章编辑器
   - 支持富文本编辑、标签和分类管理
   - 支持封面图片上传

3. 修改 `src/app/admin/content/blog/page.tsx`
   - 引入客户端组件

4. 创建新建文章页面：`src/app/admin/content/blog/new/page.tsx`

5. 创建编辑文章页面：`src/app/admin/content/blog/edit/[id]/page.tsx`

### 2. 项目管理系统

#### 2.1 API功能实现

创建 `src/lib/api/admin/projects.ts`，实现以下功能：

```typescript
// 创建项目
export async function createProject(data: ProjectCreateInput, userId: string): Promise<Project>

// 更新项目
export async function updateProject(id: string, data: ProjectUpdateInput): Promise<Project>

// 删除项目
export async function deleteProject(id: string): Promise<boolean>
```

#### 2.2 API路由

创建以下API路由：

1. `src/app/api/admin/projects/route.ts`
   - GET：获取项目列表
   - POST：创建新项目

2. `src/app/api/admin/projects/[id]/route.ts`
   - GET：获取单个项目
   - PUT：更新项目
   - DELETE：删除项目

#### 2.3 前端组件

1. 创建 `src/components/admin/ProjectManagementClient.tsx`
   - 项目列表管理
   - 支持搜索、筛选、排序

2. 创建 `src/components/admin/ProjectEditor.tsx`
   - 项目编辑器
   - 支持多图片上传
   - 支持技术标签和分类管理

3. 修改 `src/app/admin/content/projects/page.tsx`
   - 引入客户端组件

4. 创建新建项目页面：`src/app/admin/content/projects/new/page.tsx`

5. 创建编辑项目页面：`src/app/admin/content/projects/edit/[id]/page.tsx`

### 3. 好站分享管理

#### 3.1 API功能实现

创建 `src/lib/api/admin/good-sites.ts`，实现以下功能：

```typescript
// 创建好站
export async function createGoodSite(data: GoodSiteCreateInput): Promise<GoodSite>

// 更新好站
export async function updateGoodSite(id: string, data: GoodSiteUpdateInput): Promise<GoodSite>

// 删除好站
export async function deleteGoodSite(id: string): Promise<boolean>
```

#### 3.2 API路由

创建以下API路由：

1. `src/app/api/admin/good-sites/route.ts`
   - GET：获取好站列表
   - POST：创建新好站

2. `src/app/api/admin/good-sites/[id]/route.ts`
   - GET：获取单个好站
   - PUT：更新好站
   - DELETE：删除好站

#### 3.3 前端组件

1. 创建 `src/components/admin/GoodSiteManagementClient.tsx`
   - 好站列表管理
   - 支持分类筛选和搜索

2. 创建 `src/components/admin/GoodSiteEditor.tsx`
   - 好站编辑器
   - 支持标签管理和截图上传

3. 修改 `src/app/admin/content/sites/page.tsx`
   - 引入客户端组件

4. 创建新建好站页面：`src/app/admin/content/sites/new/page.tsx`

5. 创建编辑好站页面：`src/app/admin/content/sites/edit/[id]/page.tsx`

### 4. 系统设置管理

#### 4.1 API功能实现

创建 `src/lib/api/admin/settings.ts`，实现以下功能：

```typescript
// 获取系统设置
export async function getSystemSettings(): Promise<SystemSettings>

// 更新系统设置
export async function updateSystemSettings(data: SystemSettingsUpdateInput): Promise<SystemSettings>
```

#### 4.2 API路由

创建以下API路由：

1. `src/app/api/admin/settings/route.ts`
   - GET：获取系统设置
   - PUT：更新系统设置

#### 4.3 前端组件

1. 创建 `src/components/admin/SettingsClient.tsx`
   - 系统设置管理界面
   - 分类显示不同设置项
   - 支持保存更改

2. 修改 `src/app/admin/settings/page.tsx`
   - 引入客户端组件

### 5. 用户管理系统

#### 5.1 API功能实现

创建 `src/lib/api/admin/users.ts`，实现以下功能：

```typescript
// 获取用户列表
export async function getUsers(options?: UserQueryOptions): Promise<User[]>

// 创建用户
export async function createUser(data: UserCreateInput): Promise<User>

// 更新用户
export async function updateUser(id: string, data: UserUpdateInput): Promise<User>

// 删除用户
export async function deleteUser(id: string): Promise<boolean>
```

#### 5.2 API路由

创建以下API路由：

1. `src/app/api/admin/users/route.ts`
   - GET：获取用户列表
   - POST：创建新用户

2. `src/app/api/admin/users/[id]/route.ts`
   - GET：获取单个用户
   - PUT：更新用户
   - DELETE：删除用户

#### 5.3 前端组件

1. 创建 `src/components/admin/UserManagementClient.tsx`
   - 用户列表管理
   - 支持角色筛选和搜索

2. 创建 `src/components/admin/UserEditor.tsx`
   - 用户编辑器
   - 支持角色和权限管理

3. 修改 `src/app/admin/users/page.tsx`
   - 引入客户端组件

## 安全性考虑

1. 所有管理API需要进行身份验证和权限检查
2. 实现中间件，确保只有管理员角色可以访问管理页面和API
3. 确保用户输入的数据进行验证和清理，防止XSS和SQL注入

## 实施顺序

为确保项目平稳实施，建议按以下顺序进行：

1. 博客管理系统
2. 项目管理系统
3. 好站分享管理
4. 系统设置管理
5. 用户管理系统

## 扩展功能（后续）

1. 图片上传到云存储（如AWS S3或阿里云OSS）
2. 富文本编辑器集成（支持Markdown和HTML）
3. 内容版本历史和回滚功能
4. 内容审核和工作流
5. 数据导入导出功能
6. 数据统计和分析仪表板 