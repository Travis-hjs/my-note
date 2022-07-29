// -------------------------------- Date 类工具函数 --------------------------------

// 时间日期类型日期模块
// new Date().toLocaleDateString();         => "2020/12/12"
// new Date().toTimeString().slice(0, 8);   => "12:12:12"
// new Date().toLocaleTimeString();         => "上/下午12:12:12"
// new Date().toLocaleString();             => "2020/12/12 上/下午12:12:12"

/**
 * 格式化日期
 * @param {string | number | Date} value 指定日期
 * @param {string} format 格式化的规则
 * @example
 * ```js
 * formatDate();
 * formatDate(1603264465956);
 * formatDate(1603264465956, "h:m:s");
 * formatDate(1603264465956, "Y年M月D日");
 * ```
 */
function formatDate(value = Date.now(), format = "Y-M-D h:m:s") {
  if (["null", null, "undefined", undefined, ""].includes(value)) return "";
  // ios 和 mac 系统中，带横杆的字符串日期是格式不了的，这里做一下判断处理
  if (typeof value === "string" && new Date(value).toString() === "Invalid Date") {
    value = value.replace(/-/g, "/");
  }
  const formatNumber = n => `0${n}`.slice(-2);
  const date = new Date(value);
  const formatList = ["Y", "M", "D", "h", "m", "s"];
  const resultList = [];
  resultList.push(date.getFullYear().toString());
  resultList.push(formatNumber(date.getMonth() + 1));
  resultList.push(formatNumber(date.getDate()));
  resultList.push(formatNumber(date.getHours()));
  resultList.push(formatNumber(date.getMinutes()));
  resultList.push(formatNumber(date.getSeconds()));
  for (let i = 0; i < resultList.length; i++) {
    format = format.replace(formatList[i], resultList[i]);
  }
  return format;
}

/**
 * 获取日期周几
 * @param {string | string | Date} value 指定日期
 */
function getDateDayString(value) {
  return "周" + "日一二三四五六".charAt(new Date(value).getDay());
}

/**
 * 获取某年某月有多少天
 * @param {number} year 指定年份
 * @param {number} month 指定月份
 * @returns 
 */
function getMonthDay(year, month) {
  const day31 = [1, 3, 5, 7, 8, 10, 12];
  const day30 = [4, 6, 9, 11];
  if (day31.includes(month)) {
    return 31;
  } else if (day30.includes(month)) {
    return 30;
  } else {
    if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
      return 29;
    } else {
      return 28;
    }
  }
}

/**
 * 获取两个日期之间的天数
 * @param {Date | string | number} date1 
 * @param {Date | string | number} date2 
 * @returns 
 */
function daysBetween(date1, date2) {
  const value = new Date(date1).getTime() - new Date(date2).getTime();
  return Math.ceil(Math.abs(value) / (1000 * 60 * 60 * 24));
}

/**
 * 将秒数换成时分秒格式
 * @param {number} value 秒数
 * @param {boolean} withDay 是否带天数倒计
 * @returns {{day: string, hour: string, minute: string, second: string}}
 */
function formatSecond(value, withDay = false) {
  let day = Math.floor(value / (24 * 3600));
  let hour = Math.floor(value / 3600) - day * 24;
  let minute = Math.floor(value / 60) - (day * 24 * 60) - (hour * 60);
  let second = Math.floor(value) - (day * 24 * 3600) - (hour * 3600) - (minute * 60);
  if (!withDay) {
    hour = hour + day * 24;
  }
  // 格式化
  day = day < 10 ? ("0" + day).slice(-2) : day.toString();
  hour = hour < 10 ? ("0" + hour).slice(-2) : hour.toString();
  minute = ("0" + minute).slice(-2);
  second = ("0" + second).slice(-2);
  return { day, hour, minute, second }
}

/** 日期列表生成 */
function dateJson() {
  /**
   * 日历数组
   * @type {Array<{label: string, children: Array<{label: string, children: Array<{label: string}>}>}>}
   */
  const calendar = [];
  const date = new Date();
  const minYear = date.getFullYear();
  const maxYear = date.getFullYear() + 10;
  let dayCount = 1;
  for (let i = minYear; i <= maxYear; i++) {
    const year = {
      label: i.toString(),
      children: []
    }
    for (let j = 1; j <= 12; j++) {
      const month = {
        label: ("0" + j.toString()).slice(-2),
        children: []
      }
      year.children.push(month);
      dayCount = new Date(i, j, 0).getDate();
      for (let k = 1; k <= dayCount; k++) {
        month.children.push({
          label: ("0" + k.toString()).slice(-2)
        });
      }
    }
    calendar.push(year);
  }
  // 限制不能选小于之前的日期
  calendar[0].children.splice(0, date.getMonth());
  calendar[0].children[0].children.splice(0, date.getDate());
  return calendar;
}

/**
 * 时间生成器
 * @param {number} minInterval 时间间隔(分钟)
 */
function timeInterval(minInterval) {
  let arr = [];
  let minTotal = 0;
  while (minTotal < 1440) {
    let hour = Math.floor(minTotal / 60);
    let minute = Math.floor(minTotal % 60);
    hour = ("0" + hour).slice(-2);
    minute = ("0" + minute).slice(-2);
    minTotal += minInterval;
    arr.push(hour + ":" + minute);
    return arr;
  }
}
