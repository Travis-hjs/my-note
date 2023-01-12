// 类型提示用（运行时不会引用）
/// <reference path="../utils/dom.js" />

(function() {
  /** `item`父节点 */
  const listBox = find(".page .list");
  /** 购物车节点 */
  const target = find(".cart-box");
  /** 列表节点集合 */
  const children = [];
  /** 加入购物车的计数 */
  let count = 0;

  for (let i = 0; i < 20; i++) {
    const item = document.createElement("div");
    item.className = "item fvertical fright";
    const btn = document.createElement("button");
    btn.setAttribute("btn", "");
    btn.setAttribute("blue", "");
    btn.textContent = "添加至购物车";
    item.appendChild(btn);
    btn.addEventListener("click", () => onAdd(btn))
    children.push(item);
  }
  listBox.append(...children);

  /**
   * 添加一个小球发射到购物车中去
   * @param {HTMLElement} el 点击自身元素
   */
  function onAdd(el) {
    const ballBox = document.createElement("div");
    ballBox.className = "ball-box";
    ballBox.innerHTML = `<div class="ball"></div>`;
    // 这里必须输出节点后再设置位置，不然会有问题
    document.body.appendChild(ballBox);
    // 获取并计算移动变量
    const ballWidth = ballBox.clientWidth;
    const ballHeight = ballBox.clientHeight;
    const size = el.getBoundingClientRect();
    const left = size.left + size.width / 2 - ballWidth / 2;
    const top = size.top - ballHeight;
    const car = target.getBoundingClientRect();
    const x = car.left + car.width / 2 - ballWidth / 2 - left;
    const y = car.top - ballHeight - top;
    // 设置位置及移动变量
    ballBox.style.left = left + "px";
    ballBox.style.top = top + "px";
    ballBox.style.setProperty("--x", x + "px");
    ballBox.style.setProperty("--y", y + "px");
    function end() {
      ballBox.removeEventListener("animationend", end);
      ballBox.remove();
      count++;
      target.textContent = `购物车(${count})`;
    }
    ballBox.addEventListener("animationend", end);
  }

})();