import "@/styles/common.scss";
import "./styles/index.scss";
import { message } from "@/utils/message";
import { find } from "@/utils/dom";

const page = find(".page");

function outputAction(nodes: Array<HTMLElement>) {
  const action = document.createElement("div");

  action.style.cssText = "width: 100%; height: 200px; gap: 10px";

  action.className = "fvc";

  action.append(...nodes);

  page.appendChild(action);
}

function createBtn(text: string, msg: string, type: "info" | "success" | "warning" | "error") {
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
    // messageBox({
    //   title: "提示",
    //   content: "这是弹窗内容",
    //   cancelText: "取消",
    //   confirm(callback) {
    //     callback!(true);
    //   },
    // })
  }

  return btn;
}

outputAction([
  createBtn("info", "蓝色：info 类型", "info"),
  createBtn("success", "绿色：success 类型", "success"),
  createBtn("warning", "橙色：warning 类型", "warning"),
  createBtn("error", "红色：error 类型", "error"),
]);
