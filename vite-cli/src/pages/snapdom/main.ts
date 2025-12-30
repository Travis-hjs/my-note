import { snapdom } from "@zumer/snapdom";
import { message } from "@/utils/message";
import { find } from "@/utils/dom";
import Logo1 from "./assets/logo-1.svg";
import Logo2 from "./assets/logo-2.svg";
import Logo3 from "./assets/logo-3.svg";

import "@/styles/common.scss";
import "./styles/index.scss";

const app = find(".app");

function onDownLoad(el: HTMLElement, btn: HTMLButtonElement) {
  btn.classList.add("hide");
  snapdom.download(el, {
    scale: 2,
    type: "png"
  }).then(() => {
    btn.classList.remove("hide");
    message.success("下载成功!");
  })
}

const items = [Logo1, Logo2, Logo3].map(icon => {
  const box = document.createElement("div");
  const svg = document.createElement("img");
  const btn = document.createElement("button");
  box.className = "svg-item";
  svg.className = "svg-box";
  svg.src = icon;
  btn.className = "the-btn blue";
  btn.textContent = "下载PNG图片";
  btn.addEventListener("click", () => onDownLoad(box, btn));
  box.append(svg, btn);
  return box;
});

app.append(...items);
