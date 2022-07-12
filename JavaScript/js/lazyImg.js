/**
 * 图片懒加载（传统做法）
 * @param {object} params 传参对象
 * @param {number?} params.toBottom 距离底部像素加载开始加载（可选）
 * @param {string?} params.errorImage 加载失败时显示的图片路径（可选）
 * @param {string?} params.lazyAttr 自定义加载的属性（可选）
 * @param {number?} params.interval 函数节流间隔`毫秒`为单位（可选） 
 * @param {() => void} params.callback 全部加载完回调（可选）
 */
function lazyLoadImage(params) {
  const doc = document;
  /** 懒加载属性类型 */
  const attr = params.lazyAttr || "lazy";
  /** 函数节流间隔 */
  const space = params.interval || 100;
  /** 距离底部距离 */
  const offset = params.toBottom || 0;
  /** 上一次代码执行时间（节流用） */
  let before = 0;
  /**
   * 加载图片
   * @param {HTMLImageElement} el 图片节点
   */
  function loadImage(el) {
    /** 缓存当前 src 加载失败时候用 */
    const cache = el.src;
    el.src = el.getAttribute(attr);
    el.removeAttribute(attr);
    // 图片加载失败
    el.onerror = function () {
      el.src = params.errorImage || cache;
    }
  }
  /** 判断监听图片加载 */
  function judgeImages() {
    const now = Date.now();
    if (now - before < space) return;
    before = now;
    const images = doc.querySelectorAll(`[${attr}]`);
    const viewHeight = window.innerHeight || doc.documentElement.clientHeight;
    if (images.length) {
      for (let i = 0; i < images.length; i++) {
        const imageTop = images[i].getBoundingClientRect().top;
        if (imageTop <= viewHeight - Math.floor(offset)) {
          loadImage(images[i]);
        }
      }
    } else {
      window.removeEventListener("scroll", judgeImages);
      typeof params.callback === "function" && params.callback();
    }
  }
  judgeImages();
  window.addEventListener("scroll", judgeImages);
}

// lazyLoadImage({
//     errorImage: "./img/big-1.jpg",
//     lazyAttr: "lazy",
//     toBottom: 100,
//     callback() {
//         console.log("全部加载完成");
//     }
// });

// https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver

/**
 * 懒加载（完美版）可加载`<img>`、`<video>`、`<audio>`等一些引用资源路径的标签
 * @param {object} params 传参对象
 * @param {string?} params.lazyAttr 自定义加载的属性（可选）
 * @param {"src"|"background"} params.loadType 加载的类型（默认为`src`）
 * @param {string?} params.errorPath 加载失败时显示的资源路径，仅在`loadType`设置为`src`中可用（可选）
 */
function lazyLoad(params) {
  const attr = params.lazyAttr || "lazy";
  const type = params.loadType || "src";

  /** 更新整个文档的懒加载节点 */
  function update() {
    const els = document.querySelectorAll(`[${attr}]`);
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      observer.observe(el);
    }
  }

  /**
   * 加载图片
   * @param {HTMLImageElement} el 图片节点
   */
  function loadImage(el) {
    const cache = el.src; // 缓存当前`src`加载失败时候用
    el.src = el.getAttribute(attr);
    el.onerror = function () {
      el.src = params.errorPath || cache;
    }
  }

  /**
   * 加载单个节点
   * @param {HTMLElement} el 
   */
  function loadElement(el) {
    switch (type) {
      case "src":
        loadImage(el);
        break;
      case "background":
        el.style.backgroundImage = `url(${el.getAttribute(attr)})`;
        break;
    }
    el.removeAttribute(attr);
    observer.unobserve(el);
  }

  /** 
   * 监听器 
   * [MDN说明](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)
  */
  const observer = new IntersectionObserver(function (entries) {
    for (let i = 0; i < entries.length; i++) {
      const item = entries[i];
      if (item.isIntersecting) {
        loadElement(item.target);
      }
    }
  })

  update();

  return {
    observer,
    update
  }
}

// 懒加载图片src
lazyLoad({
  errorPath: "./img/big-1.jpg"
})

// 懒加载图片background
lazyLoad({
  lazyAttr: "lazy-bg",
  loadType: "background"
})
