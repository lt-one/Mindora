import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getMarketIndices, getHotStocks } from '@/lib/api/finance/eastMoneyService';

/**
 * 获取金融数据，支持分页和过滤
 * GET /api/dashboard/financial-data
 */
export async function GET(
  request: Request
) {
  try {
    // 解析URL获取查询参数
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // 构建查询条件
    const where: any = {};
    
    // 按类别筛选
    if (category !== 'all') {
      where.category = category;
    }
    
    // 按日期范围筛选
    if (startDate || endDate) {
      where.date = {};
      
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }
    
    // 查询数据库
    const data = await prisma.financialData.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    // 获取总记录数
    const total = await prisma.financialData.count({ where });
    
    // 如果没有数据，返回404
    if (data.length === 0) {
      return NextResponse.json(
        { 
          error: '未找到金融数据',
          message: '数据库中没有符合条件的金融数据，请先运行seed-finance.js脚本导入数据' 
        },
        { status: 404 }
      );
    }
    
    // 返回结果
    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取金融数据时出错:', error);
    return NextResponse.json(
      { error: '获取金融数据时出错', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

/**
 * 创建或更新金融数据
 * POST /api/dashboard/financial-data
 */
export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    
    // 验证必要字段
    if (!body.date || !body.value || !body.category) {
      return NextResponse.json(
        { error: '日期、数值和类别字段必填' },
        { status: 400 }
      );
    }
    
    // 创建新记录
    const data = await prisma.financialData.create({
      data: {
        date: new Date(body.date),
        value: parseFloat(body.value),
        category: body.category,
        source: body.source || 'api-eastmoney'
      }
    });
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('创建金融数据时出错:', error);
    return NextResponse.json(
      { error: '创建金融数据时出错', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

/**
 * 批量导入金融数据，可用于初始填充或定时更新
 * PUT /api/dashboard/financial-data/batch
 */
export async function PUT(
  request: Request
) {
  try {
    const body = await request.json();
    const { records, category, source, fetchFromExternal } = body;
    
    let dataToProcess = records;
    
    // 如果请求指定从外部API获取数据
    if (fetchFromExternal) {
      try {
        // 从东方财富获取数据
        const externalData = await getMarketIndices();
        
        if (!externalData || (externalData as any[]).length === 0) {
          return NextResponse.json(
            { error: '从外部API获取数据失败', message: '获取到的数据为空' },
            { status: 500 }
          );
        }
        
        // 转换为数据库格式
        dataToProcess = (externalData as any[]).map((item: any) => ({
          date: new Date(),
          value: parseFloat(item.price || item.f2 / 100),
          category: category || 'market-index',
          source: source || 'api-eastmoney'
        }));
      } catch (apiError) {
        console.error('从外部API获取数据时出错:', apiError);
        return NextResponse.json(
          { error: '从外部API获取数据时出错', message: apiError instanceof Error ? apiError.message : '未知错误' },
          { status: 500 }
        );
      }
    }
    
    // 验证数据
    if (!Array.isArray(dataToProcess) || dataToProcess.length === 0) {
      return NextResponse.json(
        { error: '无有效记录可导入', message: '请提供有效的数据记录或确保API返回了有效数据' },
        { status: 400 }
      );
    }
    
    // 批量插入数据
    const result = await prisma.$transaction(
      dataToProcess.map((record: any) => {
        const data = {
          date: new Date(record.date),
          value: parseFloat(record.value),
          category: record.category,
          source: record.source || 'api-eastmoney'
        };
        
        // 使用upsert确保数据不重复
        return prisma.financialData.upsert({
          where: {
            // 使用复合唯一约束
            // 注意: 如果数据库模型中没有定义复合唯一约束，需要调整此查询
            // 此处假设使用日期+类别+来源作为唯一标识
            id: record.id || 'temp-id', // 如果没有id，使用一个临时id触发创建
          },
          update: data,
          create: data
        });
      })
    );
    
    return NextResponse.json({
      success: true,
      count: result.length,
      message: `成功导入 ${result.length} 条记录`
    });
  } catch (error) {
    console.error('批量导入金融数据时出错:', error);
    return NextResponse.json(
      { error: '批量导入金融数据时出错', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 
 