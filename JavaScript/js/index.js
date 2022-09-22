// 类型提示用（运行时不会引用）
/// <reference path="../utils/dom.js" />
/// <reference path="../utils/array.js" />

// 阻止事件冒泡
// event.cancelBubble = true;
// event.stopPropagation(); //  阻止事件向上传播
// event.preventDefault();  //  取消事件的默认动作。submit类型标签有效
// addEventListener中的第三个参 数是useCapture,一个bool类型。
// 当为false时为冒泡获取(由里向外)，true为capture方式(由外向里)
// 等价于jQuery的 $(document).ready()
// window.addEventListener("DOMContentLoaded", functionName) // mouseover, mouseout:hover()

// 永久储存
// localStorage.setItem("key","value"); 以“key”为名称存储一个值“value”
// localStorage.getItem("key"); 获取名称为“key”的值
// 周期储存（浏览器关闭之前）
// sessionStorage.setItem("","")
// sessionStorage.getItem("")

/** 点击测试 */
function clickTest() {
  /** 总数 */
  const total = 5;
  /** 按钮列表容器 */
  const buttonListEl = find(".button_list");

  for (let i = 0; i < total; i++) {
    const btn = document.createElement("button");
    btn.textContent = `测试按钮-${i + 1}`;
    btn.setAttribute("btn", "");
    btn.setAttribute("blue", "");
    btn.dataset.id = i + 1;
    buttonListEl.appendChild(btn);
  }

  // 使用事件代理 添加点击事件 (事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件)
  buttonListEl.addEventListener("click", function (e) {
    /**
     * @type {HTMLElement}
     */
    const btn = e.target;
    // console.dir(btn);
    if (btn.tagName.toLowerCase() == "button") {
      console.log("按钮id", btn.dataset.id, btn.hasAttribute("blue"));
      if (btn.hasAttribute("blue")) {
        btn.removeAttribute("blue");
        btn.setAttribute("green", "");
      } else {
        btn.removeAttribute("green");
        btn.setAttribute("blue", "");
      }
    }
  });

  // 事件代理高级：由内到外查找节点
  // buttonListEl.addEventListener("click", function (e) {
  //     let target = e.target;
  //     while(target !== buttonListEl){
  //        if(target.tagName.toLowerCase() == "button"){
  //            // console.log(target.dataset.id);
  //            break;
  //        }
  //        target = target.parentNode;
  //     }
  // });

}
clickTest();

/**
 * 工厂模式下不需要 new 因为他本身就是创建一个新的对象
 * @param {string | HTMLElement} name class | id | label <div> <p>
 */
function $(name) {
  /**
   * 选中dom
   * @type {HTMLElement | Array<HTMLElement>}
   */
  var node = name;

  /**
   * 元素类型
   * @type {"single" | "array"}
   */
  var type = "single";

  if (typeof name == "string") {
    node = [].slice.call(document.querySelectorAll(name));
    type = "array";
  }

  /**
   * 列遍节点
   * @param {Array<HTMLElement>} array 
   * @param {function(HTMLElement, number)} callback 
   */
  function forEach(array, callback) {
    for (var i = 0; i < array.length; i++) {
      array[i]["index"] = i;
      if (typeof callback === "function") callback(array[i], i);
    }
  }

  /**
   * 解绑事件
   * @param {HTMLElement} el 解绑事件的节点
   * @param {string} method 方法名
   */
  function offEvent(el, method) {
    /**
     * @type {Array<{fn: Function, type: string}>}
     */
    var list = el["the_eventList"];
    for (var i = list.length - 1; i >= 0; i--) {
      var item = list[i];
      if (method) {
        if (method == item.type) {
          el.removeEventListener(method, item.fn);
          list.splice(i, 1);
        }
      } else {
        el.removeEventListener(item.type, item.fn);
        list.splice(i, 1);
      }
    }
  }

  /** 工厂对象 */
  var factory = {
    /** 当前dom */
    el: node,

    /**
     * 修改 html
     * @param {string} content 
     */
    html: function (content) {
      if (type == "array") {
        forEach(this.el, function (item, index) {
          item.innerHTML = content;
        });
      } else {
        this.el.innerHTML = content;
      }
      return factory;
    },

    /**
     * 添加事件
     * @param {string} method 事件
     * @param {Function} callback 
     */
    on: function (method, callback) {
      if (type == "array") {
        forEach(this.el, function (item, index) {
          item.addEventListener(method, callback);
          // 添加事件到自定义数组中，解绑用
          if (!item["the_eventList"]) {
            item["the_eventList"] = [];
          }
          item["the_eventList"].push({
            type: method,
            fn: callback
          });
        });
      } else {
        this.el.addEventListener(method, callback);
      }
      return factory;
    },

    /**
     * 解绑事件
     * @param {string} method 要解绑的事件（可选）
     */
    off: function (method) {
      if (type == "array") {
        forEach(this.el, function (item, index) {
          offEvent(item, method);
        });
      } else {
        offEvent(this.el, method);
      }
      return factory;
    }
  };

  return factory;
}

// jQuery 的链式实现
// $(".button_list button").html("工厂模式更改").on("click", function () {
//     $(this).html(`click-${this.index+1}`);
//     console.log("工厂模式打印按钮索引", this.index);
//     setTimeout(function() {
//         $(".button_list button").off("click").html("取消点击事件");
//     }, 500);
// });

/** 字符串类型 */
function stringModule() {
  let string = "www.https/#/hjihsaih/#/sad.com";
  let code = "CEde_128,1214534";
  let value = 456;
  // 将任意值转换成字符串
  String(value);
  // 关键字以外转字符串 toString(num) 可带参数转进制，限定 number.toString(num);
  value.toString();
  // 对字符串进行编码(数字和英文不变)
  encodeURIComponent();
  // 对应的解码     
  decodeURIComponent();
  // 过滤数字
  let filterNum = string.replace(/\d+/g, "");
  // 过滤英文
  let filterEnglish = string.replace(/[a-zA-Z]/g, "");
  /**
   * 检测字符串是否存在指定字符串
   * ES6 && ES5
   * array 同样适用
   */
  string.includes("name");    // return false true              
  string.search("name");      // return -1 or index
  // 正则替换：i不区分大小写，g是全局 
  let regular = string.replace(/#/i, "?#");
  // 下面这种替换性能会更好点，但是不够灵活，只能是全局替换
  let replace = string.split("#").join("?#");
  // 截取从","之后的字符串
  let _code = code.slice(code.indexOf(",") + 1);

  /** 
   * ES5 
   * Objeco.keys(obj)
   * ES6
   * Objeco.values(obj);
   * Objeco.entries(obj);
  */
}

/** 数组类型 */
function arrayModule() {
  // 数组处理
  array.join("&");
  array.split(",");   // 把字符串分割成数组
  array.slice(index, num); // 索引截取数组 从 index 开始往往后截取 num 不填则 index 之后的都截取掉
  array.shift();      // 移除第一项 并返回第一项
  array.unshift();    // 在第一项添加
  array.pop();        // 移除最后一项 并返回最后一项
  array.push();       // 在第一项添加
  array.reverse();    // 反转数组
  Math.ceil(25.9);    // 向上取舍
  Math.round(25.9);   // 四舍五入
  Math.floor(25.9);   // 向下取舍
  // 1~100 随机一个数
  Math.floor(100 * Math.random()) + 1;
  // 把数字，小数点 格式化为指定的长度
  number.toPrecision(3);
  // 保留小数位
  number.toFixed(2);
  // 历遍数组结果 所有成立才返回 true
  var everyResult = array.every(function (item, index, array) {
    return (item > 2);
  });
  // 历遍数组结果 有一个成立返回 true
  var someResult = array.some(function (item, index, array) {
    return (item > 2);
  });
  // 过滤一个数组
  var filterResult = array.filter(function (item, index, array) {
    return (item > 2);
  });
  // 在原有数组中运行传入函数
  var mapResult = array.map(function (item, index, array) {
    return item * 2;
  });
  // 数组累加 values.reduceRight() 反向执行
  var sum = values.reduce(function (prev, cur, index, array) {
    return prev + cur;
  });

  // 数组排序从小到大
  let stob = (a, b) => a - b;
  array.sort(stob);

  /**
   * 数组对象排序从小到大
   * @param {string} key 对象key值
   */
  function compare(key) {
    return function (obj1, obj2) {
      let val1 = obj1[key],
        val2 = obj2[key];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      return val1 - val2;
    }
  }
  array.sort(compare("key"));

  /** 多个key值排列判断 */
  function demo(a, b) {
    if (Number(a.level) === Number(b.level)) {
      return Number(a.levelscore) - Number(b.levelscore);
    } else {
      return Number(a.level) - Number(b.level);
    }
  }
}

function disc() {
  /** 抽奖概率范围 */
  const range = parseInt(100 * Math.random()) + 1;
  /** 概率列表（加起来必须是100） */
  const list = [1, 5, 54, 20, 10, 10];
  /** 概率索引 */
  let index = 0;
  /** 单个概率 */
  let rate = 0;
  // console.log("随机数", range);
  for (let i = 0; i < list.length; i++) {
    const number = list[i];
    rate += number;
    if (range <= rate) {
      index = i;
      break;
    }
  }
  console.log(`概率 ${list[index]}%，索引 ${index}`);
}

/** 数字类型扩展 */
function numberExtend() {
  Number.MAX_SAFE_DIGITS = Number.MAX_SAFE_INTEGER.toString().length - 2;
  Number.prototype.digits = function () {
    var result = (this.valueOf().toString().split(".")[1] || "").length;
    return result > Number.MAX_SAFE_DIGITS ? Number.MAX_SAFE_DIGITS : result;
  }
  Number.prototype.add = function (val = 0) {
    if (typeof val !== "number") return console.warn("请输入正确的数字");
    const value = this.valueOf();
    const thisDigits = this.digits();
    const valDigits = val.digits();
    const baseNum = Math.pow(10, Math.max(thisDigits, valDigits));
    const result = (value * baseNum + val * baseNum) / baseNum;
    if (result > 0) {
      return result > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : result;
    } else {
      return result < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : result;
    }
  }
  Number.prototype.minus = function (val = 0) {
    if (typeof val !== "number") return console.warn("请输入正确的数字");
    const value = this.valueOf();
    const thisDigits = this.digits();
    const valDigits = val.digits();
    const baseNum = Math.pow(10, Math.max(thisDigits, valDigits));
    const result = (value * baseNum - val * baseNum) / baseNum;
    if (result > 0) {
      return result > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : result;
    } else {
      return result < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : result;
    }
  }
}

function sort() {
  const key = 3;
  const arr1 = ["A1", "A2", "B1", "B2", "D1", "D2", "C1", "C2"];
  const arr2 = ["A", "B", "C", "D"].map(item => item + key);
  let result = [].concat(arr1, arr2);
  result.sort();
  result = result.map(item => item.replace(key, ""));
  console.log(result);
}

function checkDebugging() {
  const doc = document;
  // 禁止鼠标事件和键盘事件打开开发者模式
  doc.oncontextmenu = function () {
    return false;
  }
  doc.onkeydown = doc.onkeyup = doc.onkeypress = function (event) {
    const e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 123) {
      e.returnValue = false;
      return false;
    }
  }
  // 监听是否开发者模式
  const handler = setInterval(() => {
    const before = Date.now();
    debugger;
    if (Date.now() - before > 100) {
      // 是开发者模式就跳转百度
      location.replace("https://www.baidu.com");
      clearInterval(handler);
    }
  }, 500);
}

/**
 * 获取图片数据（二进制数据流）
 * @param {string} src 请求图片路径
 * @param {(code: string) => void} callback 回调函数
 */
function getImageData(src, callback) {
  const XHR = new XMLHttpRequest();
  XHR.open("GET", src, true);
  XHR.responseType = "arraybuffer";
  XHR.overrideMimeType("text/plain; charset=x-user-defined");
  XHR.onreadystatechange = function () {
    if (XHR.readyState === 4 && XHR.status === 200) {
      const file = XHR.response || XHR.responseText;
      const blob = new Blob([file], { type: "image/jpeg" });
      const fr = new FileReader();
      // console.log("Blob", blob);
      fr.readAsText(blob);
      fr.onload = function (e) {
        /** @type {string} */
        const code = e.target.result;
        // console.log(code);
        typeof callback === "function" && callback(code);
      }
    }
  }
  XHR.send();
}
// getImageData("https://resxz.eqh5.com/qngroup001%2Fu12212%2F1%2F0%2Fde6d163bd2f14598b9d89bb58607a8ad.jpeg", (code) => {
//     console.log(code);

// });

/**
 * 将图片画成圆并返回`base64`
 * @param {string} imgUrl 图片路径
 * @param {number} width 设置图片的宽度/高度
 * @param {(res: string) => void} callback base64回调
 */
function circleImage(imgUrl, width, callback) {
  const img = new Image();
  const canvas = document.createElement("canvas");
  const contex = canvas.getContext("2d");
  const circle = {
    x: width / 2,
    y: width / 2,
    r: width / 2
  };
  img.crossOrigin = "Anonymous";
  img.src = imgUrl;
  img.onload = function () {
    canvas.width = width;
    canvas.height = width;
    contex.clearRect(0, 0, width, width);
    contex.save();
    contex.beginPath();
    contex.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
    contex.clip();
    contex.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, width);
    contex.restore();
    callback(canvas.toDataURL("image/png"));
  }
}

function getCanvasData() {
  /**
   * Base64字符串转二进制
   * @param {string} base64 
  */
  function base64ToBlob(base64) {
    let arr = base64.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }

  /**
   * 获取base64数据
   * @param {string} url 图片路径
   * @param {string} ext 图片格式
   * @param {(res: string) => void} callback 结果回调
   */
  function getBase64Info(url, ext, callback) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image;
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = function () {
      console.log(img.height, img.width);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL("image/" + ext);
      const blob = base64ToBlob(base64);
      const fr = new FileReader();
      // console.log(blob);
      fr.readAsText(blob);
      fr.onload = function (e) {
        /** @type {string} */
        const code = e.target.result;
        // console.log(code);
        const index = code.search("data=");
        const res = code.slice(index + 5, code.length);
        typeof callback === "function" && callback(res);
      }
    };
    // document.body.innerHTML = null;
    // document.body.appendChild(canvas);
  }

  let path = "https://resxz.eqh5.com/qngroup001%2Fu12212%2F1%2F0%2Fde6d163bd2f14598b9d89bb58607a8ad.jpeg";

  getBase64Info(path, "jpeg", res => {
    // console.log("图片数据", res);
    // console.log(atob(res));

  });
}

/**
 * 数字转中文
 * @param {number} number 
 */
function getNumCNSpell(number) {
  if (number < 0) return console.warn('数字必须大于零');
  const numMapSpell = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const posMapUnit = ["", "十", "百", "千"];
  const splitUnit = ["", "万", "亿"];
  const value = number.toString();
  const length = value.length;
  let result = "";
  let count = 0

  for (let i = 0; i < length; i++) {
    const index = length - i - 1;   // 反序索引
    const pos = index % 4;          // 千百十个 -> 3210
    const str = value[i];

    if (str === "0") {
      count++;
    }
    else {
      if (count > 0) {
        result += "零"
        count = 0
      }
    }

    if (pos === 0 && str === "2" && i === 0 && length > 4) {
      // 两万 两亿的情况
      result += "两";
    } else if (pos === 1 && str === "1" && (i - 1 < 0 || value[i - 1] === "0") && (i - 2 < 0 || value[i - 2] === "0")) {
      // 十一，十二 不读一的情况
      result += "";
    } else if (pos >= 2 && str === "2") {
      // 千位，百位读两
      result += "两";
    } else {
      if (str !== "0") {
        result += numMapSpell[value[i]];
      }
    }

    if (str !== "0") {
      result += posMapUnit[pos];
    }

    if (index % 4 === 0 && count < 4) {
      result += splitUnit[Math.floor(index / 4)];
    }
  }
  return result;
}

/**
 * 文档加载完成等同于`jQuery $ready()`
 * @param {Function} fn 
 */
function documentReady(fn) {
  // 严格模式
  // function onReady () {
  //     document.removeEventListener("DOMContentLoaded", onReady);
  //     typeof fn === "function" && fn();
  // }
  // document.addEventListener("DOMContentLoaded", onReady);

  // 非严格模式
  document.addEventListener("DOMContentLoaded", function () {
    document.removeEventListener("DOMContentLoaded", arguments.callee);
    typeof fn === "function" && fn();
  });
}

/**
 * 加载图片列表获取图片对象，canvas中绘制图片用
 * @param {Array<string>} imgList 图片列表
 * @param {(res: Array<HTMLImageElement>) => void} complete 全部加载完成回调
 * @param {(count: number, err: string) => void} loading 加载进度回调
 */
function loadImages(imgList, complete, loading) {
  /** 总数 */
  const total = imgList.length;
  /** 加载完成图片列表 */
  const images = [];
  /** 加载个数 */
  let loadCount = 0;

  /**
   * 加载图片
   * @param {string} path 图片路径
   */
  function loadImage(path) {
    const image = new Image();
    image.onload = function () {
      images.push(image);
      check();
    }
    image.onerror = function () {
      check(path);
    }
    image.src = path;
  }

  /**
   * 加载监听
   * @param {string} path 图片路径
   */
  function check(path = null) {
    loadCount++;
    typeof loading === "function" && loading(loadCount, path);
    if (loadCount == total) {
      typeof complete === "function" && complete(images);
    }
  }

  for (let i = 0; i < imgList.length; i++) {
    const src = imgList[i];
    loadImage(src);
  }
}
// loadImages(images, res => {
//     console.log(res);

// }, (count, err) => {
//     console.log(count, err);

// });

const mousemoveEl = find('.mousemove');

/**
 * 
 * @param {MouseEvent} e
 */
function dmove(e) {
  mousemoveEl.children[0].textContent = `防抖函数：(x:${e.offsetX},y:${e.offsetY})`;
}

/**
 * 
 * @param {MouseEvent} e
 */
function tmove(e) {
  // console.log(e);
  mousemoveEl.children[1].textContent = `节流函数：(x:${e.offsetX},y:${e.offsetY})`;
}

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {number} wait 执行间隔毫秒
 */
function debounce(fn, wait) {
  let timer;
  return function () {
    const args = arguments;
    const THAT = this;
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(THAT, args);
    }, wait);
  }
}

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {number} wait 执行间隔毫秒
 */
function throttle(fn, wait) {
  let time = 0;
  return function () {
    const args = arguments;
    const now = Date.now();
    if (now - time >= wait) {
      fn.apply(this, args);
      time = now;
    }
  }
}

const debounceMove = debounce(dmove, 500);
const throttleMove = throttle(tmove, 300);

mousemoveEl.addEventListener('mousemove', debounceMove);
mousemoveEl.addEventListener('mousemove', throttleMove);

/**
 * @type {HTMLElement}
 */
const contentEl = find('.content');

console.log(contentEl.previousSibling, contentEl.previousElementSibling);

console.log(contentEl.nextSibling, contentEl.nextElementSibling);

function theCode() {
  const secret = ["gailiuzi", "yigiuwoligiao", "ningpeima", "aoligei", "wuwukai", "shehuizhuyi", "maideduo"];
  const index = new Date().getDay();

  function encode() {
    const value = secret[index];
    const list = value.split("");
    let code = Math.random().toString(36).substr(2);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      code = code.replace(item, "");
    }
    const time = "_" + (Date.now() / 2 + 3) / 4 + 5
    return shuffleArray((value + code).split("")).join("") + time;
  }

  const code = encode();
  console.log(code);

  /**
   * 获取数组元素出现次数对象
   * @param {Array<T>} array 
   */
  function getArrayItemCount(array) {
    const result = {};
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (result.hasOwnProperty(item)) {
        result[item]++;
      } else {
        result[item] = 1;
      }
    }
    return result;
  }

  /**
   * 对应的解码
   * @param {string} code 
   */
  function decode(code) {
    const list = code.split("_");
    if (list.length !== 2) return false;
    code = list[0].split("");
    const now = Date.now();
    const time = new Date(((list[1] - 5) * 4 - 3) * 2).getTime();
    if (now - time > 5 * 1000) return false;
    const value = secret[index].split("");
    if (code.length < value.length) return false;
    const codeObject = getArrayItemCount(code);
    const valueObject = getArrayItemCount(value);
    for (const key in valueObject) {
      if (codeObject.hasOwnProperty(key)) {
        if (valueObject[key] != codeObject[key]) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  setTimeout(function () {
    const result = decode(code) ? "通过" : "不通过"
    console.log(result);
  }, 1000)
}
// theCode();

/**
 * 自定义事件
 * - 事件监听、解绑、派发
 */
function moduleEvent() {
  /**
   * 事件集合对象
   * @type {{[key: string]: Array<Function>}}
   */
  const eventMap = {};

  return {
    /**
     * 添加事件
     * @param {string} name 事件名
     * @param {Function} fn 事件执行的函数
     */
    on(name, fn) {
      if (!eventMap.hasOwnProperty(name)) {
        eventMap[name] = [];
      }
      if (!eventMap[name].some(item => item === fn)) {
        eventMap[name].push(fn);
      }
    },

    /**
     * 解绑事件
     * @param {string} name 事件名
     * @param {Function} fn 事件绑定的函数
     */
    off(name, fn) {
      const fns = eventMap[name];
      if (fns && fns.length > 0 && fn) {
        for (let i = 0; i < fns.length; i++) {
          const item = fns[i];
          if (item === fn) {
            fns.splice(i, 1);
            break;
          }
        }
      } else {
        console.log("[moduleEvent] => 没有要解绑的事件");
      }
    },

    /**
     * 调用事件
     * @param {string} name 事件名
     * @param {any} params 事件参数
     */
    dispatch(name, params) {
      const fns = eventMap[name];
      if (fns && fns.length > 0) {
        for (let i = 0; i < fns.length; i++) {
          const fn = fns[i];
          fn(params);
        }
      } else {
        console.log("[moduleEvent] => 没有要执行的事件");
      }
    }
  }
}

/**
 * 全局计时器
 * @param {number} interval 间隔-毫秒
 */
function moduleInterval(interval) {
  /**
   * 函数对象
   * @type {{[key: number]: Function}}
   */
  let timerMap = {};
  /** 
   * 倒计时`id` 
   * @type {number}
   */
  let timerId;
  /** 一直累加的`id` */
  let id = 0;

  /** 开始计时器 */
  function start() {
    stop();
    timerId = setInterval(function () {
      for (const key in timerMap) {
        const fn = timerMap[key];
        fn();
      }
    }, interval);
  }

  /** 停止计时器 */
  function stop() {
    if (timerId) clearInterval(timerId);
    timerId = undefined;
  }

  return {
    start,
    stop,
    /** 清空所有计时器 */
    clear() {
      timerMap = {}
    },
    /**
     * 添加倒计时函数-有`this`的情况下要`bind(target)`
     * @param {Function} fn 
     */
    add(fn) {
      id++;
      timerMap[id] = fn;
      return id;
    },
    /**
     * 移除倒计时函数
     * @param {number} id 添加时返回的`id`
     */
    remove(id) {
      if (Object.prototype.hasOwnProperty.call(timerMap, id)) {
        delete timerMap[id]
      }
    }
  }
}

/**
 * 自定义样式打印
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.content
 * @param {string?} options.backgroundColor
 */
function customizeConsole(options) {
  const settings = [
    `%c ${options.title} %c ${options.content} `,
    `padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060 ;`,
    `padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: ${options.backgroundColor || "#42c02e"} ;`
  ];
  console.log.apply(console, settings);
};

/**
 * 对比两组`json`，并找出不同值
 * @param {object} t1 
 * @param {object} t2 
 */
function compareJSON(t1, t2) {
  /**
   * 结果对象
   * @type {{ [key: string]: { v1: string, v2: string} }}
   */
  const info = {}
  for (const key in t1) {
    if (!Object.prototype.hasOwnProperty.call(t2, key) || t2[key] !== t1[key]) {
      info[key] = {
        v1: t1[key],
        v2: ""
      }
    }
  }
  for (const key in t2) {
    if (!Object.prototype.hasOwnProperty.call(t1, key) || t1[key] !== t2[key]) {
      if (info[key]) {
        info[key].v2 = t2[key]
      } else {
        info[key] = {
          v1: "",
          v2: t2[key]
        }
      }
    }
  }
  return info
}

/**
 * 只执行一次函数
 * @param {Function} fn 
 */
function once(fn) {
  let called = false;
  return function _once() {
    if (called) {
      return _once.value;
    }
    called = true;
    _once.value = fn.apply(this, arguments);
  }
}

class Singleton {
  /**
   * 私有单例对象
   * @type {Singleton}
   */
  static #instance;

  /**
   * 当前单例对象
   */
  static get instance() {
    if (!this.#instance) {
      this.#instance = new Singleton();
    }
    return this.#instance;
  }

  /**
   * @private
   * 
   * `typescript`中，可以添加`private`关键字来私有化构造函数
   * 这样就不能在外部调用`new Singleton`了，仅此只有一个`Singleton.instance`
   */
  constructor() {
    this.time = `Singleton 实例化时间 ${new Date().toLocaleString()}`;
  }

  log() {
    console.log(this.time);
  }

  time = "";

}

