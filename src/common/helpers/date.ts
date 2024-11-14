import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 获取Asia/Shanghai时间
 */
export const now = () => dayjs.utc().tz("Asia/Shanghai").toDate();

/**
 * 获取当前时区
 */
export const currentTimezone = () => dayjs.tz.guess(); // Asia/Shanghai

/**
 * 格式化日期
 */
export const format = (date: Date, formatStr = "YYYY-MM-DD HH:mm:ss") => dayjs(date).format(formatStr);
