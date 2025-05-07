# GitHub仓库设置指南

## 一、创建GitHub仓库

1. 登录GitHub账户
2. 点击右上角的"+"图标，选择"New repository"
3. 填写仓库信息:
   - Repository name: Mindora
   - Description: 个人网站项目，包含博客、项目展示、数据仪表盘和Todo应用等功能
   - 选择"Public"公开仓库
   - 勾选"Add a README file"
   - 点击"Create repository"按钮

## 二、推送本地代码到GitHub

确保您已经在本地初始化了Git仓库并提交了更改，然后执行以下命令：

```bash
# 添加远程仓库链接(替换YOUR_USERNAME为您的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/Mindora.git

# 同步README文件
git pull origin main --allow-unrelated-histories

# 推送代码到主分支
git push -u origin main
```

如果您使用的是SSH密钥认证：

```bash
git remote add origin git@github.com:YOUR_USERNAME/Mindora.git
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 三、GitHub仓库结构说明

推送完成后，您的GitHub仓库将包含以下文件：

- **README.md** - 项目概述和基本信息
- **FEATURES.md** - 详细功能说明
- **SETUP.md** - 安装和运行说明
- **ROADMAP.md** - 项目开发计划
- **.gitignore** - Git忽略文件配置
- **package.json** - 项目依赖和脚本
- **next.config.js** - Next.js配置

## 四、访问GitHub Pages (可选)

如果您想启用GitHub Pages来展示项目文档：

1. 在GitHub仓库页面，点击"Settings"
2. 滚动到"GitHub Pages"部分
3. 在"Source"下拉菜单中选择"main"分支
4. 点击"Save"按钮

设置完成后，您的项目文档将可以通过以下URL访问：
https://YOUR_USERNAME.github.io/Mindora/

## 五、设置项目Issues和Milestones

为了更好地管理项目进展：

1. 点击仓库的"Issues"标签
2. 点击"Milestones"子标签
3. 点击"New milestone"创建以下里程碑：
   - v0.2: 核心功能完善
   - v0.5: 用户系统和CMS
   - v1.0: 稳定发布版

然后可以根据ROADMAP.md中的计划创建相应的Issues并关联到对应的里程碑。 