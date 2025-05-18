'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Tag,
  Eye, 
  Trash,
  Plus,
  X,
  Check,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { BlogPost, BlogPostCreateInput, BlogPostUpdateInput } from '@/types/blog';
import TiptapEditor from './TiptapEditor';
import ImageUploader from './ImageUploader';

// shadcn/ui组件
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// 定义常量
const MAX_TITLE_LENGTH = 100;
const MAX_EXCERPT_LENGTH = 200;
const MIN_CONTENT_LENGTH = 50;

interface BlogEditorProps {
  initialData?: BlogPost;
  isEditing: boolean;
}

export default function BlogEditor({ initialData, isEditing }: BlogEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    tags: string[];
    categories: string[];
    status: 'published' | 'draft';
    featured: boolean;
    metaDescription: string;
    seoKeywords: string;
    authorId: string;
  }>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    coverImage: initialData?.coverImage || '',
    tags: initialData?.tags || [],
    categories: initialData?.categories || [],
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
    metaDescription: initialData?.metaDescription || '',
    seoKeywords: initialData?.seoKeywords || '',
    authorId: initialData?.author?.id || '',
  });

  // 新增：表单验证状态
  const [errors, setErrors] = useState<{
    title?: string;
    slug?: string;
    content?: string;
  }>({});
  
  // 新增：现有的标签和分类
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [isLoadingTaxonomies, setIsLoadingTaxonomies] = useState(false);

  // 标签和分类输入
  const [tagInput, setTagInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  // 新增：获取作者列表
  const [authors, setAuthors] = useState<Array<{
    id: string;
    name: string;
    email: string;
    image?: string;
    bio?: string;
    role?: string;
  }>>([]);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);

  // 获取作者列表
  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoadingAuthors(true);
      
      try {
        const response = await fetch('/api/admin/blog/authors');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.data.authors) {
            setAuthors(data.data.authors);
          } else {
            console.log('获取作者列表失败:', data.error || '未知错误');
          }
        } else {
          console.log('获取作者API调用失败');
        }
      } catch (error) {
        console.error('获取作者列表出错:', error);
      } finally {
        setIsLoadingAuthors(false);
      }
    };
    
    fetchAuthors();
  }, []);

  // 新增：获取现有的标签和分类
  useEffect(() => {
    const fetchTaxonomies = async () => {
      setIsLoadingTaxonomies(true);
      
      try {
        const response = await fetch('/api/admin/blog/taxonomies');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            // 改进的处理逻辑，确保即使是空数组也能正确处理
            const tags = (data.data.tags && data.data.tags.length > 0) 
              ? data.data.tags 
              : ['技术', 'Web开发', 'React', 'Next.js', '前端'];
              
            // 如果没有分类，添加一些默认分类
            const categories = (data.data.categories && data.data.categories.length > 0)
              ? data.data.categories
              : ['编程', '设计', '教程', '思考'];
              
            setExistingTags(tags);
            setExistingCategories(categories);
            
            console.log('获取到的标签:', tags);
            console.log('获取到的分类:', categories);
          } else {
            // 设置默认值
            setExistingTags(['技术', 'Web开发', 'React', 'Next.js', '前端']);
            setExistingCategories(['编程', '设计', '教程', '思考']);
            console.log('API返回失败，使用默认标签和分类');
          }
        } else {
          // API调用失败，使用默认值
          setExistingTags(['技术', 'Web开发', 'React', 'Next.js', '前端']);
          setExistingCategories(['编程', '设计', '教程', '思考']);
          console.log('API调用失败，使用默认标签和分类');
        }
      } catch (error) {
        console.error('获取标签和分类失败:', error);
        // 发生错误时使用默认值
        setExistingTags(['技术', 'Web开发', 'React', 'Next.js', '前端']);
        setExistingCategories(['编程', '设计', '教程', '思考']);
      } finally {
        setIsLoadingTaxonomies(false);
      }
    };
    
    fetchTaxonomies();
  }, []);

  // 输入处理器
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // 验证标题长度限制
    if (name === 'title') {
      const trimmedValue = value.slice(0, MAX_TITLE_LENGTH);
      setFormData(prev => ({ ...prev, [name]: trimmedValue }));
      
      // 清除相关错误
      if (trimmedValue) {
        setErrors(prev => ({ ...prev, title: undefined }));
      }
      return;
    }
    
    // 验证摘要长度限制
    if (name === 'excerpt') {
      const trimmedValue = value.slice(0, MAX_EXCERPT_LENGTH);
      setFormData(prev => ({ ...prev, [name]: trimmedValue }));
      return;
    }
    
    if (name === 'featured') {
      // 处理checkbox
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // 清除相关错误
      if (name === 'slug' && value) {
        setErrors(prev => ({ ...prev, slug: undefined }));
      }
    }
  };
  
  // 处理选择器变化
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理开关变化
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // 富文本编辑器处理
  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    
    // 清除相关错误
    if (content && content.length >= MIN_CONTENT_LENGTH) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
  };

  // 自动生成Slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s]/g, '')  // 保留中文、字母、数字和空格
      .replace(/\s+/g, '-')                 // 空格替换为连字符
      .replace(/[\u4e00-\u9fa5]/g, (match) => {
        // 对中文字符进行拼音转换（这里简化处理，实际应用可能需要更复杂的拼音库）
        const pinyinMap: Record<string, string> = {
          '的': 'de', '一': 'yi', '是': 'shi', '在': 'zai', '了': 'le',
          '和': 'he', '我': 'wo', '有': 'you', '为': 'wei', '这': 'zhe'
        };
        return pinyinMap[match] || match.charCodeAt(0).toString(16);
      });
  };

  // 标题改变时生成slug
  useEffect(() => {
    if (!isEditing && !formData.slug && formData.title) {
      const generatedSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
      
      // 清除相关错误
      if (generatedSlug) {
        setErrors(prev => ({ ...prev, slug: undefined }));
      }
    }
  }, [formData.title, formData.slug, isEditing]);

  // 添加标签
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
    }
    
    setTagInput('');
  };

  // 添加现有标签
  const addExistingTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  // 移除标签
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // 添加分类
  const addCategory = () => {
    if (!categoryInput.trim()) return;
    
    if (!formData.categories.includes(categoryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryInput.trim()]
      }));
    }
    
    setCategoryInput('');
  };

  // 添加现有分类
  const addExistingCategory = (category: string) => {
    if (!formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };

  // 移除分类
  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  // 新增：表单验证
  const validateForm = () => {
    const newErrors: {
      title?: string;
      slug?: string;
      content?: string;
    } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入文章标题';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = '请输入URL地址(Slug)';
    }
    
    if (!formData.content || formData.content.length < MIN_CONTENT_LENGTH) {
      newErrors.content = `请输入至少${MIN_CONTENT_LENGTH}个字的文章内容`;
    }
    
    setErrors(newErrors);
    
    // 如果没有错误，返回true
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 表单验证
    if (!validateForm()) {
      toast.error('请修正表单中的错误');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const url = isEditing
        ? `/api/admin/blog/posts/${initialData?.id}`
        : '/api/admin/blog/posts';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(isEditing ? '更新文章失败' : '创建文章失败');
      }
      
      toast.success(isEditing ? '文章已更新' : '文章创建成功');
      
      // 保存成功后跳转回博客列表页
      router.push('/admin/content/blog');
    } catch (error) {
      toast.error(isEditing ? '更新文章失败' : '创建文章失败');
      console.error('博客文章保存错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染预览
  const handlePreview = () => {
    // 保存到本地存储用于预览
    localStorage.setItem('blogPreview', JSON.stringify(formData));
    // 在新标签页中打开预览
    window.open('/blog/preview', '_blank');
  };

  // 新增：自动保存函数
  const autoSavePost = useCallback(async () => {
    // 如果不是编辑模式或没有启用自动保存，不执行保存
    if (!isEditing || !autoSaveEnabled || !initialData?.id) return;
    
    // 检查表单中是否有必要的字段
    if (!formData.title.trim() || !formData.slug.trim()) return;
    
    try {
      setIsSaving(true);
      
      const url = `/api/admin/blog/posts/${initialData.id}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'draft', // 自动保存总是保存为草稿
        }),
      });
      
      if (response.ok) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('自动保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, isEditing, initialData, autoSaveEnabled]);
  
  // 新增：设置自动保存计时器
  useEffect(() => {
    // 如果启用了自动保存，则每60秒保存一次
    if (autoSaveEnabled && isEditing) {
      // 清除之前的计时器
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
      
      // 设置新的计时器
      autoSaveTimerRef.current = setInterval(() => {
        autoSavePost();
      }, 60000); // 60秒
      
      // 组件卸载时清除计时器
      return () => {
        if (autoSaveTimerRef.current) {
          clearInterval(autoSaveTimerRef.current);
        }
      };
    } else if (autoSaveTimerRef.current) {
      // 如果禁用了自动保存，清除计时器
      clearInterval(autoSaveTimerRef.current);
    }
  }, [autoSaveEnabled, isEditing, autoSavePost]);

  // 处理图片上传
  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, coverImage: imageUrl }));
  };
  
  // 处理图片重置
  const handleImageReset = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  return (
    <div className="pb-10">
      <div className="mb-8">
        {/* 返回链接 */}
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="mb-4"
        >
          <Link href="/admin/content/blog">
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回博客列表
          </Link>
        </Button>
        
        {/* 标题 */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {isEditing ? '编辑文章' : '新建文章'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {isEditing ? '修改现有文章内容和设置' : '创建新的博客文章并发布'}
        </p>
      </div>
      
      {/* 编辑表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左侧：主要内容 */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* 标题 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <Label htmlFor="title" className="flex items-center">
                      文章标题 <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <span className="text-xs text-gray-500">
                      {formData.title.length}/{MAX_TITLE_LENGTH}
                    </span>
                  </div>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="输入文章标题"
                    maxLength={MAX_TITLE_LENGTH}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>
                
                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug" className="flex items-center">
                    URL地址 <span className="text-red-500 ml-1">*</span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      (仅使用字母、数字和连字符)
                    </span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        URL地址用于生成文章的永久链接，例如：https://yoursite.com/blog/your-slug
                      </PopoverContent>
                    </Popover>
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="article-slug"
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm">{errors.slug}</p>
                  )}
                </div>
                
                {/* 摘要 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <Label htmlFor="excerpt">
                      文章摘要
                    </Label>
                    <span className="text-xs text-gray-500">
                      {formData.excerpt.length}/{MAX_EXCERPT_LENGTH}
                    </span>
                  </div>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    placeholder="简短介绍文章内容..."
                    maxLength={MAX_EXCERPT_LENGTH}
                  />
                  <p className="text-xs text-gray-500">
                    摘要将在文章列表和分享预览中显示，若不填写将自动提取正文前200个字符
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* 富文本编辑器 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  文章内容 <span className="text-red-500 ml-1">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TiptapEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md ${errors.content ? 'border-red-500' : ''}`}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-2">{errors.content}</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* 右侧：设置 */}
          <div className="space-y-6">
            {/* 状态和设置 */}
            <Card>
              <CardHeader>
                <CardTitle>发布设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 作者选择 - 新增 */}
                <div className="space-y-2">
                  <Label htmlFor="authorId">文章作者</Label>
                  <Select 
                    value={formData.authorId} 
                    onValueChange={(value) => handleSelectChange('authorId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingAuthors ? "加载中..." : "选择作者"} />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map(author => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name} ({author.email})
                        </SelectItem>
                      ))}
                      {authors.length === 0 && !isLoadingAuthors && (
                        <SelectItem value="" disabled>
                          没有可用的作者
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* 状态 */}
                <div className="space-y-2">
                  <Label htmlFor="status">文章状态</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* 推荐 */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                  />
                  <Label htmlFor="featured">推荐文章</Label>
                </div>

                {/* 新增：自动保存设置 */}
                {isEditing && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoSave"
                        checked={autoSaveEnabled}
                        onCheckedChange={setAutoSaveEnabled}
                      />
                      <Label htmlFor="autoSave">自动保存</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="text-sm">
                          启用后每分钟自动保存为草稿
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {lastSaved && (
                      <p className="text-xs text-muted-foreground">
                        上次保存: {lastSaved.toLocaleTimeString()}
                        {isSaving && <span className="ml-2 italic">保存中...</span>}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  disabled={isSubmitting || !formData.title || !formData.content}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  预览
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? '保存中...' : '保存'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* 封面图片 */}
            <Card>
              <CardHeader>
                <CardTitle>封面图片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploader 
                  onImageUpload={handleImageUpload}
                  currentImage={formData.coverImage}
                  onReset={handleImageReset}
                />
                
                <p className="text-sm text-muted-foreground">
                  建议上传比例为16:9的图片，最佳尺寸为1200x675像素
                </p>
                
                <div className="pt-2">
                  <Label htmlFor="coverImage" className="mb-2 block">或使用图片URL</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="图片URL地址"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* 标签 */}
            <Card>
              <CardHeader>
                <CardTitle>标签</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="添加标签"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge 
                      key={tag}
                      variant="secondary"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  
                  {formData.tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      尚未添加标签
                    </p>
                  )}
                </div>

                {/* 可选标签列表 */}
                {existingTags.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">可选标签</Label>
                    <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-1">
                        {existingTags
                          .filter(tag => !formData.tags.includes(tag))
                          .map(tag => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="justify-start"
                              onClick={() => addExistingTag(tag)}
                            >
                              <Tag className="h-3 w-3 mr-2" />
                              {tag}
                            </Button>
                          ))}
                      </div>
                      
                      {existingTags.filter(tag => !formData.tags.includes(tag)).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          没有更多可选标签
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* 分类 */}
            <Card>
              <CardHeader>
                <CardTitle>分类</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder="添加分类"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  />
                  <Button
                    type="button"
                    onClick={addCategory}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map(category => (
                    <Badge 
                      key={category}
                      variant="outline"
                    >
                      {category}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => removeCategory(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  
                  {formData.categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      尚未添加分类
                    </p>
                  )}
                </div>

                {/* 可选分类列表 */}
                {existingCategories.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">可选分类</Label>
                    <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-1">
                        {existingCategories
                          .filter(category => !formData.categories.includes(category))
                          .map(category => (
                            <Button
                              key={category}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="justify-start"
                              onClick={() => addExistingCategory(category)}
                            >
                              <span className="mr-2">📁</span>
                              {category}
                            </Button>
                          ))}
                      </div>
                      
                      {existingCategories.filter(category => !formData.categories.includes(category)).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          没有更多可选分类
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* 添加SEO设置卡片 - 放在分类卡片之后 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  SEO设置
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="text-sm">
                      搜索引擎优化设置，帮助文章在搜索引擎中获得更好的排名
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Meta描述 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <Label htmlFor="metaDescription">
                      Meta描述
                    </Label>
                    <span className="text-xs text-gray-500">
                      {formData.metaDescription.length}/160
                    </span>
                  </div>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    rows={2}
                    placeholder="输入Meta描述，用于搜索引擎结果显示"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    Meta描述是显示在搜索结果中的简短介绍，建议不超过160个字符。如果留空将使用文章摘要
                  </p>
                </div>
                
                {/* SEO关键词 */}
                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">
                    SEO关键词
                  </Label>
                  <Input
                    id="seoKeywords"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleChange}
                    placeholder="输入SEO关键词，用逗号分隔"
                  />
                  <p className="text-xs text-muted-foreground">
                    关键词用于帮助搜索引擎理解文章内容，建议使用3-5个与文章内容相关的关键词，用逗号分隔
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
} 