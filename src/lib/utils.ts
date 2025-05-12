import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期字符串，如：2023年10月28日
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}年${month}月${day}日`;
}

/**
 * 格式化日期和时间
 * @param dateString 日期字符串
 * @returns 格式化后的日期和时间字符串，如：2023年10月28日 09:30
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

/**
 * 格式化价格显示
 * @param price 价格数值
 * @returns 格式化后的价格字符串
 */
export function formatPrice(price: number): string {
  if (price === undefined || price === null || isNaN(price)) {
    return '0.00';
  }
  // 先四舍五入到两位小数，确保统一
  const fixedPrice = Number(price.toFixed(2));
  return fixedPrice.toFixed(2);
}

/**
 * 格式化涨跌额显示
 * @param change 涨跌额数值
 * @returns 格式化后的涨跌额字符串（带+/-符号）
 */
export function formatChange(change: number): string {
  if (change === undefined || change === null || isNaN(change)) {
    return '0.00';
  }
  // 先四舍五入到两位小数，确保统一
  const fixedChange = Number(change.toFixed(2));
  return fixedChange >= 0 ? `+${fixedChange.toFixed(2)}` : fixedChange.toFixed(2);
}

/**
 * 格式化涨跌幅显示
 * @param percent 涨跌幅数值
 * @returns 格式化后的涨跌幅字符串（百分比形式）
 */
export function formatChangePercent(percent: number): string {
  if (percent === undefined || percent === null || isNaN(percent)) {
    return '0.00%';
  }
  // 直接格式化为两位小数百分比，不进行双重舍入
  return `${Math.abs(percent).toFixed(2)}%`;
}

/**
 * 统一计算涨跌幅百分比
 * @param current 当前价格
 * @param previous 昨收价格
 * @returns 计算后的涨跌幅（已舍入到两位小数）
 */
export function calculateChangePercent(current: number, previous: number): number {
  if (!previous || previous === 0) return 0;
  return Number(((current - previous) / previous * 100).toFixed(2));
}

/**
 * 统一处理金融数据，确保所有显示的数值保持一致
 * @param data 原始金融数据
 * @returns 处理后的金融数据
 */
export function processFinancialData(data: any) {
  if (!data) return data;
  
  // 处理核心价格数据，确保统一精度
  if (data.yesterdayClose !== undefined) {
    data.yesterdayClose = Number(data.yesterdayClose.toFixed(2));
  }
  if (data.price !== undefined) {
    data.price = Number(data.price.toFixed(2));
  }
  if (data.currentPoint !== undefined) {
    data.currentPoint = Number(data.currentPoint.toFixed(2));
  }
  if (data.avgPrice !== undefined) {
    data.avgPrice = Number(data.avgPrice.toFixed(2));
  }
  
  // 如果有足够数据，重新计算涨跌额和涨跌幅以确保一致性
  if ((data.price !== undefined || data.currentPoint !== undefined) && data.yesterdayClose !== undefined) {
    const current = data.price !== undefined ? data.price : data.currentPoint;
    data.change = Number((current - data.yesterdayClose).toFixed(2));
    data.changePercent = calculateChangePercent(current, data.yesterdayClose);
  } else {
    // 处理涨跌额，统一保留2位小数
    if (data.change !== undefined) {
      data.change = Number(data.change.toFixed(2));
    }
    // 处理涨跌幅，统一保留2位小数
    if (data.changePercent !== undefined) {
      data.changePercent = Number(data.changePercent.toFixed(2));
    }
  }
  
  return data;
}
