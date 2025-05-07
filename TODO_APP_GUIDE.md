# Todo应用开发指南

本文档提供了在Mindora项目中实现Todo应用的详细步骤。

## 目录结构

首先，创建以下目录结构：

```
mindbreak/
├── src/
│   ├── app/
│   │   └── todo/
│   │       ├── page.tsx         # Todo应用主页面
│   │       └── layout.tsx       # Todo页面布局
│   ├── components/
│   │   └── todo/
│   │       ├── TodoList.tsx     # 任务列表组件
│   │       ├── TodoItem.tsx     # 单个任务项组件
│   │       ├── TodoForm.tsx     # 任务表单组件
│   │       ├── TodoFilter.tsx   # 任务筛选组件
│   │       └── index.ts         # 组件导出
│   └── lib/
│       └── store/
│           └── todoStore.ts     # Zustand状态管理
```

## 步骤一：创建基础页面

### 1. 创建页面文件

首先，创建Todo应用的基本页面文件：

```tsx
// src/app/todo/page.tsx
import { Suspense } from 'react';
import TodoList from '@/components/todo/TodoList';
import TodoForm from '@/components/todo/TodoForm';
import TodoFilter from '@/components/todo/TodoFilter';

export const metadata = {
  title: 'Todo应用 | Mindora',
  description: '个人任务管理工具',
};

export default function TodoPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">任务管理</h1>
      
      <div className="bg-card rounded-xl shadow-sm p-6">
        <Suspense fallback={<div>加载中...</div>}>
          <TodoForm />
          <TodoFilter />
          <TodoList />
        </Suspense>
      </div>
    </div>
  );
}
```

### 2. 创建布局文件

```tsx
// src/app/todo/layout.tsx
import { ReactNode } from 'react';

export default function TodoLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-muted/20">
      {children}
    </section>
  );
}
```

## 步骤二：实现状态管理

使用Zustand创建状态管理：

```tsx
// src/lib/store/todoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoStatus = 'pending' | 'in-progress' | 'completed' | 'archived';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  categoryId?: string;
}

interface TodoState {
  todos: Todo[];
  filters: {
    status: TodoStatus | 'all';
    priority: TodoPriority | 'all';
    search: string;
    categoryId: string | 'all';
  };
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, todoUpdate: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  completeTodo: (id: string) => void;
  setFilter: (filterKey: keyof TodoState['filters'], value: string) => void;
  reorderTodos: (fromIndex: number, toIndex: number) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filters: {
        status: 'all',
        priority: 'all',
        search: '',
        categoryId: 'all',
      },
      addTodo: (todo) => {
        set((state) => ({
          todos: [
            {
              ...todo,
              id: Math.random().toString(36).substring(2, 9),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...state.todos,
          ],
        }));
      },
      updateTodo: (id, todoUpdate) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, ...todoUpdate, updatedAt: new Date() }
              : todo
          ),
        }));
      },
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      completeTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  status: 'completed',
                  completedAt: new Date(),
                  updatedAt: new Date(),
                }
              : todo
          ),
        }));
      },
      setFilter: (filterKey, value) => {
        set((state) => ({
          filters: {
            ...state.filters,
            [filterKey]: value,
          },
        }));
      },
      reorderTodos: (fromIndex, toIndex) => {
        set((state) => {
          const newTodos = [...state.todos];
          const [moved] = newTodos.splice(fromIndex, 1);
          newTodos.splice(toIndex, 0, moved);
          return { todos: newTodos };
        });
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);
```

## 步骤三：实现UI组件

### 1. TodoList组件

```tsx
// src/components/todo/TodoList.tsx
'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useTodoStore } from '@/lib/store/todoStore';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos, filters, reorderTodos } = useTodoStore();
  const [mounted, setMounted] = useState(false);

  // 处理SSR/水合不匹配问题
  useEffect(() => {
    setMounted(true);
  }, []);

  // 过滤Todo项
  const filteredTodos = todos.filter((todo) => {
    // 状态过滤
    if (filters.status !== 'all' && todo.status !== filters.status) {
      return false;
    }

    // 优先级过滤
    if (filters.priority !== 'all' && todo.priority !== filters.priority) {
      return false;
    }

    // 类别过滤
    if (
      filters.categoryId !== 'all' &&
      todo.categoryId !== filters.categoryId
    ) {
      return false;
    }

    // 搜索过滤
    if (
      filters.search &&
      !todo.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderTodos(result.source.index, result.destination.index);
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-6">
      {filteredTodos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          暂无任务
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {filteredTodos.map((todo, index) => (
                  <TodoItem key={todo.id} todo={todo} index={index} />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
```

### 2. TodoItem组件

```tsx
// src/components/todo/TodoItem.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Draggable } from 'react-beautiful-dnd';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import { Todo, useTodoStore } from '@/lib/store/todoStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import TodoForm from './TodoForm';

interface TodoItemProps {
  todo: Todo;
  index: number;
}

export default function TodoItem({ todo, index }: TodoItemProps) {
  const { updateTodo, deleteTodo, completeTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = () => {
    if (todo.status === 'completed') {
      updateTodo(todo.id, { status: 'pending', completedAt: undefined });
    } else {
      completeTodo(todo.id);
    }
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  if (isEditing) {
    return <TodoForm todo={todo} onComplete={() => setIsEditing(false)} />;
  }

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="list-none"
        >
          <Card className={`p-4 ${todo.status === 'completed' ? 'bg-muted/50' : ''}`}>
            <div className="flex items-start gap-3">
              <Checkbox
                checked={todo.status === 'completed'}
                onCheckedChange={handleStatusChange}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-lg font-medium ${
                      todo.status === 'completed'
                        ? 'line-through text-muted-foreground'
                        : ''
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        priorityColors[todo.priority]
                      }`}
                    >
                      {todo.priority === 'low' && '低优先级'}
                      {todo.priority === 'medium' && '中优先级'}
                      {todo.priority === 'high' && '高优先级'}
                    </span>
                  </div>
                </div>

                {todo.description && (
                  <p
                    className={`mt-1 text-sm ${
                      todo.status === 'completed'
                        ? 'text-muted-foreground'
                        : 'text-foreground/80'
                    }`}
                  >
                    {todo.description}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">
                      创建于 {format(new Date(todo.createdAt), 'yyyy-MM-dd')}
                    </p>
                    {todo.dueDate && (
                      <p className="text-xs text-muted-foreground">
                        截止日期: {format(new Date(todo.dueDate), 'yyyy-MM-dd')}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </li>
      )}
    </Draggable>
  );
}
```

### 3. TodoForm组件

```tsx
// src/components/todo/TodoForm.tsx
'use client';

import { useState } from 'react';
import { Todo, TodoPriority, useTodoStore } from '@/lib/store/todoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TodoFormProps {
  todo?: Todo;
  onComplete?: () => void;
}

export default function TodoForm({ todo, onComplete }: TodoFormProps) {
  const { addTodo, updateTodo } = useTodoStore();
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [priority, setPriority] = useState<TodoPriority>(
    todo?.priority || 'medium'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    if (todo) {
      // 更新现有任务
      updateTodo(todo.id, {
        title,
        description,
        priority,
      });
    } else {
      // 添加新任务
      addTodo({
        title,
        description,
        status: 'pending',
        priority,
      });
      
      // 重置表单
      setTitle('');
      setDescription('');
      setPriority('medium');
    }

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="任务标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Textarea
            placeholder="任务描述 (可选)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
            rows={2}
          />
        </div>

        <div className="w-40">
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as TodoPriority)}
          >
            <SelectTrigger>
              <SelectValue placeholder="优先级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低优先级</SelectItem>
              <SelectItem value="medium">中优先级</SelectItem>
              <SelectItem value="high">高优先级</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {todo && (
          <Button type="button" variant="outline" onClick={onComplete}>
            取消
          </Button>
        )}
        <Button type="submit">
          {todo ? '更新任务' : '添加任务'}
        </Button>
      </div>
    </form>
  );
}
```

### 4. TodoFilter组件

```tsx
// src/components/todo/TodoFilter.tsx
'use client';

import { useTodoStore, TodoStatus, TodoPriority } from '@/lib/store/todoStore';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TodoFilter() {
  const { filters, setFilter } = useTodoStore();

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="搜索任务..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Select
          value={filters.status}
          onValueChange={(value) => setFilter('status', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="pending">待处理</SelectItem>
            <SelectItem value="in-progress">进行中</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
            <SelectItem value="archived">已归档</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value) => setFilter('priority', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部优先级</SelectItem>
            <SelectItem value="low">低优先级</SelectItem>
            <SelectItem value="medium">中优先级</SelectItem>
            <SelectItem value="high">高优先级</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
```

### 5. 创建导出文件

```tsx
// src/components/todo/index.ts
export { default as TodoList } from './TodoList';
export { default as TodoItem } from './TodoItem';
export { default as TodoForm } from './TodoForm';
export { default as TodoFilter } from './TodoFilter';
```

## 步骤四：未来扩展

### 服务器操作实现

要实现服务器操作，可以创建以下文件：

```tsx
// src/app/api/todos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const todos = await prisma.todoItem.findMany();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const todo = await prisma.todoItem.create({
      data
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
```

```tsx
// src/app/api/todos/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const todo = await prisma.todoItem.findUnique({
      where: { id: params.id }
    });
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const todo = await prisma.todoItem.update({
      where: { id: params.id },
      data
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.todoItem.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
```

## 步骤五：集成到导航

确保Todo应用在全局导航中可访问：

```tsx
// src/components/layout/Navbar.tsx (片段)
const navigationItems = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "项目" },
  { href: "/blog", label: "博客" },
  { href: "/dashboard", label: "数据仪表盘" },
  { href: "/todo", label: "Todo应用" },
  { href: "/good-sites", label: "好站分享" },
  { href: "/about", label: "关于" },
];
``` 