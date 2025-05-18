'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// 导入图标组件
import { User, Mail, Shield, FileText, X, Camera } from 'lucide-react';

// 导入头像上传组件
import ImageUploader from './ImageUploader';

// 用户类型定义
type UserFormData = {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string | null;
  isActive: boolean;
  image: string | null;
};

interface UserEditFormProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const roleOptions = [
  { id: 'admin', name: '管理员' },
  { id: 'editor', name: '编辑' },
  { id: 'user', name: '普通用户' }
];

export default function UserEditForm({ userId, isOpen, onClose, onSuccess }: UserEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    id: '',
    name: '',
    email: '',
    role: 'user',
    bio: '',
    isActive: true,
    image: null
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 加载用户数据
  useEffect(() => {
    if (isOpen && userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/admin/users/${userId}`);
          
          if (!response.ok) {
            throw new Error('获取用户数据失败');
          }
          
          const { user } = await response.json();
          setFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio || '',
            isActive: user.isActive,
            image: user.image
          });
        } catch (err) {
          console.error('获取用户数据错误:', err);
          toast.error('加载用户数据失败');
        } finally {
          setLoading(false);
        }
      };
      
      fetchUser();
    } else if (isOpen) {
      // 如果是新建用户，重置表单
      setFormData({
        id: '',
        name: '',
        email: '',
        role: 'user',
        bio: '',
        isActive: true,
        image: null
      });
    }
  }, [isOpen, userId]);

  // 处理图片上传
  const handleImageUpload = (imageUrl: string) => {
    setFormData({
      ...formData,
      image: imageUrl
    });
  };

  // 重置图片
  const handleResetImage = () => {
    setFormData({
      ...formData,
      image: null
    });
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 清除错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // 处理开关变化
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // 验证表单
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入用户名';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.role) {
      newErrors.role = '请选择用户角色';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const url = userId 
        ? `/api/admin/users/${userId}`
        : '/api/admin/users';
      
      const method = userId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '保存用户数据失败');
      }
      
      toast.success(userId ? '用户信息已更新' : '用户创建成功');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('保存用户数据错误:', err);
      toast.error(err.message || '保存用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {userId ? '编辑用户' : '新建用户'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* 用户头像上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                用户头像
              </label>
              <div className="flex justify-center mb-4">
                <div className="w-32">
                  <ImageUploader 
                    onImageUpload={handleImageUpload}
                    currentImage={formData.image || undefined}
                    onReset={handleResetImage}
                    uploadType="avatar"
                  />
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                点击或拖放图片到上方区域来设置头像
              </p>
            </div>

            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                用户名 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`pl-10 w-full py-2 px-4 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="输入用户名"
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 w-full py-2 px-4 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="输入邮箱地址"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* 角色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                用户角色 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`pl-10 w-full py-2 px-4 border ${
                    errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  disabled={loading}
                >
                  <option value="">选择角色</option>
                  {roleOptions.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* 个人简介 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                个人简介
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-2 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="pl-10 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="输入用户简介（可选）"
                  disabled={loading}
                />
              </div>
            </div>

            {/* 状态 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleSwitchChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                账号激活
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? '保存中...' : (userId ? '保存修改' : '创建用户')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 