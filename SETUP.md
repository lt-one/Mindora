# Mindora 项目安装与运行指南

## 环境要求
- Node.js 18.0.0 或更高版本
- MySQL 8.0 或更高版本
- npm 9.0.0 或更高版本

## 安装步骤

### 1. 克隆仓库
```bash
git clone https://github.com/用户名/Mindora.git
cd Mindora
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
创建`.env`文件，并添加以下内容：
```
# 数据库连接
DATABASE_URL="mysql://用户名:密码@localhost:3306/mindora_db"

# 应用设置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 数据库初始化
运行Prisma迁移命令生成数据库表结构：
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. 启动开发服务器
```bash
npm run dev
```
开发服务器将在 http://localhost:3000 启动

## 项目构建与部署

### 构建项目
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 常见问题解决

### 数据库连接问题
- 确保MySQL服务正在运行
- 验证数据库连接字符串中的用户名和密码是否正确
- 检查数据库是否已创建

### 依赖安装失败
- 尝试清除npm缓存: `npm cache clean --force`
- 使用`--legacy-peer-deps`选项: `npm install --legacy-peer-deps`

### 静态资源问题
- 确保`public`目录下的所有资源正确引用
- 检查图片路径是否使用正确的格式

## 开发提示

### 生成新的Prisma客户端
当修改了数据库模型后，需要重新生成Prisma客户端：
```bash
npx prisma generate
```

### 添加新的数据库迁移
创建新的数据库变更：
```bash
npx prisma migrate dev --name 变更名称
```

### 刷新数据库（开发环境）
重置数据库并应用所有迁移：
```bash
npx prisma migrate reset
```

## 项目结构说明

### 核心目录
- `/src/app` - 页面组件和路由 (Next.js App Router)
- `/src/components` - 可复用UI组件
- `/src/lib` - 工具函数、API和业务逻辑
- `/prisma` - 数据库模型定义

### 特殊文件
- `next.config.js` - Next.js配置
- `tailwind.config.js` - Tailwind CSS配置
- `prisma/schema.prisma` - 数据库模型定义 