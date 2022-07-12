// -------------------------------- Dom 类工具函数 --------------------------------

/**
 * 单个元素查找
 * @param {string} name class | id | label: `div`、`p`
 * @returns {HTMLElement}
 */
function find(name) {
  return document.querySelector(name);
}

/**
 * 多个元素查找
 * @param {string} name class | id | label <div> <p>
 * @returns {Array<HTMLElement>}
 */
function findAll(name) {
  let nodes = document.querySelectorAll(name);
  if (Array.from) {
    nodes = Array.from(nodes);
  } else {
    nodes = [].slice.call(nodes);
  }
  return nodes;
}

/**
 * 设置样式
 * @param {HTMLElement} el 设置样式的元素
 * @param {CSSStyleDeclaration} styles 样式 
 */
function setStyle(el, styles) {
  for (const key in styles) {
    el.style[key] = styles[key];
  }
}

/**
 * 检测元素是否存在指定 calss
 * @param {HTMLElement} el 当前元素
 * @param {string} className class name
 */
function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
  }
}

/**
 * 给元素添加 calss
 * @param {HTMLElement} el 当前元素
 * @param {string} className class name
 */
function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!hasClass(el, className)) {
      let name = el.className.charAt(el.className.length - 1) === " " ? className : " " + className;
      el.className += name;
    }
  }
}

/**
 * 给元素移除指定 calss
 * @param {HTMLElement} el 当前元素
 * @param {string} className class name
 */
function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    if (hasClass(el, className)) {
      let reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
      el.className = el.className.replace(reg, " ");
    }
  }
}

/**
 * 切换 calss name
 * @param {HTMLElement} el 当前元素
 * @param {string} className class name
 */
function toggleClass(el, className) {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    if (hasClass(el, className)) {
      removeClass(el, className);
    } else {
      addClass(el, className);
    }
  }
}

/**
 * 动画帧更新
 * @param {() => void} callback 动画帧函数
 */
function update(callback = null) {
  if (typeof callback !== "function") return console.log("缺少动画函数");
  /** 动画帧 */
  const AnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  /** 动画开始 */
  function move() {
    callback();
    // 判断当前函数销毁或者类型更变之后停止刷帧操作
    typeof callback === "function" && AnimationFrame(move);
  }
  move();
}

/**
 * `rem`适配
 * @param {HTMLElement} el 指定元素
 * @param {number} designWidth 设计稿的宽度：之后的单位直接`1:1`使用设计稿的大小，单位是`rem`
 * @description [一行css适配rem](https://juejin.im/post/6844904066418491406/#heading-13)
 */
function remSetting(el, designWidth = 750) {
  const html = document.documentElement; // 注意这里不能使用 document.body
  /** 视口宽度 */
  let width = el.clientWidth;
  // 首次适配
  html.style.fontSize = width / designWidth + "px";
  // 窗口变动时更新适配
  window.addEventListener("resize", function () {
    width = el.clientWidth;
    html.style.fontSize = width / designWidth + "px";
  });
}

/**
 * 设置节点数字动画
 * @param {object} options 配置参数
 * @param {HTMLElement} options.el 目标节点
 * @param {number} options.number 最终显示的数字
 * @param {number} options.decimals 小数位（传`0`则为整数）
 * @param {number} options.time （可选）多少毫秒内完成，默认1秒
 * @param {() => void} options.callback （可选）完成回调
 */
function setNumberAnimation(options) {
  const animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  const el = options.el;
  const int = options.decimals == 0;
  const result = options.number || 188.88;
  const time = (options.time || 1000) / 1000;
  const step = result / (time * 60);
  let count = 0;
  function move() {
    count += step;
    if (count >= result) {
      count = result;
      el.textContent = int ? Math.round(count) : count.toFixed(options.decimals);
      typeof options.callback === "function" && options.callback();
    } else {
      el.textContent = int ? Math.round(count) : count.toFixed(options.decimals);
      animation(move);
    }
  }
  el.textContent = count;
  move();
}

/** 
 * 获取`<body></body>`标签中的所有内容 
 * @param {string} value 
 */
function getBodyLabelContent(value) {
  // value = value.replace(/\n/g, "");
  const rule = /<[^>]*?body[^>]*?>([\s\S]*)<\/\s*body\s*>/;
  // console.log(rule.exec(value));
  const result = rule.exec(value);
  if (result && result.length === 2) {
    return result[1];
  }
  return value;
}

/**
 * 获取所有`<script></script>`标签的内容
 * @param {string} value 
 */
function getAllScriptContent(value) {
  const rule = /<[^>]*?script[^>]*?>[\s\S]*<\/\s*script\s*>/i;  // /<script id="main">([\s\S]*)<\/script>/;
  const start = /<script[^>]*?>/g; // <[^>]*?script[^>]*?>
  const end = /<\/\s*script\s*>/g;
  const code = rule.exec(value);
  let result = "";
  // console.log(code);
  if (code && code.length === 1) {
    result = code[0];
  }
  // console.log(result.replace(start, ""));
  return result.replace(start, "").replace(end, ";");
}

/**
 * 标签过滤器，只过滤标签，保留内容
 * @param {string} val 要过滤的内容
 * @param {string} label 是否过滤指定标签，不指定时则过滤掉所有`html`标签、空格、换行符
 */
function htmlLabelFilter(val, label) {
  let result = "";
  if (!val) return result;
  if (label) {
    const start = new RegExp(`<(${label})[^>]*>`, "gi");
    const end = new RegExp(`</(${label})[^>]*>`, "gi");
    result = val.replace(start, "").replace(end, "");
  } else {
    result = val.replace(/<[^>]+>|&[^>]+;/g, "");
    result = result.replace(/[|]*\n/g, "");
    result = result.replace(/&npsp;/ig, "");
  }
  return result;
}
