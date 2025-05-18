'use client';

/**
 * 管理后台 - 用户管理页面
 */
import { 
  User, 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash, 
  Shield, 
  Mail,
  Key,
  MoreHorizontal,
  Check,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// 导入自定义组件
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import UserEditForm from '@/components/admin/UserEditForm';

// 用户类型定义
type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  image?: string | null;
  bio?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
};

// 用户角色配置
const userRoles = [
  { id: 'admin', name: '管理员', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  { id: 'editor', name: '编辑', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'user', name: '用户', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' }
];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // 对话框状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] = useState(false);
  const [actionUserId, setActionUserId] = useState<string>('');
  const [statusDialogMessage, setStatusDialogMessage] = useState<string>('');
  
  // 获取用户数据
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        
        if (!response.ok) {
          throw new Error('获取用户数据失败');
        }
        
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.error('获取用户列表错误:', err);
        setError('获取用户数据失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // 过滤用户列表
  const filteredUsers = users.filter(user => {
    // 搜索过滤
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 角色过滤
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    // 状态过滤
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // 处理编辑用户
  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setEditDialogOpen(true);
  };
  
  // 打开新建用户对话框
  const handleNewUser = () => {
    setSelectedUserId(null);
    setEditDialogOpen(true);
  };
  
  // 处理重置密码
  const openResetPasswordDialog = (userId: string) => {
    setActionUserId(userId);
    setIsResetPasswordDialogOpen(true);
  };
  
  const handleResetPassword = async () => {
    try {
      const response = await fetch(`/api/admin/users/${actionUserId}/reset-password`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('重置密码失败');
      }
      
      const data = await response.json();
      
      // 显示密码重置链接（仅开发环境）
      if (data.resetUrl) {
        toast.success(`密码重置链接已生成，已发送到用户邮箱`);
        console.log('密码重置链接:', data.resetUrl); // 开发环境下在控制台显示
      } else {
        toast.success('密码重置链接已发送到用户邮箱');
      }
    } catch (err) {
      console.error('重置密码错误:', err);
      toast.error('重置密码失败，请稍后再试');
    } finally {
      setIsResetPasswordDialogOpen(false);
    }
  };
  
  // 处理删除用户
  const openDeleteDialog = (userId: string) => {
    setActionUserId(userId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${actionUserId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('删除用户失败');
      }
      
      // 更新用户列表
      setUsers(users.filter(user => user.id !== actionUserId));
      toast.success('用户已成功删除');
    } catch (err) {
      console.error('删除用户错误:', err);
      toast.error('删除用户失败，请稍后再试');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };
  
  // 处理切换用户状态
  const openToggleStatusDialog = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setActionUserId(userId);
      setStatusDialogMessage(user.isActive ? '确定要禁用该用户吗？' : '确定要激活该用户吗？');
      setIsToggleStatusDialogOpen(true);
    }
  };
  
  const handleToggleStatus = async () => {
    try {
      const response = await fetch(`/api/admin/users/${actionUserId}/toggle-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '切换用户状态失败');
      }
      
      const data = await response.json();
      
      // 更新用户列表
      setUsers(users.map(user => 
        user.id === actionUserId 
          ? { ...user, isActive: data.user.isActive } 
          : user
      ));
      
      toast.success(data.message || '用户状态已更新');
    } catch (err) {
      console.error('切换用户状态错误:', err);
      toast.error('切换用户状态失败，请稍后再试');
    } finally {
      setIsToggleStatusDialogOpen(false);
    }
  };

  // 刷新用户列表
  const refreshUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error('刷新用户数据失败');
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.error('刷新用户列表错误:', err);
      toast.error('刷新用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">用户管理</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          管理用户账号、角色和权限设置
        </p>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* 工具栏 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="搜索用户名、邮箱..." 
            className="pl-10 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">所有角色</option>
            <option value="admin">管理员</option>
            <option value="editor">编辑</option>
            <option value="user">用户</option>
          </select>
          
          <select 
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">所有状态</option>
            <option value="active">激活</option>
            <option value="inactive">禁用</option>
          </select>
          
          <button 
            className="inline-flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            onClick={handleNewUser}
          >
            <Plus className="h-4 w-4 mr-2" />
            新建用户
          </button>
        </div>
      </div>
      
      {/* 用户统计 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                总用户数
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400 mr-4">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter(user => user.role === 'admin').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                管理员
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 mr-4">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter(user => user.isActive).length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                激活用户
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full text-gray-600 dark:text-gray-400 mr-4">
              <X className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter(user => !user.isActive).length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                禁用用户
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 用户列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">用户</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">邮箱</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">角色</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">最后登录</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    加载中...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    没有找到符合条件的用户
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full" 
                            src={user.image || '/images/avatars/default.png'} 
                          alt={user.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          注册于: {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {userRoles.map(role => 
                      role.id === user.role && (
                        <span 
                          key={role.id}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}
                        >
                          {role.name}
                        </span>
                      )
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {user.isActive ? '激活' : '禁用'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString('zh-CN') 
                      : '从未登录'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300" 
                          title="编辑用户"
                          onClick={() => handleEditUser(user.id)}
                        >
                        <Edit className="h-4 w-4" />
                      </button>
                        <button 
                          className={`${user.isActive ? 'text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300' : 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'}`}
                          title={user.isActive ? '禁用用户' : '激活用户'}
                          onClick={() => openToggleStatusDialog(user.id)}
                        >
                          {user.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                        <button 
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" 
                          title="重置密码"
                          onClick={() => openResetPasswordDialog(user.id)}
                        >
                        <Key className="h-4 w-4" />
                      </button>
                        <button 
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" 
                          title="删除用户"
                          onClick={() => openDeleteDialog(user.id)}
                        >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 用户编辑对话框 */}
      <UserEditForm
        userId={selectedUserId}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={refreshUsers}
      />

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="删除用户"
        message="确定要删除该用户吗？此操作不可恢复！"
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteDialogOpen(false)}
        type="danger"
      />

      {/* 重置密码确认对话框 */}
      <ConfirmDialog
        isOpen={isResetPasswordDialogOpen}
        title="重置密码"
        message="确定要重置该用户的密码吗？系统将生成一个重置链接，用户可以通过该链接设置新密码。"
        confirmText="重置"
        cancelText="取消"
        onConfirm={handleResetPassword}
        onCancel={() => setIsResetPasswordDialogOpen(false)}
        type="warning"
      />

      {/* 切换状态确认对话框 */}
      <ConfirmDialog
        isOpen={isToggleStatusDialogOpen}
        title="切换用户状态"
        message={statusDialogMessage}
        confirmText="确认"
        cancelText="取消"
        onConfirm={handleToggleStatus}
        onCancel={() => setIsToggleStatusDialogOpen(false)}
        type="info"
      />
    </div>
  );
} 