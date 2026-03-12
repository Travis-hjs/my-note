import "@/styles/common.scss";
import "./styles/index.scss";
import { message } from "@/utils/message";
import { find } from "@/utils/dom";

const page = find(".page");

const action = document.createElement("div");

action.style.cssText = "text-align: center; padding: 30vh 0 0;"

function outputBnt(text: string, msg: string, type: "info" | "success" | "warning" | "error") {
  const btn = document.createElement("button");

  btn.className = "the-btn blue";

  btn.textContent = text;

  btn.onclick = function () {
    message.show(msg, type);
  }

  action.appendChild(btn);
}

page.appendChild(action);

outputBnt("info", "提示提示提示提示提示提示提示提示提示", "info");
outputBnt("success", "提示提示提示提示提示提示提示提示提示", "success");
outputBnt("warning", "提示提示提示提示提示提示提示提示提示", "warning");
outputBnt("error", "提示提示提示提示提示提示提示提示提示", "error");