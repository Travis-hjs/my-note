let zIndex = 1000;

/**
 * 各个弹层组件应用的定位层级
 * - 该方法调用一次之后，就会累加一次层级
 * - 保证所有弹层按照书写顺序去排列定位层级
 */
export function useZIndex() {
  const val = zIndex;
  zIndex++;
  return val;
}

/**
 * 检测类型
 * @param target 检测的目标
 */
export function checkType(target: any) {
  const value: string = Object.prototype.toString.call(target);
  const result = (value.match(/\[object (\S*)\]/) as RegExpMatchArray)[1];
  return result.toLocaleLowerCase() as JavaScriptTypes;
}

/**
 * 判断任意值的类型，作用与`checkType`一致，外加一个辅助功能：当函数返回值为`true`时，可以传入泛型来确定`target`的类型（类型收窄）
 * @param target 判断目标
 * @param type 判断的类型
 * - 当要判断的类型为`object`时，需要传一个泛型去确定它的类型，因为在`ts`中`object`是一个特殊类型无法确定
 * @example
 * ```ts
 * type User = {
 *   id: number
 *   name: string
 * }
 * 
 * function setData(params: string | User | Array<User>) {
 *   if (isType<User>(params, "object")) {
 *     params.name = "xxx";
 *   }
 *   if (isType(params, "array")) {
 *     params.push({ id: 1, name: "add" });
 *   }
 *   // ...do some
 * }
 * ```
 */
export function isType<T>(target: any, type: T extends "object" ? T : JavaScriptTypes): target is T extends JavaScriptTypes ? JavaScriptType[T] : T {
  return checkType(target) === type;
}

/**
 * 格式化日期
 * @param value 指定日期
 * @param format 格式化的规则
 * @example
 * ```js
 * formatDate();
 * formatDate(1603264465956);
 * formatDate(1603264465956, "h:m:s");
 * formatDate(1603264465956, "Y年M月D日");
 * ```
 */
export function formatDate(value: string | number | Date = Date.now(), format = "Y-M-D h:m:s") {
  if (["null", null, "undefined", undefined, ""].includes(value as any)) return "";
  // ios 和 mac 系统中，带横杆的字符串日期是格式不了的，这里做一下判断处理
  if (typeof value === "string" && new Date(value).toString() === "Invalid Date") {
    value = value.replace(/-/g, "/");
  }
  const formatNumber = (n: number) => `0${n}`.slice(-2);
  const date = new Date(value);
  const formatList = ["Y", "M", "D", "h", "m", "s"];
  const resultList = [
    date.getFullYear().toString(),
    formatNumber(date.getMonth() + 1),
    formatNumber(date.getDate()),
    formatNumber(date.getHours()),
    formatNumber(date.getMinutes()),
    formatNumber(date.getSeconds())
  ];
  for (let i = 0; i < resultList.length; i++) {
    format = format.replace(formatList[i], resultList[i]);
  }
  return format;
}

/**
 * `JSON`转路径传参
 * @param params `JSON`对象
 * @example
 * ```js
 * const info = { name: "hjs", id: 123 };
 * const val = jsonToPath(info);
 * console.log(val); // "name=hjs&id=123"
 * ```
 */
export function jsonToPath<T extends object>(params: T) {
  let result = "";
  for (const key in params) {
    result += `&${key}=${params[key]}`;
  }
  return result.slice(1);
}

/**
 * 获取`url?`后面参数（JSON对象）
 * @param name 获取指定参数名
 * @param target 目标字段，默认`location.href`最后一个问号后面字符串
 * ```js
 * // 当前网址为 www.https://hjs.com?id=99&age=123&key=abc
 * const current = getLinkQuery();
 * // 输出: { id: "99", age: "12", key: "abc" }
 * 
 * const params = getLinkQuery("id=12&version=1.4.3&name=hjs");
 * // 输出: { id: "12", version: "1.4.3", name: "hjs" }
 * ```
 */
export function getLinkQuery<T extends object>(target?: string): T {
  const strings = location.href.split("?");
  const code = target || strings[strings.length - 1] || "";
  const list = code.split("&");
  const params: any = {};
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const items = item.split("=");
    if (items.length > 1) {
      params[items[0]] = item.replace(`${items[0]}=`, "");
    }
  }
  return params;
}

/** 运算符号 */
type NumberSymbols = "*" | "+" | "-" | "/";

/**
 * 数字运算（主要用于小数点精度问题）
 * [see](https://juejin.im/post/6844904066418491406#heading-12)
 * @param a 前面的值
 * @param type 计算方式
 * @param b 后面的值
 * @example
 * ```js
 * // 可链式调用
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
 */
export function computeNumber(a: number, type: NumberSymbols, b: number) {
  /**
   * 获取数字小数点的长度
   * @param n 数字
   */
  function getDecimalLength(n: number = 0) {
    const decimal = n.toString().split(".")[1];
    return decimal ? decimal.length : 0;
  }
  /**
   * 修正小数点
   * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
   * @param n 数字
   */
  const amend = (n: number, precision = 15) => Number.parseFloat(Number(n).toPrecision(precision));
  const power = 10 ** Math.max(getDecimalLength(a), getDecimalLength(b));
  let result = 0;

  a = amend(a * power);
  b = amend(b * power);

  switch (type) {
    case "*": {
      result = (a * b) / (power * power);
      break;
    }
    case "+": {
      result = (a + b) / power;
      break;
    }
    case "-": {
      result = (a - b) / power;
      break;
    }
    case "/": {
      result = a / b;
      break;
    }
  }

  result = amend(result);

  return {
    /** 计算结果 */
    result,
    /**
     * 继续计算
     * @param nextType 继续计算方式
     * @param nextValue 继续计算的值
     */
    next(nextType: NumberSymbols, nextValue: number) {
      return computeNumber(result, nextType, nextValue);
    },
    /**
     * 小数点进位
     * - 应用场景：商品价格`100`，用了优惠券结算价格为`33.333333...`，取小数点两位则是`33.33`；
     * - 如果有`1000`个人都以`33.33`去结算的话，那么最终就会损失`3`块钱，以此类推；
     * - 所以该方法就是在小数取位后面补`1`，像这样：
     * @param n 小数点后的位数
     * @example
     * ```js
     * const res1 = computeNumber(100, "/", 3).toUp(2);
     * console.log(res1); // 33.34
     * 
     * const res2 = computeNumber(166, "/", 100).toUp(2);
     * console.log(res2); // 1.66
     * 
     * const res3 = computeNumber(1212, "/", 100).toUp(1);
     * console.log(res3); // 12.2
     * ```
     */
    toUp(n: number) {
      const strings = result.toString().split(".");
      if (n > 0 && strings[1] && strings[1].length > n) {
        const decimal = strings[1].slice(0, n);
        const value = Number(`${strings[0]}.${decimal}`);
        const difference = 1 / 10 ** decimal.length;
        result = computeNumber(value, "+", difference).result;
      }
      return result;
    },
  };
}
