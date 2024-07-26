// -------------------------------- Number 类工具函数 --------------------------------

/**
 * 范围随机整数
 * @param {number} min 最小数
 * @param {number} max 最大数
 */
function ranInt(min, max) {
  return Math.round(Math.random() * (max - min) + min); // 不会保留小数
  // return Math.floor(Math.random() * (max - min + 1)) + min; // 会保留小数
}

/**
 * 不会四舍五入的小数点取舍
 * @param {number} value
 * @param {number} fixed 小数位
 */
function toFixed(value, fixed) {
  return ~~(Math.pow(10, fixed) * value) / Math.pow(10, fixed);
}

/**
 * 数字运算（主要用于小数点精度问题）
 * [see](https://juejin.im/post/6844904066418491406#heading-12)
 * @param {number} a 前面的值
 * @param {"+"|"-"|"*"|"/"} type 计算方式
 * @param {number} b 后面的值
 * @example 
 * ```js
 * // 可链式调用
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
 */
function computeNumber(a, type, b) {
  /**
   * 获取数字小数点的长度
   * @param {number} n 数字
   */
  function getDecimalLength(n) {
    const decimal = n.toString().split(".")[1];
    return decimal ? decimal.length : 0;
  }
  /**
   * 修正小数点
   * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
   * @param {number} n
   */
  const amend = (n, precision = 15) => parseFloat(Number(n).toPrecision(precision));
  const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
  let result = 0;

  a = amend(a * power);
  b = amend(b * power);

  switch (type) {
    case "+":
      result = (a + b) / power;
      break;
    case "-":
      result = (a - b) / power;
      break;
    case "*":
      result = (a * b) / (power * power);
      break;
    case "/":
      result = a / b;
      break;
  }

  result = amend(result);

  return {
    /** 计算结果 */
    result,
    /**
     * 继续计算
     * @param {"+"|"-"|"*"|"/"} nextType 继续计算方式
     * @param {number} nextValue 继续计算的值
     */
    next(nextType, nextValue) {
      return computeNumber(result, nextType, nextValue);
    },
    /**
     * 小数点进位
     * @param {number} n 小数点后的位数
     * - 应用场景：商品价格`100`，用了优惠券结算价格为`33.333333...`，取小数点两位则是`33.33`；
     * - 如果有`1000`个人都以`33.33`去结算的话，那么最终就会损失`3`块钱，以此类推；
     * - 所以该方法就是在小数取位后面补`1`，像这样：
     * ```js
     * const price1 = 33.333;
     * price1.toHex(2); // 输出 33.34
     * const price2 = 33.33;
     * price2.toHex(2); // 输出 33.33
     * const price3 = 12.1212
     * price3.toHex(1); // 输出 12.2
     * ```
     */
    toHex(n) {
      const strings = result.toString().split(".");
      if (n > 0 && strings[1] && strings[1].length > n) {
        const decimal = strings[1].slice(0, n);
        const value = Number(`${strings[0]}.${decimal}`);
        const difference = 1 / Math.pow(10, decimal.length);
        result = computeNumber(value, "+", difference).result;
      }
      return result;
    }
  }
}

/**
 * Math.hypot 兼容方法
 * @param {Array<number>} values 
 */
function hypot(...values) {
  const length = values.length;
  let result = 0;
  for (let i = 0; i < length; i++) {
    if (values[i] === Infinity || values[i] === -Infinity) {
      return Infinity;
    }
    result += values[i] * values[i];
  }
  return Math.sqrt(result);
}

/**
 * 获取两个坐标（二维）之间距离
 * @param {{x: number, y: number}} size1 坐标一
 * @param {{x: number, y: number}} size2 坐标二
 */
function getSizeDistance(size1, size2) {
  const dx = size2.x - size1.x;
  const dy = size2.y - size1.y;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  // return hypot(size2.x - size1.x, size2.y - size1.y);
}

/**
 * 传入角度计算圆周长上的点坐标
 * @param {number} deg 角度
 * @param {number} radius 范围半径
 */
function computeCircularPosition(deg = 0, radius = 100) {
  const x = Math.round(radius * Math.sin(deg * Math.PI / 180));
  const y = Math.round(radius * Math.cos(deg * Math.PI / 180));
  return { x, y }
}

/**
 * 获取两个坐标（经纬度）点距离
 * @param {object} location1 坐标1
 * @param {number} location1.lng 经度
 * @param {number} location1.lat 维度
 * @param {object} location2 坐标2
 * @param {number} location2.lng 经度
 * @param {number} location2.lat 维度
 */
function getLocationDistance(location1, location2) {
  const toRad = d => d * Math.PI / 180;
  const radLat1 = toRad(location1.lat);
  const radLat2 = toRad(location2.lat);
  const deltaLat = radLat1 - radLat2;
  const deltaLng = toRad(location1.lng) - toRad(location2.lng);
  const dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;
}

/**
 * 检测两个节点坐标是否相交
 * @param {{left: number, top: number, width: number, height: number}} a 
 * @param {{left: number, top: number, width: number, height: number}} b 
 */
function isCollision(a, b) {
  const ax = a.left;
  const ay = a.top;
  const aw = a.width;
  const ah = a.height;
  const bx = b.left;
  const by = b.top;
  const bw = b.width;
  const bh = b.height;
  return (ax + aw > bx && ax < bx + bw && ay + ah > by && ay < by + bh);
}
