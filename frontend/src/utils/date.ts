/**
 * Date utility functions for MUSULEApp
 * All dates are in Asia/Tokyo timezone
 */

export const TIMEZONE = 'Asia/Tokyo';

/**
 * Get current date in Asia/Tokyo timezone
 */
export function getCurrentDate(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format datetime as ISO string with timezone
 */
export function formatDateTime(date: Date): string {
  return date.toISOString();
}

/**
 * Get ISO week number for a given date
 * Returns format: "YYYY-WW"
 */
export function getISOWeek(date: Date): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfWeek = new Date(startOfYear);
  
  // Find the first Monday of the year
  const dayOfWeek = startOfYear.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  startOfWeek.setDate(startOfYear.getDate() + daysUntilMonday);
  
  // Calculate week number
  const diffTime = date.getTime() - startOfWeek.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;
  
  return `${year}-${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * Get current week in ISO format
 */
export function getCurrentWeek(): string {
  return getISOWeek(getCurrentDate());
}

/**
 * Get start and end dates of a week
 */
export function getWeekDates(week: string): { startDate: string; endDate: string } {
  const [year, weekStr] = week.split('-');
  const weekNum = parseInt(weekStr, 10);
  
  const startOfYear = new Date(parseInt(year), 0, 1);
  const startOfWeek = new Date(startOfYear);
  
  // Find the first Monday of the year
  const dayOfWeek = startOfYear.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  startOfWeek.setDate(startOfYear.getDate() + daysUntilMonday);
  
  // Calculate the start of the target week
  const targetWeekStart = new Date(startOfWeek);
  targetWeekStart.setDate(startOfWeek.getDate() + (weekNum - 1) * 7);
  
  // End of week is Sunday
  const targetWeekEnd = new Date(targetWeekStart);
  targetWeekEnd.setDate(targetWeekStart.getDate() + 6);
  
  return {
    startDate: formatDate(targetWeekStart),
    endDate: formatDate(targetWeekEnd)
  };
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Check if a date is in the current week
 */
export function isCurrentWeek(date: Date): boolean {
  const currentWeek = getCurrentWeek();
  const dateWeek = getISOWeek(date);
  return currentWeek === dateWeek;
}

/**
 * Get day of week name in Japanese
 */
export function getDayOfWeekJP(date: Date): string {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[date.getDay()];
}

/**
 * Generate unique ID for workout item
 */
export function generateWorkoutId(date: string, type: string, detail: string): string {
  const dateObj = parseDate(date);
  const dayOfWeek = getDayOfWeekJP(dateObj);
  const cleanDetail = detail.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${dayOfWeek}-${type}-${cleanDetail}`.substring(0, 32);
}