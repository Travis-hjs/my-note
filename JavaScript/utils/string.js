// -------------------------------- String 类工具函数 --------------------------------

/**
 * 输入只能是数字
 * @param {string | number} value 输入值
 * @param {boolean} decimal 是否要保留小数
 * @param {boolean} negative 是否可以为负数
 */
function inputOnlyNumber(value, decimal, negative) {
  let result = value.toString().trim();
  if (result.length === 0) return "";
  const minus = (negative && result[0] == "-") ? "-" : "";
  if (decimal) {
    result = result.replace(/[^0-9.]+/ig, "");
    let array = result.split(".");
    if (array.length > 1) {
      result = array[0] + "." + array[1];
    }
  } else {
    result = result.replace(/[^0-9]+/ig, "");
  }
  return minus + result;
}

/**
 * 过滤掉特殊字符（包括emoji）
 * @param {string} value
 */
function filterSpecialValue(value) {
  value = value.trim();
  const emojiReg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
  const symbolReg = /[`~!@#$^&()=|{}':;,\[\].<>/?！￥…*（）—【】‘；：”“。，、？`%+\-_"\\]/g; // 漏了可以自己加进去
  return value.replace(emojiReg, "").replace(symbolReg, "");
}

/**
 * 数字带逗号分隔
 * @param {number} num
 * @example 
 * ```js
 * stringToThousand(10000) => "10,000"
 * ```
 */
function stringToThousand(num) {
  // return num.toLocaleString("en-US");
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * 首字母大写
 * @param {string} string 
 */
function firstToUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 带单位的数值转换
 * @param {number} value 数字
 */
function unitsNumber(value) {
  value = Math.floor(value);
  if (value === 0) return 0;
  const units = ["", "k", "m", "b", "f", "e", "ae", "be", "ce", "de", "ee", "fe", "ge", "he", "ie"];
  const index = Math.floor(Math.log(value) / Math.log(1000));
  const n = value / Math.pow(1000, index);
  if (index === 0) return n;
  let result = n.toFixed(3);
  // 不进行四舍五入 取小数点后一位
  result = result.substring(0, result.lastIndexOf(".") + 2);
  return result + units[index];
}

/**
 * 获取`url?`后面参数（JSON对象）
 * @param {string} name 获取指定参数名
 * @param {string} target 目标字段，默认`location.search`
 * @example 
 * ```js
 * // 当前网址为 www.https://hjs.com?id=99&age=123&key=sdasfdfr
 * const targetAge = getQueryParam("age", "id=12&age=14&name=hjs");
 * const params = getQueryParam();
 * const age = getQueryParam("age");
 * // 非IE浏览器下简便方法
 * new URLSearchParams(location.search).get("age");
 * ```
 * @returns {object|string}
 */
function getQueryParam(name = null, target = null) {
  // const code = target || location.search.slice(1); // location.search 在 http://192.168.89.53:1080/#/page?id=10 这种情况下获取不到
  const code = target || location.href.split("?")[1] || "";
  const list = code.split("&");
  const params = {};
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const items = item.split("=");
    if (items.length > 1) {
      params[items[0]] = item.replace(`${items[0]}=`, "");
    }
  }
  if (name) {
    return params[name] || "";
  } else {
    return params;
  }
  // const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  // const results = location.search.substr(1).match(reg);
  // if (results != null) return unescape(results[2]);
  // return null;
}

/**
 * rgb 转 16进制 
 * @param {string} string rgb(125, 125, 125)
 */
function rgbToHex(string) {
  const rgb = string.split(",");
  const r = parseInt(rgb[0].split("(")[1]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2].split(")")[0]);
  const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}

/** 
* hex16 进制颜色转 rgb(rgba)
* @param {string} hex "#23ff45" 
*/
function hexToRgb(hex) {
  return "rgb(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + ")";
}

/** 随机16进制颜色 */
function randomHex() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0");
}

/**
 * 检测类型
 * @param {any} target 检测的目标
 * @returns {"string"|"number"|"array"|"object"|"function"|"null"|"undefined"|"formdata"|"arraybuffer"|"regexp"|"blob"} 只枚举一些常用的类型
 */
function checkType(target) {
  /** @type {string} */
  const value = Object.prototype.toString.call(target);
  const result = value.match(/\[object (\S*)\]/)[1];
  return result.toLocaleLowerCase();
}

/**
 * 数字转中文大写
 * @param {number} value 
 * @param {boolean} needUnit 是否需要带人民币单位
 */
function toChinesNumber(value, needUnit = false) {
  const changeNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const unit = ["", "十", "百", "千", "万"];
  const decimal = value.toString().split(".")[1];
  const integer = parseInt(value);
  function getWan(number = 0) {
    const strArr = number.toString().split("").reverse();
    let newNum = "";
    for (let i = 0; i < strArr.length; i++) {
      newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
    }
    return newNum;
  }
  function getDecimal(str = "") {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const key = str[i];
      result += changeNum[key];
    }
    return result;
  }
  const overWan = Math.floor(integer / 10000);
  let noWan = integer % 10000;
  if (noWan.toString().length < 4) noWan = `0${noWan}`;
  let result = overWan ? `${getWan(overWan)}万${getWan(noWan)}` : getWan(integer);
  const unitStr = (decimal || !result) ? "圆" : "圆整";
  if (!result) result = changeNum[0];
  return decimal ? `${result}点${getDecimal(decimal)}${needUnit ? unitStr : ""}` : `${result}${needUnit ? unitStr : ""}`;
}
