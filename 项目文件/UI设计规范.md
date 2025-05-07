# UI设计规范

## 文档信息

- **项目名称**：MindBreak个人网站
- **文档版本**：V1.0
- **更新日期**：2023-11-05
- **负责人**：UI设计师

## 1. 概述

本文档定义了MindBreak个人网站的设计规范，旨在确保整个网站的视觉一致性、品牌识别度和良好的用户体验。设计规范涵盖了颜色系统、排版规范、组件样式、图标规范、响应式设计原则等内容，为前端开发提供详细的设计指南。

## 2. 品牌识别

### 2.1 品牌色彩

主要品牌颜色：科技蓝（#3B82F6）和纯黑（#000000）的搭配，代表专业、现代和技术感。

### 2.2 品牌标识

- **Logo尺寸**：在不同场景下的最小尺寸规范
  - 导航栏：高度40px
  - 页脚：高度30px
  - 收藏夹图标：32x32px

- **Logo空间**：Logo周围需保持至少其高度1/2的空白区域

- **错误使用示例**：
  - 不要改变Logo比例
  - 不要改变Logo颜色（除非使用官方定义的单色版本）
  - 不要在复杂背景上使用Logo

## 3. 颜色系统

### 3.1 主色板

| 颜色名称 | 颜色值 | 示例 | 用途 |
|---------|-------|------|------|
| 品牌蓝 | #3B82F6 | █ | 主要强调色、交互元素 |
| 品牌蓝-浅 | #93C5FD | █ | 次要强调、背景 |
| 品牌蓝-深 | #1D4ED8 | █ | 悬停状态 |
| 纯黑 | #000000 | █ | 主要文本 |
| 深灰 | #374151 | █ | 次要文本 |
| 中灰 | #6B7280 | █ | 描述文本 |
| 浅灰 | #E5E7EB | █ | 边框、分割线 |
| 白色 | #FFFFFF | █ | 背景、文本 |

### 3.2 功能色板

| 颜色名称 | 颜色值 | 示例 | 用途 |
|---------|-------|------|------|
| 成功绿 | #10B981 | █ | 成功状态、完成操作 |
| 警告黄 | #F59E0B | █ | 警告信息、需要注意 |
| 错误红 | #EF4444 | █ | 错误状态、删除操作 |
| 信息蓝 | #3B82F6 | █ | 信息提示 |

### 3.3 暗色模式色板

| 颜色名称 | 颜色值 | 示例 | 用途 |
|---------|-------|------|------|
| 暗色背景 | #0F172A | █ | 主背景 |
| 暗色背景-次级 | #1E293B | █ | 卡片、组件背景 |
| 暗色文本-主要 | #F3F4F6 | █ | 主要文本 |
| 暗色文本-次要 | #94A3B8 | █ | 次要文本 |
| 暗色边框 | #334155 | █ | 边框、分割线 |

### 3.4 渐变色

| 渐变名称 | 渐变值 | 示例 | 用途 |
|---------|-------|------|------|
| 主要渐变 | linear-gradient(45deg, #3B82F6, #1D4ED8) | █ | 主要按钮、重点区域 |
| 次要渐变 | linear-gradient(45deg, #93C5FD, #3B82F6) | █ | 次要强调区域 |
| 背景渐变 | linear-gradient(180deg, #F9FAFB, #F3F4F6) | █ | 页面背景 |

## 4. 排版系统

### 4.1 字体家族

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-mono: 'Fira Code', 'Roboto Mono', 'Courier New', monospace;
--font-serif: 'Merriweather', 'Georgia', serif;
```

- **Sans-serif**：用于大部分UI文本
- **Monospace**：用于代码展示
- **Serif**：用于博客文章内容

中文字体兼容：

```css
--font-sans-cn: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
--font-serif-cn: 'Merriweather', 'Noto Serif SC', 'SimSun', serif;
```

### 4.2 字体大小

基于1rem = 16px的比例系统：

| 类名 | 大小 | 用途 |
|------|------|------|
| text-xs | 0.75rem (12px) | 极小文本、脚注 |
| text-sm | 0.875rem (14px) | 小文本、次要信息 |
| text-base | 1rem (16px) | 正文文本 |
| text-lg | 1.125rem (18px) | 大号正文 |
| text-xl | 1.25rem (20px) | 小标题 |
| text-2xl | 1.5rem (24px) | 中标题 |
| text-3xl | 1.875rem (30px) | 大标题 |
| text-4xl | 2.25rem (36px) | 页面主标题 |
| text-5xl | 3rem (48px) | 展示性标题 |
| text-6xl | 3.75rem (60px) | 特大号标题 |

### 4.3 行高

| 类名 | 值 | 用途 |
|------|------|------|
| leading-none | 1 | 展示性标题 |
| leading-tight | 1.25 | 标题元素 |
| leading-snug | 1.375 | 短文本 |
| leading-normal | 1.5 | 正文文本 |
| leading-relaxed | 1.625 | 长段落 |
| leading-loose | 2 | 特殊强调文本 |

### 4.4 字重

| 类名 | 值 | 用途 |
|------|------|------|
| font-light | 300 | 轻量文本 |
| font-normal | 400 | 正常文本 |
| font-medium | 500 | 中等强调 |
| font-semibold | 600 | 次级标题 |
| font-bold | 700 | 主要标题 |
| font-extrabold | 800 | 特殊强调 |

### 4.5 文本样式示例

- **页面标题**：
  ```css
  font-family: var(--font-sans);
  font-size: 2.25rem; /* text-4xl */
  font-weight: 700; /* font-bold */
  line-height: 1.25; /* leading-tight */
  color: #000000; /* 明亮模式 */
  color: #F3F4F6; /* 暗色模式 */
  ```

- **章节标题**：
  ```css
  font-family: var(--font-sans);
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  line-height: 1.25; /* leading-tight */
  color: #1F2937; /* 明亮模式 */
  color: #E5E7EB; /* 暗色模式 */
  ```

- **正文文本**：
  ```css
  font-family: var(--font-sans);
  font-size: 1rem; /* text-base */
  font-weight: 400; /* font-normal */
  line-height: 1.5; /* leading-normal */
  color: #374151; /* 明亮模式 */
  color: #D1D5DB; /* 暗色模式 */
  ```

- **代码块**：
  ```css
  font-family: var(--font-mono);
  font-size: 0.875rem; /* text-sm */
  line-height: 1.5; /* leading-normal */
  background-color: #F3F4F6; /* 明亮模式 */
  background-color: #1E293B; /* 暗色模式 */
  padding: 1rem;
  border-radius: 0.25rem;
  ```

## 5. 空间系统

### 5.1 间距比例

基于0.25rem (4px)的8点网格系统：

| 类名 | 值 | 用途 |
|------|------|------|
| space-0 | 0 | 无间距 |
| space-1 | 0.25rem (4px) | 最小间距，图标内部 |
| space-2 | 0.5rem (8px) | 紧凑元素间距 |
| space-3 | 0.75rem (12px) | 小型元素间距 |
| space-4 | 1rem (16px) | 标准元素间距 |
| space-6 | 1.5rem (24px) | 相关组件间距 |
| space-8 | 2rem (32px) | 章节间距 |
| space-12 | 3rem (48px) | 大型区块间距 |
| space-16 | 4rem (64px) | 页面板块间距 |
| space-20 | 5rem (80px) | 主要页面区域间距 |

### 5.2 内边距

常用内边距组合：

- 小型组件：padding: 0.5rem (8px)
- 标准卡片：padding: 1rem (16px)
- 大型区块：padding: 1.5rem (24px)
- 页面区域：padding: 2rem (32px)

### 5.3 外边距

常用外边距组合：

- 内联元素：margin: 0 0.25rem (0 4px)
- 段落间距：margin-bottom: 1rem (16px)
- 章节间距：margin-bottom: 2rem (32px)
- 页面区域：margin-bottom: 4rem (64px)

## 6. 边框与圆角

### 6.1 边框宽度

| 类名 | 值 | 用途 |
|------|------|------|
| border-0 | 0 | 无边框 |
| border | 1px | 标准边框 |
| border-2 | 2px | 中等强调边框 |
| border-4 | 4px | 高强调边框 |

### 6.2 边框样式

| 样式 | 用途 |
|------|------|
| solid | 标准边框 |
| dashed | 虚线边框，用于拖放区域 |
| dotted | 点状边框，用于辅助指示 |

### 6.3 边框颜色

- 默认边框：#E5E7EB (明亮模式)，#334155 (暗色模式)
- 强调边框：#3B82F6 (品牌蓝)
- 错误边框：#EF4444 (错误红)

### 6.4 圆角

| 类名 | 值 | 用途 |
|------|------|------|
| rounded-none | 0 | 无圆角 |
| rounded-sm | 0.125rem (2px) | 小圆角 |
| rounded | 0.25rem (4px) | 标准圆角 |
| rounded-md | 0.375rem (6px) | 中等圆角 |
| rounded-lg | 0.5rem (8px) | 大圆角 |
| rounded-xl | 0.75rem (12px) | 超大圆角 |
| rounded-2xl | 1rem (16px) | 特大圆角 |
| rounded-full | 9999px | 圆形 |

## 7. 阴影系统

| 类名 | 值 | 用途 |
|------|------|------|
| shadow-sm | 0 1px 2px 0 rgba(0, 0, 0, 0.05) | 微小阴影 |
| shadow | 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) | 标准阴影 |
| shadow-md | 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) | 中等阴影 |
| shadow-lg | 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) | 大阴影 |
| shadow-xl | 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) | 特大阴影 |
| shadow-2xl | 0 25px 50px -12px rgba(0, 0, 0, 0.25) | 超大阴影 |

## 8. 组件规范

### 8.1 按钮

#### 8.1.1 按钮尺寸

| 尺寸 | 高度 | 内边距 | 文本大小 | 用途 |
|------|------|--------|---------|------|
| xs | 24px | 0.5rem (8px) | 0.75rem (12px) | 紧凑界面 |
| sm | 32px | 0.75rem (12px) | 0.875rem (14px) | 小型按钮 |
| md | 40px | 1rem (16px) | 1rem (16px) | 标准按钮 |
| lg | 48px | 1.25rem (20px) | 1.125rem (18px) | 主要按钮 |
| xl | 56px | 1.5rem (24px) | 1.25rem (20px) | 特大按钮 |

#### 8.1.2 按钮变体

- **主要按钮**：
  ```css
  background-color: #3B82F6;
  color: white;
  font-weight: 500;
  border-radius: 0.25rem;
  ```

- **次要按钮**：
  ```css
  background-color: white;
  color: #3B82F6;
  border: 1px solid #3B82F6;
  font-weight: 500;
  border-radius: 0.25rem;
  ```

- **文本按钮**：
  ```css
  background-color: transparent;
  color: #3B82F6;
  font-weight: 500;
  ```

- **危险按钮**：
  ```css
  background-color: #EF4444;
  color: white;
  font-weight: 500;
  border-radius: 0.25rem;
  ```

- **成功按钮**：
  ```css
  background-color: #10B981;
  color: white;
  font-weight: 500;
  border-radius: 0.25rem;
  ```

#### 8.1.3 按钮状态

- **悬停状态**：降低不透明度至90%或使用略深颜色
- **聚焦状态**：添加焦点环（focus ring）
- **活动状态**：使用更深颜色
- **禁用状态**：降低不透明度至50%，移除交互效果

### 8.2 输入框

#### 8.2.1 输入框尺寸

| 尺寸 | 高度 | 内边距 | 文本大小 | 用途 |
|------|------|--------|---------|------|
| sm | 32px | 0.5rem (8px) | 0.875rem (14px) | 小型输入框 |
| md | 40px | 0.75rem (12px) | 1rem (16px) | 标准输入框 |
| lg | 48px | 1rem (16px) | 1.125rem (18px) | 大型输入框 |

#### 8.2.2 输入框状态

- **默认状态**：
  ```css
  border: 1px solid #E5E7EB;
  border-radius: 0.25rem;
  ```

- **聚焦状态**：
  ```css
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  ```

- **错误状态**：
  ```css
  border-color: #EF4444;
  ```

- **禁用状态**：
  ```css
  background-color: #F3F4F6;
  color: #6B7280;
  cursor: not-allowed;
  ```

### 8.3 卡片

#### 8.3.1 基本卡片

```css
background-color: white;
border-radius: 0.5rem;
padding: 1rem;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
```

#### 8.3.2 卡片变体

- **无阴影卡片**：只有边框，无阴影
- **轻量卡片**：较小内边距，适合紧凑布局
- **强调卡片**：带有品牌色边框或上边缘

### 8.4 导航

#### 8.4.1 导航栏

- 高度：64px（桌面），48px（移动端）
- 背景：白色（明亮模式），#0F172A（暗色模式）
- 阴影：shadow-sm

#### 8.4.2 导航链接

- 默认状态：中灰色文本
- 激活状态：品牌蓝文本，可选下划线或底部指示器
- 悬停状态：深灰色文本

### 8.5 徽章与标签

#### 8.5.1 徽章尺寸

- 小型：高度20px，内边距0.25rem，文本0.75rem
- 标准：高度24px，内边距0.5rem, 文本0.875rem

#### 8.5.2 徽章变体

- **默认徽章**：浅灰背景，深灰文本
- **主色徽章**：品牌蓝背景，白色文本
- **成功徽章**：成功绿背景，白色文本
- **警告徽章**：警告黄背景，白色文本
- **错误徽章**：错误红背景，白色文本

## 9. 图标系统

### 9.1 图标大小

| 尺寸名称 | 大小 | 用途 |
|---------|------|------|
| icon-xs | 12px | 极小场景，如表格操作 |
| icon-sm | 16px | 小型图标，常用于文本内联 |
| icon-md | 20px | 标准图标大小 |
| icon-lg | 24px | 大型图标，用于强调 |
| icon-xl | 32px | 特大图标，用于特殊场景 |

### 9.2 图标样式

- 线条风格：2px线宽，圆角端点
- 填充风格：用于激活/选中状态
- 颜色使用：主要使用中灰或品牌蓝

### 9.3 图标集合

使用 [Heroicons](https://heroicons.com/) [iconfont](https://www.iconfont.cn/)以及作为主要图标库。

## 10. 响应式设计

### 10.1 断点定义

| 断点名称 | 宽度范围 | 目标设备 |
|---------|---------|---------|
| xs | < 640px | 小型手机 |
| sm | 640px - 767px | 大型手机 |
| md | 768px - 1023px | 平板 |
| lg | 1024px - 1279px | 小型笔记本 |
| xl | 1280px - 1535px | 大型笔记本 |
| 2xl | ≥ 1536px | 桌面显示器 |

### 10.2 响应式原则

- 采用移动优先设计
- 关键内容保持可见
- 避免水平滚动
- 触摸目标至少44x44px
- 优先考虑单列布局，逐渐扩展为多列

### 10.3 常见布局调整

- **导航**：
  - 移动端：汉堡菜单或底部导航
  - 桌面端：顶部水平导航或侧边栏

- **内容卡片**：
  - 移动端：单列，宽度100%
  - 平板：双列，各50%宽度
  - 桌面端：三列或四列

- **表单**：
  - 移动端：垂直堆叠的输入字段
  - 桌面端：水平排列或多列布局

## 11. 动效设计

### 11.1 过渡动画

| 类型 | 持续时间 | 缓动函数 | 用途 |
|------|---------|---------|------|
| 快速 | 150ms | ease-in-out | 微交互，按钮悬停 |
| 标准 | 250ms | ease-in-out | 组件状态变化 |
| 中等 | 350ms | ease-in-out | 显示/隐藏内容 |
| 慢速 | 500ms | ease-in-out | 强调性动画 |

### 11.2 常用动效

- **淡入/淡出**：opacity: 0 → 1
- **滑入/滑出**：transform: translateY(10px) → translateY(0)
- **放大/缩小**：transform: scale(0.95) → scale(1)
- **旋转**：transform: rotate(-5deg) → rotate(0)

### 11.3 动效原则

- 简洁自然，避免过度动画
- 提供视觉反馈，增强交互感
- 动效需有意义，不要为动效而动效
- 考虑无障碍性，提供减少动画选项

## 12. 可访问性指南

### 12.1 色彩对比度

- 小文本（< 18pt）：对比度至少 4.5:1
- 大文本（≥ 18pt）：对比度至少 3:1
- UI组件和图形对象：对比度至少 3:1

### 12.2 焦点样式

保留清晰的焦点指示器，通常为蓝色轮廓：

```css
:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

### 12.3 替代文本

- 确保所有图片有 alt 属性
- 确保所有UI控件有适当的标签
- 使用 aria-label 为非文本内容提供描述

### 12.4 键盘导航

- 所有交互元素可通过键盘访问
- 保持逻辑的Tab顺序
- 提供明确的焦点指示器

## 13. 视觉资产规范

### 13.1 图片规范

- **主图与横幅**：
  - 桌面端：1920×1080px
  - 移动端：750×1334px
  - 文件格式：首选WebP，备选JPG/PNG
  - 文件大小：< 200KB

- **缩略图**：
  - 标准尺寸：400×300px
  - 纵横比：4:3或16:9
  - 文件大小：< 50KB

- **个人照片/头像**：
  - 标准尺寸：300×300px
  - 形状：圆形或圆角矩形
  - 文件大小：< 30KB

### 13.2 插图风格

- 统一的插图风格，保持视觉一致性
- 优先使用矢量插图（SVG格式）
- 配色符合网站主色调

### 13.3 背景纹理

- 保持简洁，不干扰前景内容
- 低对比度，不分散用户注意力

## 14. 组件示例

### 14.1 导航栏

```html
<nav class="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
  <div class="flex items-center">
    <img src="/logo.svg" alt="MindBreak Logo" class="h-10">
    <div class="hidden md:flex ml-6 space-x-4">
      <a href="/" class="text-blue-600 font-medium">首页</a>
      <a href="/projects" class="text-gray-600 hover:text-gray-900">项目</a>
      <a href="/blog" class="text-gray-600 hover:text-gray-900">博客</a>
      <a href="/dashboard" class="text-gray-600 hover:text-gray-900">数据</a>
      <a href="/todo" class="text-gray-600 hover:text-gray-900">Todo</a>
      <a href="/about" class="text-gray-600 hover:text-gray-900">关于</a>
      <a href="/contact" class="text-gray-600 hover:text-gray-900">联系</a>
    </div>
  </div>
  <div class="flex items-center">
    <button class="bg-blue-600 text-white py-2 px-4 rounded">联系我</button>
  </div>
</nav>
```

### 14.2 卡片组件

```html
<div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
  <h3 class="text-xl font-semibold text-gray-900 mb-2">卡片标题</h3>
  <p class="text-gray-700 mb-4">这是卡片内容，展示了标准卡片样式。</p>
  <div class="flex justify-end">
    <button class="text-blue-600 font-medium hover:text-blue-800">阅读更多</button>
  </div>
</div>
```

### 14.3 按钮系列

```html
<div class="space-y-4">
  <!-- 主要按钮 -->
  <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
    主要按钮
  </button>
  
  <!-- 次要按钮 -->
  <button class="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded">
    次要按钮
  </button>
  
  <!-- 文本按钮 -->
  <button class="text-blue-600 hover:text-blue-800 font-medium">
    文本按钮
  </button>
  
  <!-- 危险按钮 -->
  <button class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded">
    危险按钮
  </button>
</div>
```

### 14.4 表单元素

```html
<form class="space-y-4">
  <!-- 输入框 -->
  <div>
    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
    <input type="text" id="name" class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
  </div>
  
  <!-- 文本域 -->
  <div>
    <label for="message" class="block text-sm font-medium text-gray-700 mb-1">留言</label>
    <textarea id="message" rows="4" class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"></textarea>
  </div>
  
  <!-- 选择框 -->
  <div>
    <label for="category" class="block text-sm font-medium text-gray-700 mb-1">分类</label>
    <select id="category" class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
      <option>选项一</option>
      <option>选项二</option>
      <option>选项三</option>
    </select>
  </div>
  
  <!-- 复选框 -->
  <div class="flex items-center">
    <input type="checkbox" id="agree" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
    <label for="agree" class="ml-2 text-sm text-gray-700">我同意条款</label>
  </div>
  
  <!-- 提交按钮 -->
  <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
    提交
  </button>
</form>
```

## 15. 设计系统实现指南

### 15.1 使用Tailwind CSS实现

本设计系统将主要通过Tailwind CSS实现，关键步骤：

1. 在tailwind.config.js中配置主题扩展：

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 主色板
        'brand-blue': '#3B82F6',
        'brand-blue-light': '#93C5FD',
        'brand-blue-dark': '#1D4ED8',
        // 功能色
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        mono: ['Fira Code', 'Roboto Mono', 'Courier New', 'monospace'],
        serif: ['Merriweather', 'Noto Serif SC', 'SimSun', 'serif'],
      },
      boxShadow: {
        // 自定义阴影
      },
      // 其他自定义配置
    }
  },
  // 插件和其他配置
}
```

2. 创建组件库并使用配置的主题变量

### 15.2 辅助实现工具

- 使用Storybook记录和展示组件库
- 创建共享的布局组件
- 使用CSS变量实现暗色模式切换

<!-- ## 16. 附录

### 16.1 设计资源链接

- Figma设计文件: [链接]
- 品牌素材库: [链接]
- 图标资源: [链接] -->

### 16.2 设计决策记录

记录主要设计决策的原因和背景，便于团队理解设计意图。

### 16.3 设计核对清单

用于确保设计实现符合规范的检查清单。

---

此文档将随项目进展不断更新和完善。设计团队和开发团队应共同维护此规范，确保视觉和交互的一致性。 