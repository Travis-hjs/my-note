/**
 * 自适应按比例缩放
 * @param {object} params
 * @param {string | HTMLElement} params.el 指定的节点
 */
function autoScale(params) {
  /** @type {HTMLElement} */
  const el =  params.el instanceof HTMLElement ? params.el : document.querySelector(params.el);
  if (!el) return console.warn("传入的 params.el 参数有误！");
  // 获取原始的尺寸
  const { clientWidth, clientHeight } = el;
  const wrap = {
    get width() {
      return window.innerWidth;
      // return document.body.clientWidth;
    },
    get height() {
      return window.innerHeight;
      // return document.body.clientHeight;
    }
  }
  const target = {
    ratio: clientWidth / clientHeight,
    width: 0,
    height: 0
  }
  // 初始化时，先将比例设置不超过屏幕
  if (clientWidth > clientHeight) {
    target.width = wrap.width;
    target.height = wrap.width / target.ratio;
  } else {
    target.height = wrap.height;
    target.width = wrap.height / target.ratio;
  }
  // 设置初始化属性
  el.style.transformOrigin = "top left";
  el.style.width = `${target.width}px`;
  el.style.height = `${target.height}px`;
  // console.log(target, clientWidth, clientHeight);
  function update() {
    const scaleX = wrap.width / target.width;
    const scaleY = wrap.height / target.height;
    const scale = Math.min(scaleX, scaleY);
    const left = (wrap.width - target.width * scale) / 2;
    const top = (wrap.height - target.height * scale) / 2;
    el.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${scale})`;
  }
  // 初始化先执行一遍
  update();
  // 最后监听
  window.addEventListener("resize", update);
}

autoScale({
  el: ".app"
});
