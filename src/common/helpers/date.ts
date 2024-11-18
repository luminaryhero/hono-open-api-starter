import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 获取当前时区
 */
export const currentTimezone = () => dayjs.tz.guess(); // Asia/Shanghai

/**
 * 获取当前时区的时间
 */
export const now = () => dayjs.tz(currentTimezone()).toDate();

/**
 * 格式化日期
 */
export function dateFormat(date: Date, formatStr = "YYYY-MM-DD HH:mm:ss") {
  if (!date)
    return null;

  return dayjs(date).format(formatStr);
}
