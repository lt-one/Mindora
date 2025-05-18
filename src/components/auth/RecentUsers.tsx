'use client';

import { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react';
import Image from 'next/image';

interface RecentUser {
  email: string;
  name?: string;
  image?: string;
  lastLogin: number;
}

interface RecentUsersProps {
  onSelectUser: (email: string) => void;
}

export default function RecentUsers({ onSelectUser }: RecentUsersProps) {
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const recordsJson = localStorage.getItem('recentUsers');
      if (recordsJson) {
        const parsedRecords = JSON.parse(recordsJson) as RecentUser[];
        setRecentUsers(parsedRecords.sort((a, b) => b.lastLogin - a.lastLogin).slice(0, 5));
      }
    } catch (e) {
      console.error('解析最近用户记录失败:', e);
    }
  }, []);

  if (!mounted || recentUsers.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        最近登录的账户
      </h3>
      <div className="space-y-2">
        {recentUsers.map((user) => (
          <button
            key={user.email}
            className="w-full flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => onSelectUser(user.email)}
          >
            <div className="flex-shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || '用户'}
                  width={36}
                  height={36}
                  className="rounded-full h-9 w-9"
                />
              ) : (
                <UserCircle className="h-9 w-9 text-gray-400" />
              )}
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name || user.email.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// 保存用户登录记录到localStorage的帮助函数
export function saveUserLoginRecord(user: { email?: string | null, name?: string | null, image?: string | null }) {
  if (!user.email) return;
  
  try {
    // 获取现有记录
    const recordsJson = localStorage.getItem('recentUsers');
    let records: RecentUser[] = [];
    
    if (recordsJson) {
      records = JSON.parse(recordsJson);
    }
    
    // 查找是否已存在该用户记录
    const existingIndex = records.findIndex(r => r.email === user.email);
    
    // 更新或添加记录
    const updatedRecord: RecentUser = {
      email: user.email,
      name: user.name || '',
      image: user.image || '',
      lastLogin: Date.now()
    };
    
    if (existingIndex >= 0) {
      records[existingIndex] = updatedRecord;
    } else {
      records.push(updatedRecord);
    }
    
    // 按最近登录时间排序并限制数量
    records.sort((a, b) => b.lastLogin - a.lastLogin);
    records = records.slice(0, 5); // 最多保留5个记录
    
    // 保存回localStorage
    localStorage.setItem('recentUsers', JSON.stringify(records));
  } catch (e) {
    console.error('保存用户记录失败:', e);
  }
} 