// -------------------------------- Array 类工具函数 --------------------------------

/**
 * es5兼容es6 "Array.find"
 * @template T
 * @param {Array<T>} array
 * @param {(value: T, index: number) => boolean} compare 对比函数
 */
function findItem(array, compare) {
  var result = null;
  for (var i = 0; i < array.length; i++) {
    var value = array[i];
    if (compare(value, i)) {
      result = value;
      break;
    }
  }
  return result;
}

/**
 * es5兼容es6 "Array.findIndex"
 * @template T
 * @param {Array<T>} array 
 * @param {(value: T, index: number) => boolean} compare 对比函数
 */
function findIndex(array, compare) {
  var result = null;
  for (var i = 0; i < array.length; i++) {
    if (compare(array[i], i)) {
      result = i;
      break;
    }
  }
  return result;
}

/**
 * 自定义对象数组去重
 * @template T
 * @param {Array<T>} array 
 * @param {(a: T, b: T) => void} compare 对比函数
 * @example 
 * ```js
 * const list = [{ id: 10, code: "abc" }, {id: 12, code: "abc"}, {id: 12, code: "abc"}];
 * findIndex(list, (a, b) => a.id == b.id)
 * ```
 */
function filterRepeat(array, compare) {
  return array.filter((element, index, self) => {
    // return findIndex(self, el => compare(el, element)) === index;
    return self.findIndex(el => compare(el, element)) === index;
  })
}

/**
 * 扁平化数组
 * - `Array.flat()`兼容写法
 * @template T
 * @param {Array<T>} array 目标数组
 * @param {number} d 层数
 * @returns {Array<T>}
 */
function flatArray(array, d = 1) {
  if (d > 0) {
    return array.reduce((pre, val) => pre.concat(Array.isArray(val) ? flatArray(val, d - 1) : val), []);
  } else {
    return array.slice();
  }
}

/**
 * 随机打乱数组
 * @template T
 * @param {Array<T>} array
 */
function shuffleArray(array) {
  // return array.sort(() => Math.random() > 0.5 ? -1 : 1);
  // 洗牌随机法（性能最优）
  for (let i = array.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let itemAtIndex = array[randomIndex];
    array[randomIndex] = array[i];
    array[i] = itemAtIndex;
  }
  return array;
}

/**
 * 数组中随机取几个元素
 * @template T
 * @param {Array<T>} array 数组
 * @param {number} count 元素个数
 */
function getRandomArrayElements(array, count) {
  let length = array.length;
  let min = length - count;
  let index = 0;
  let value = "";
  while (length-- > min) {
    index = Math.floor((length + 1) * Math.random());
    value = array[index];
    array[index] = array[length];
    array[length] = value;
  }
  return array.slice(min);
}

/**
 * 将指定位置的元素置顶
 * @template T
 * @param {Array<T>} array 改数组
 * @param {number} index 元素索引
 */
function zIndexToTop(array, index) {
  if (index != 0) {
    const item = array[index];
    array.splice(index, 1);
    array.unshift(item);
  } else {
    console.log("已经处于置顶");
  }
}

/**
 * 将指定位置的元素置底
 * @template T
 * @param {Array<T>} array 改数组
 * @param {number} index 元素索引
 */
function zIndexToBottom(array, index) {
  if (index != array.length - 1) {
    const item = array[index];
    array.splice(index, 1);
    array.push(item);
  } else {
    console.log("已经处于置底");
  }
}