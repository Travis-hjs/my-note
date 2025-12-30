import ErrorIcon from "./assets/error.svg";

import "@/styles/common.scss";
import "./styles/index.scss";

interface LazyLoadOption {
  /** 懒加载的属性 */
  lazyAttr?: string;
  /** 加载的类型 */
  loadType?: "src" | "background";
  /** 加载失败时显示的资源路径 */
  errorPath?: string;
}

/**
 * 懒加载（完美版）可加载`<img>`、`<video>`、`<audio>`等一些引用资源路径的标签
 * @param  option 传参对象
 */
function lazyLoad(option: LazyLoadOption) {
  const attr = option.lazyAttr || "lazy";
  const type = option.loadType || "src";

  /** 更新整个文档的懒加载节点 */
  function update() {
    const els = document.querySelectorAll(`[${attr}]`);
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      // 判断如果有监听过的元素则不进行监听，防止重复监听
      if (!el.hasAttribute("data-observe")) {
        // 设置监听过的属性
        el.setAttribute("data-observe", "1");
        observer.observe(el);
      }
    }
  }

  /**
   * 加载图片
   * @param el 图片节点
   */
  function loadImage(el: HTMLImageElement) {
    const cache = el.src; // 缓存当前`src`加载失败时候用
    el.src = el.getAttribute(attr)!;
    el.onerror = function () {
      el.src = option.errorPath || cache;
    }
  }

  /**
   * 加载单个节点
   * @param el 
   */
  function loadElement(el: HTMLElement) {
    switch (type) {
      case "src":
        loadImage(el as HTMLImageElement);
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
        loadElement(item.target as HTMLElement);
      }
    }
  });

  update();

  return {
    observer,
    update
  }
}

// 懒加载图片src
lazyLoad({
  errorPath: ErrorIcon
});

// 懒加载图片background
lazyLoad({
  lazyAttr: "lazy-bg",
  loadType: "background"
});
