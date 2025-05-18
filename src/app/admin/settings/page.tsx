/**
 * 管理后台 - 系统设置页面
 */
import { Metadata } from 'next';
import { Settings, Database, Shield, Globe, Cloud, Bell, Moon, Sun } from 'lucide-react';

export const metadata: Metadata = {
  title: '系统设置 | 管理后台',
  description: '配置系统参数和全局选项',
};

// 设置项分类
const settingCategories = [
  {
    id: 'general',
    title: '基本设置',
    icon: Settings,
    description: '网站基本信息和全局选项设置',
    settings: [
      {
        id: 'site-title',
        label: '网站标题',
        type: 'text',
        value: 'Mindora',
        description: '显示在浏览器标签和SEO中的网站名称'
      },
      {
        id: 'site-description',
        label: '网站描述',
        type: 'textarea',
        value: '个人生活、学习、工作、思考的数字花园',
        description: '用于SEO的网站简短描述'
      },
      {
        id: 'theme-mode',
        label: '默认主题模式',
        type: 'select',
        value: 'system',
        options: [
          { value: 'light', label: '浅色模式', icon: Sun },
          { value: 'dark', label: '深色模式', icon: Moon },
          { value: 'system', label: '跟随系统', icon: Settings }
        ],
        description: '默认显示的主题模式'
      }
    ]
  },
  {
    id: 'api',
    title: 'API配置',
    icon: Globe,
    description: '外部API访问配置和密钥管理',
    settings: [
      {
        id: 'api-access',
        label: 'API访问控制',
        type: 'switch',
        value: true,
        description: '是否允许外部API访问'
      },
      {
        id: 'eastmoney-api-key',
        label: '东方财富API密钥',
        type: 'password',
        value: '********',
        description: '用于访问金融数据的API密钥'
      },
      {
        id: 'api-rate-limit',
        label: 'API请求限制',
        type: 'number',
        value: 100,
        description: '每分钟允许的最大API请求数'
      }
    ]
  },
  {
    id: 'backup',
    title: '备份设置',
    icon: Cloud,
    description: '数据备份和恢复配置',
    settings: [
      {
        id: 'auto-backup',
        label: '自动备份',
        type: 'switch',
        value: true,
        description: '启用定期自动备份'
      },
      {
        id: 'backup-frequency',
        label: '备份频率',
        type: 'select',
        value: 'daily',
        options: [
          { value: 'hourly', label: '每小时' },
          { value: 'daily', label: '每天' },
          { value: 'weekly', label: '每周' },
          { value: 'monthly', label: '每月' }
        ],
        description: '自动备份执行频率'
      },
      {
        id: 'retention-days',
        label: '备份保留天数',
        type: 'number',
        value: 30,
        description: '自动备份的保留时间（天）'
      }
    ]
  },
  {
    id: 'notification',
    title: '通知设置',
    icon: Bell,
    description: '系统通知和提醒配置',
    settings: [
      {
        id: 'error-notification',
        label: '错误通知',
        type: 'switch',
        value: true,
        description: '系统错误发生时发送通知'
      },
      {
        id: 'update-notification',
        label: '更新通知',
        type: 'switch',
        value: true,
        description: '有新版本可用时发送通知'
      },
      {
        id: 'notification-email',
        label: '通知邮箱',
        type: 'email',
        value: 'admin@example.com',
        description: '接收系统通知的邮箱地址'
      }
    ]
  },
  {
    id: 'security',
    title: '安全设置',
    icon: Shield,
    description: '系统安全和访问控制设置',
    settings: [
      {
        id: 'login-attempts',
        label: '最大登录尝试次数',
        type: 'number',
        value: 5,
        description: '超过此次数后将暂时锁定账户'
      },
      {
        id: 'session-timeout',
        label: '会话超时时间',
        type: 'number',
        value: 60,
        description: '未活动状态下的会话超时时间（分钟）'
      },
      {
        id: 'two-factor-auth',
        label: '两因素认证',
        type: 'switch',
        value: false,
        description: '要求管理员使用两因素认证'
      }
    ]
  }
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">系统设置</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          配置系统参数、API接入和全局选项
        </p>
      </div>
      
      {/* 设置分类 */}
      <div className="space-y-6">
        {settingCategories.map((category) => (
          <div 
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-blue-600 dark:text-blue-400 mr-3">
                  <category.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {category.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {category.settings.map((setting) => (
                <div key={setting.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <label htmlFor={setting.id} className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                        {setting.label}
                      </label>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                    <div className="sm:w-64">
                      {setting.type === 'text' && (
                        <input
                          type="text"
                          id={setting.id}
                          name={setting.id}
                          defaultValue={setting.value}
                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      
                      {setting.type === 'textarea' && (
                        <textarea
                          id={setting.id}
                          name={setting.id}
                          rows={3}
                          defaultValue={setting.value}
                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      
                      {setting.type === 'number' && (
                        <input
                          type="number"
                          id={setting.id}
                          name={setting.id}
                          defaultValue={setting.value}
                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      
                      {setting.type === 'password' && (
                        <input
                          type="password"
                          id={setting.id}
                          name={setting.id}
                          defaultValue={setting.value}
                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      
                      {setting.type === 'email' && (
                        <input
                          type="email"
                          id={setting.id}
                          name={setting.id}
                          defaultValue={setting.value}
                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      
                      {setting.type === 'select' && (
                        <select
                          id={setting.id}
                          name={setting.id}
                          defaultValue={setting.value}
                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        >
                          {setting.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {setting.type === 'switch' && (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id={setting.id}
                            name={setting.id}
                            defaultChecked={setting.value}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 保存按钮 */}
      <div className="mt-8 flex justify-end">
        <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md font-medium transition-colors mr-2">
          取消
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          保存设置
        </button>
      </div>
    </div>
  );
} 