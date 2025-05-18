import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getMarketIndices, getHotStocks } from '@/lib/api/finance/eastMoneyService';

/**
 * 获取市场趋势数据，支持分页和过滤
 * GET /api/dashboard/market-trends
 */
export async function GET(
  request: Request
) {
  try {
    // 解析URL获取查询参数
    const { searchParams } = new URL(request.url);
    const trendName = searchParams.get('trendName');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // 构建查询条件
    const where: any = {};
    
    // 按趋势名称筛选
    if (trendName) {
      where.trendName = trendName;
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
    const data = await prisma.marketTrend.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    // 获取总记录数
    const total = await prisma.marketTrend.count({ where });
    
    // 如果没有数据，返回404
    if (data.length === 0) {
      return NextResponse.json(
        { 
          error: '未找到市场趋势数据',
          message: '数据库中没有符合条件的市场趋势数据，请先运行seed-finance.js脚本导入数据' 
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
    console.error('获取市场趋势数据时出错:', error);
    return NextResponse.json(
      { 
        error: '获取市场趋势数据时出错',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * 创建市场趋势数据
 * POST /api/dashboard/market-trends
 */
export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    
    // 验证必要字段
    if (!body.date || !body.trendName || !body.trendValue) {
      return NextResponse.json(
        { 
          error: '日期、趋势名称和趋势值字段必填',
          message: '请确保请求包含所有必要字段' 
        },
        { status: 400 }
      );
    }
    
    // 创建新记录
    const data = await prisma.marketTrend.create({
      data: {
        date: new Date(body.date),
        trendName: body.trendName,
        trendValue: parseFloat(body.trendValue),
        description: body.description,
        source: body.source || 'api-eastmoney'
      }
    });
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('创建市场趋势数据时出错:', error);
    return NextResponse.json(
      { 
        error: '创建市场趋势数据时出错',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * 更新热门板块趋势数据
 * PUT /api/dashboard/market-trends/hot-sectors
 */
export async function PUT(
  request: Request
) {
  try {
    const body = await request.json();
    const { fetchFromExternal } = body;
    
    if (fetchFromExternal) {
      try {
        // 获取热门股票数据
        const hotStocksData = await getHotStocks(30);
        
        if (!hotStocksData || hotStocksData.length === 0) {
          return NextResponse.json(
            { 
              error: '获取热门股票数据失败',
              message: '从外部API获取的热门股票数据为空' 
            },
            { status: 500 }
          );
        }
        
        // 创建行业/板块分布统计
        const sectors: {[key: string]: {count: number, change: number}} = {};
        
        // 分析热门股票数据，统计不同行业/板块的热度
        hotStocksData.forEach((stock: any) => {
          const sector = stock.sector || '其他';
          if (!sectors[sector]) {
            sectors[sector] = { count: 0, change: 0 };
          }
          sectors[sector].count += 1;
          sectors[sector].change += stock.changePercent || 0;
        });
        
        // 转换为趋势数据
        const trendData = Object.entries(sectors).map(([sector, data]) => ({
          date: new Date(),
          trendName: `热门板块-${sector}`,
          trendValue: data.count,
          description: `平均涨跌幅: ${(data.change / data.count).toFixed(2)}%`,
          source: 'api-eastmoney'
        }));
        
        if (trendData.length === 0) {
          return NextResponse.json(
            { 
              error: '处理热门板块数据失败',
              message: '无法从热门股票数据中提取有效的板块趋势数据' 
            },
            { status: 500 }
          );
        }
        
        // 删除旧数据
        await prisma.marketTrend.deleteMany({
          where: {
            trendName: {
              startsWith: '热门板块-'
            },
            source: 'api-eastmoney'
          }
        });
        
        // 批量保存数据
        const result = await prisma.$transaction(
          trendData.map(data => 
            prisma.marketTrend.create({
              data
            })
          )
        );
        
        return NextResponse.json({
          success: true,
          count: result.length,
          message: `成功更新 ${result.length} 条热门板块趋势数据`
        });
      } catch (apiError) {
        console.error('获取热门板块数据时出错:', apiError);
        return NextResponse.json(
          { 
            error: '获取热门板块数据时出错',
            message: apiError instanceof Error ? apiError.message : '未知错误'
          },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { 
          error: '请指定数据来源',
          message: '需要设置fetchFromExternal参数为true' 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('更新热门板块趋势数据时出错:', error);
    return NextResponse.json(
      { 
        error: '更新热门板块趋势数据时出错',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 