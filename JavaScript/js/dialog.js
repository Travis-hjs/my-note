/**
 * 对话框控件
 * @param {object} option
 * @param {number} option.zIndex 起始的定位层级
 */
function useDialog(option = {}) {
  const doc = document;
  let zIndex = option.zIndex || 999;
  const cssModule = `__${Math.random().toString(36).slice(2, 7)}`;
  const className = {
    mask: `dialog-mask${cssModule}`,
    popup: `dialog-popup${cssModule}`,
    title: `dialog-title${cssModule}`,
    content: `dialog-content${cssModule}`,
    footer: `dialog-footer${cssModule}`,
    confirm: `confirm${cssModule}`,
    fade: `fade${cssModule}`,
    show: `show${cssModule}`,
    hide: `hide${cssModule}`
  }
  const cssText = `
  .${className.mask} {
    --time: .3s;
    --transition: .3s all;
    --black: #333;
    --text-color: #555;
    --confirm-bg: #2ec1cb;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    animation: ${className.fade} var(--time);
  }
  .${className.mask} * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .${className.popup} {
    width: 74%;
    max-width: 375px;
    padding: 16px;
    border-radius: 10px;
    background-color: #fff;
    transition: var(--transition);
    animation: ${className.show} var(--time);
  }
  .${className.title} {
    font-size: 18px;
    color: var(--black);
    text-align: center;
  }
  .${className.content} {
    padding: 16px 0;
    font-size: 15px;
    color: var(--text-color);
    text-align: center;
  }
  .${className.footer} {
    width: 100%;
    padding-top: 8px;
    display: flex;
    justify-content: center;
  }
  .${className.footer} button {
    font-size: 15px;
    height: 40px;
    border-radius: 20px;
    padding: 0 20px;
    background-color: #f8f8f8;
    color: var(--black);
    line-height: 1;
    letter-spacing: 1px;
    margin: auto; border: none; outline: none;
  }
  .${className.footer} .${className.confirm} {
    color: #fff;
    background-color: var(--confirm-bg);
  }
  @keyframes ${className.fade} {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes ${className.show} {
    0% { transform: translate3d(var(--x), var(--y), 0) scale(0); }
    100% { transform: translate3d(0, 0, 0) scale(1); }
  }
  .${className.mask}.${className.hide} {
    opacity: 0;
  }
  .${className.mask}.${className.hide} .${className.popup} {
    transform: translate3d(var(--x), var(--y), 0) scale(0);
  }
  `;
  const style = doc.createElement("style");
  style.textContent = cssText.replace(/(\n|\t|\s)*/ig, "$1").replace(/\n|\t|\s(\{|\}|\,|\:|\;)/ig, "$1").replace(/(\{|\}|\,|\:|\;)\s/ig, "$1");
  doc.head.appendChild(style);
  /** 点击记录坐标 */
  const clickSize = {
    x: "0vw",
    y: "0vh"
  }
  // 添加点击事件，并记录每次点击坐标
  doc.addEventListener("click", function(e) {
    const { innerWidth, innerHeight } = window;
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;
    const pageY = e.clientY - centerY;
    const pageX = e.clientX - centerX;
    clickSize.x = `${pageX / innerWidth * 100}vw`;
    clickSize.y = `${pageY / innerHeight * 100}vh`;
  }, true);
  /**
   * 输出节点
   * @param {object} option
   * @param {string=} option.title 弹框标题，传`""`则不显示标题，默认为`"提示"`（可传html）
   * @param {string} option.content 提示内容（可传html）
   * @param {() => void=} option.confirm 确认回调
   * @param {string=} option.confirmText 确认按钮文字，默认为`"确认"`
   * @param {() => void=} option.cancel 取消回调
   * @param {string=} option.cancelText 取消按钮文字，不传则没有取消操作
   */
  function show(option) {
    const el = doc.createElement("section");
    el.className = className.mask;
    el.style.zIndex = zIndex;
    zIndex++;
    // 设置起始偏移位置
    el.style.setProperty("--x", clickSize.x);
    el.style.setProperty("--y", clickSize.y);
    // 设置完之后还原坐标位置
    clickSize.x = "0vw";
    clickSize.y = "0vh";
    const cancelBtn = option.cancelText ? `<button>${option.cancelText}</button>` : "";
    el.innerHTML = `
    <div class="${className.popup}">
      <h2 class="${className.title}">${ typeof option.title === "string" ? option.title : "提示"}</h2>
      <div class="${className.content}">${option.content}</div>
      <div class="${className.footer}">
        ${cancelBtn}
        <button class="${className.confirm}">${option.confirmText || "确认"}</button>
      </div>
    </div>
    `;
    doc.body.appendChild(el);
    el.addEventListener("transitionend", function() {
      el.remove();
    });
    function hide() {
      el.classList.add(className.hide);
    }
    if (option.cancelText) {
      el.querySelector(`.${className.footer} button`).onclick = function() {
        hide();
        option.cancel() && option.cancel();
      }
    }
    el.querySelector(`.${className.confirm}`).onclick = function() {
      hide();
      option.confirm() && option.confirm();
    }
  }

  return {
    show
  }
}

const dialog = useDialog();

function openAlert() {
  dialog.show({
    content: "对话内容对话内容对话内容对话内容对话内容对话内容对话内容",
    confirm() {
      console.log("点击确认");
    }
  });
}

function openConfirm() {
  const { clientWidth, clientHeight } = document.body;
  const { innerWidth, innerHeight } = window;
  dialog.show({
    title: "确认弹框",
    content: `
    <p style="margin-bottom: 4px">当前时间为：${new Date().toLocaleString()}</p>
    <p style="margin-bottom: 4px"><b style="padding-right: 8px">body</b>width: ${clientWidth} height: ${clientHeight}</p>
    <p><b style="padding-right: 8px">window</b>width: ${innerWidth} height: ${innerHeight}</p>
    `,
    cancelText: "关闭",
    confirm() {
      console.log("点击确认");
      // setTimeout(function() {
      //   openAlert();
      // }, 500);
    },
    cancel() {
      console.log("取消");
    }
  });
}
