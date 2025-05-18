'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft,
  Eye, 
  Edit, 
  Trash, 
  Tag, 
  FileText
} from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BlogManagementClient() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 获取博客文章列表
  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/blog/posts');
      
      if (!response.ok) {
        throw new Error('获取文章列表失败');
      }
      
      const data = await response.json();
      setBlogPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取文章失败');
      toast.error('获取文章列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 删除博客文章
  const deletePost = async (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      try {
        const response = await fetch(`/api/admin/blog/posts/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('删除文章失败');
        }
        
        // 移除已删除的文章
        setBlogPosts(blogPosts.filter(post => post.id !== id));
        toast.success('文章已成功删除');
      } catch (err) {
        toast.error('删除文章失败');
      }
    }
  };
  
  // 查看博客文章
  const viewPost = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };
  
  // 编辑博客文章
  const editPost = (id: string) => {
    router.push(`/admin/content/blog/edit/${id}`);
  };

  // 筛选文章
  const filteredPosts = blogPosts
    .filter(post => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'published') return post.status === 'published';
      if (statusFilter === 'draft') return post.status === 'draft';
      return true;
    })
    .filter(post => {
      if (!searchTerm) return true;
      
      const search = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(search) ||
        (post.tags as string[]).some(tag => tag.toLowerCase().includes(search)) ||
        (post.excerpt?.toLowerCase().includes(search))
      );
    });

  // 分页
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // 页码切换
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // 初始加载
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return (
    <div>
      <div className="mb-8">
        {/* 返回链接 */}
        <Link 
          href="/admin/content" 
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回内容管理
        </Link>
        
        {/* 标题 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">博客文章管理</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              管理博客文章，添加、编辑和删除文章内容
            </p>
          </div>
          <Link 
            href="/admin/content/blog/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            新建文章
          </Link>
        </div>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="搜索文章标题、标签或内容..." 
            className="pl-10 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">所有状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
          </select>
          
          <button 
            className="inline-flex items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            onClick={() => fetchBlogPosts()}
          >
            <Filter className="h-4 w-4 mr-2" />
            刷新
          </button>
        </div>
      </div>
      
      {/* 加载状态 */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* 错误信息 */}
      {error && !isLoading && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-md p-4 mb-6">
          <p>{error}</p>
          <button 
            onClick={() => fetchBlogPosts()}
            className="mt-2 text-sm text-red-700 dark:text-red-400 underline"
          >
            重试
          </button>
        </div>
      )}
      
      {/* 文章列表 */}
      {!isLoading && !error && (
        <>
          {filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                没有找到符合条件的文章
              </p>
              <Link
                href="/admin/content/blog/new"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                新建文章
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">标题</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">分类</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">发布日期</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">浏览量</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {post.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${post.status === 'published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                            {post.status === 'published' ? '已发布' : '草稿'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {post.categories.length > 0 ? post.categories[0] : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {post.publishedAt 
                            ? new Date(post.publishedAt).toLocaleDateString('zh-CN') 
                            : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {post.viewCount}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              onClick={() => viewPost(post.slug)}
                              title="查看文章"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                              onClick={() => editPost(post.id)}
                              title="编辑文章"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              onClick={() => deletePost(post.id)}
                              title="删除文章"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 分页 */}
              {totalPages > 1 && (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button 
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      上一页
                    </button>
                    <button 
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      下一页
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        显示 <span className="font-medium">{indexOfFirstPost + 1}</span> 到 <span className="font-medium">{Math.min(indexOfLastPost, filteredPosts.length)}</span> 共 <span className="font-medium">{filteredPosts.length}</span> 条结果
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span className="sr-only">上一页</span>
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(number => {
                            // 显示当前页及其前后两页，以及第一页和最后一页
                            return (
                              number === 1 ||
                              number === totalPages ||
                              Math.abs(number - currentPage) <= 1
                            );
                          })
                          .map((number, index, array) => {
                            // 添加省略号
                            if (index > 0 && array[index - 1] !== number - 1) {
                              return (
                                <span
                                  key={`ellipsis-${number}`}
                                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                  ...
                                </span>
                              );
                            }
                            return (
                              <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`relative inline-flex items-center px-4 py-2 border ${
                                  currentPage === number
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 dark:border-blue-600'
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } text-sm font-medium`}
                              >
                                {number}
                              </button>
                            );
                          })}
                        <button
                          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span className="sr-only">下一页</span>
                          <ArrowLeft className="h-5 w-5 rotate-180" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 