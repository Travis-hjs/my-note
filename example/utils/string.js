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
  const strings = location.href.split("?");
  const code = target || strings[strings.length - 1] || ""; // 默认获取最后一个`?`的参数
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

/**
 * 获取处理要标记的`html`文本
 * @param {string} content 
 * @param {Array<string>} keywords 
 */
function getMarkHtml(content, keywords) {
  if (keywords.length === 0) return;
  new Set(keywords).forEach(keyword => {
    if (keyword && content.indexOf(keyword) > -1) {
      content = content.replace(new RegExp(keyword, "g"), `<mark>${keyword}</mark>`);
    }
  });
  return content;
}

/**
 * 实现原生废弃的`String.prototype.substr()`方法
 * @param {string} value 
 * @param {number} start 
 * @param {number} length 
 */
function substr(value, start = 0, length = value.length) {
  if (length < 0) return "";
  const _length = value.length;
  if (start <= -_length) {
    start = 0;
  }
  start = start < 0 ? _length + start : start;
  length = start + length > _length ? _length : start + length;
  let result = "";
  for (let i = start; i < length; i++) {
    result += value[i];
  }
  return result;
}

/**
 * 数字转中文
 * @param {number} target 
 */
function numberToChinese(target) {
  if (typeof target !== "number" || isNaN(target)) return "";
  const cnNums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const cnIntRadice = ["", "十", "百", "千"];
  const cnIntUnits = ["", "万", "亿", "兆"];
  const cnDecUnits = ["角", "分", "毫", "厘"];
  const cnInteger = "整";
  const cnIntLast = "元";
  const maxNum = 999999999999999.9999;
  let integerNum = "";
  let decimalNum = "";
  let result = "";
  /** @type {Array<string>} */
  let parts;
  if (target >= maxNum) {
    console.warn("超出最大处理数字");
    return "";
  }
  if (target == 0) {
    result = cnNums[0] + cnIntLast + cnInteger;
    return result;
  }
  const numStr = target.toString();
  if (numStr.indexOf(".") == -1) {
    integerNum = numStr;
  } else {
    parts = numStr.split(".");
    integerNum = parts[0];
    decimalNum = substr(parts[1], 0, 4);
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const intLength = integerNum.length;
    for (let i = 0; i < intLength; i++) {
      const n = substr(integerNum, i, 1);
      const p = intLength - i - 1;
      const q = p / 4;
      const m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          result += cnNums[0];
        }
        zeroCount = 0; // 归零
        result += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        result += cnIntUnits[q];
      }
    }
    result += cnIntLast;
  }
  // 小数部分
  if (decimalNum != "") {
    const decLength = decimalNum.length;
    for (let i = 0; i < decLength; i++) {
      const n = substr(decimalNum, i, 1);
      if (n != "0") {
        result += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (result == "") {
    result += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == "") {
    result += cnInteger;
  }
  return result;
}
