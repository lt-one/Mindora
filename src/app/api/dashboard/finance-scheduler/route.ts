import { NextResponse } from 'next/server';
import { 
  startFinanceDataScheduler, 
  stopFinanceDataScheduler, 
  triggerFinanceDataUpdate,
  getFinanceSchedulerStatus
} from '@/lib/scheduler/finance-scheduler';
import logger from '@/lib/logger-utils';

/**
 * 获取定时更新服务状态
 * GET /api/dashboard/finance-scheduler
 */
export async function GET() {
  try {
    // 直接从定时任务服务获取实际状态
    const schedulerStatus = getFinanceSchedulerStatus();
    
    return NextResponse.json({
      status: 'success',
      data: schedulerStatus
    });
  } catch (error) {
    logger.error('获取定时更新状态失败:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : '获取定时更新状态失败'
      },
      { status: 500 }
    );
  }
}

/**
 * 启动或停止定时更新服务
 * POST /api/dashboard/finance-scheduler
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;
    
    switch(action) {
      case 'start':
        startFinanceDataScheduler();
        return NextResponse.json({
          status: 'success',
          message: '金融数据定时更新已启动',
          data: getFinanceSchedulerStatus() // 获取最新状态
        });
        
      case 'stop':
        const stopped = stopFinanceDataScheduler();
        return NextResponse.json({
          status: 'success',
          message: stopped ? '金融数据定时更新已停止' : '定时更新服务未在运行',
          data: getFinanceSchedulerStatus() // 获取最新状态
        });
        
      case 'update-now':
        try {
          await triggerFinanceDataUpdate();
          return NextResponse.json({
            status: 'success',
            message: '金融数据更新已完成',
            data: {
              lastUpdate: new Date().toISOString(),
              ...getFinanceSchedulerStatus() // 包含完整状态
            }
          });
        } catch (updateError) {
          return NextResponse.json(
            { 
              status: 'error',
              message: updateError instanceof Error 
                ? updateError.message 
                : '金融数据更新失败'
            },
            { status: 500 }
          );
        }
        
      default:
        return NextResponse.json(
          { 
            status: 'error',
            message: '无效的操作，有效值为: start, stop, update-now'
          },
          { status: 400 }
        );
    }
  } catch (error) {
    logger.error('控制定时更新服务失败:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : '控制定时更新服务失败'
      },
      { status: 500 }
    );
  }
}

/**
 * 计算下一次整点执行的时间
 */
function getNextScheduledTime(): string {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1);
  nextHour.setMinutes(0);
  nextHour.setSeconds(0);
  nextHour.setMilliseconds(0);
  
  return nextHour.toISOString();
} 
 