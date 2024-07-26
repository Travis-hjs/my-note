(function () {
  /**
   * 缓动滚动到顶部
   * @description 兼容移动端  && IE-10+
   * @param {HTMLElement} el 
   * @param {number} distance 距离多少显示当前元素，默认滚动条的 1/3
   */
  function scrollToTop(el, distance = null) {
    const body = document.body;
    /**
     * 动画函数
     * @type {requestAnimationFrame}
     */
    const animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    /** 节点原来的属性值 */
    const beforeDisplay = el.style.display || document.defaultView.getComputedStyle(el).display;
    /**
     * @type {HTMLElement}
     */
    let rootNode = null;
    /** 是否在运动 阻止重复点击 */
    let isMove = false;

    function move() {
      // 缓动: rootNode.scrollTop = rootNode.scrollTop - rootNode.scrollTop * 0.1;
      // 线性: rootNode.scrollTop = rootNode.scrollTop - number;
      rootNode.scrollTop = rootNode.scrollTop - 150;
      if (rootNode.scrollTop > 0 && isMove) {
        animation(move);
      } else {
        isMove = false;
      }
    }

    function onScroll() {
      rootNode = body.scrollTop === 0 ? document.documentElement : body;
      if (rootNode.scrollTop > (distance || ((body.scrollHeight / 3)))) {
        el.style.display = beforeDisplay;
      } else {
        el.style.display = "none";
      }
    }

    function main() {
      if (isMove) return;
      isMove = true;
      move();
    }

    function setState() {
      isMove = false;
    }

    /** 移除所有监听事件 */
    function removeEvent() {
      body.removeEventListener("DOMMouseScroll", setState);
      body.removeEventListener("mousewheel", setState);
      body.removeEventListener("touchmove", setState);
      window.removeEventListener("scroll", onScroll);
      el.removeEventListener("click", main);
    }

    // 先执行一次
    onScroll();
    // 先移除，再监听，防止多次添加事件
    removeEvent();

    // Firefox下要用 DOMMouseScroll 代替 mousewheel
    body.addEventListener("DOMMouseScroll", setState);
    body.addEventListener("mousewheel", setState);
    body.addEventListener("touchmove", setState);
    window.addEventListener("scroll", onScroll);
    el.addEventListener("click", main);

    return {
      removeEvent
    }
  }

  scrollToTop(document.querySelector(".goback"));


  // window.scrollTo({
  //     top: 0,
  //     behavior: "smooth"
  // });

})();