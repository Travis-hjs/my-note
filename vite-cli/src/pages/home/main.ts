import "@/styles/common.scss";
import "./styles/index.scss";
import { message, messageBox } from "@/utils/message";
import { find } from "@/utils/dom";

const page = find(".page");

function outputAction(nodes: Array<HTMLElement>) {
  const action = document.createElement("div");

  action.style.cssText = "width: 100%; height: 200px; gap: 10px";

  action.className = "fvc";

  action.append(...nodes);

  page.appendChild(action);
}

function toast(text: string, msg: string, type: "info" | "success" | "warning" | "error") {
  const btn = document.createElement("button");

  const color = {
    info: "blue",
    success: "green",
    warning: "orange",
    error: "red"

  }

  btn.className = `the-btn ${color[type]}`;

  btn.textContent = text;

  btn.onclick = function () {
    message.show(msg, type);
  }

  return btn;
}

function popupBase() {
  const btn = document.createElement("button");
  btn.className = `the-btn blue`;
  btn.textContent = "基础确认取消";
  btn.onclick = function () {
    let count = 1;
    messageBox({
      title: "提示",
      content: "这是弹窗内容",
      cancelText: "取消",
      confirm(callback) {
        if (count < 2) {
          message.info("再点一次才能关闭");
        } 
        callback(count >= 2);
        count++;
      },
    });
  }
  return btn;
}

function wait() {
  return new Promise<boolean>(function (resolve) {
    setTimeout(() => {
      resolve(true);
    }, 1000 * 2);
  })
}

function popupAsync() {
  const btn = document.createElement("button");
  btn.className = `the-btn green`;
  btn.textContent = "异步关闭对话框";
  btn.onclick = function () {
    messageBox({
      title: "提示",
      content: "这是异步关闭对话框",
      async confirm() {
        await wait();
        return true;
      },
      // confirm(callback) {
      //   setTimeout(() => {
      //     callback(true);
      //   }, 1000 * 2);
      // },
    });
  }
  return btn;
}

outputAction([
  toast("info", "蓝色：info 类型", "info"),
  toast("success", "绿色：success 类型", "success"),
  toast("warning", "橙色：warning 类型", "warning"),
  toast("error", "红色：error 类型", "error"),
]);

outputAction([
  popupBase(),
  popupAsync(),
]);