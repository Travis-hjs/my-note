import { formatDate } from "./index";
import { message } from "./message";

/**
 * 查找单个元素
 * @param name
 * @param target 指定目标节点查找
 */
export function find(name: string, target?: HTMLElement) {
  return (target || document).querySelector(name) as HTMLElement;
}

/**
 * 查找所有元素
 * @param name
 * @param target 指定目标节点查找
 */
export function findAll(name: string, target?: HTMLElement) {
  const els = (target || document).querySelectorAll(name);
  return Array.from(els) as Array<HTMLElement>;
}

/**
 * 复制文本
 * @param text 复制的内容
 * @param success 成功回调
 * @param fail 出错回调
 */
export function copyText(text: string, success?: () => void, fail?: (res: string) => void) {
  text = text.toString().replace(/(^\s*)|(\s*$)/g, "");
  if (!text) {
    fail && fail("复制的内容不能为空！");
    return;
  }
  const id = "the-clipboard";
  let clipboard = (document.getElementById(id) as HTMLTextAreaElement);
  if (!clipboard) {
    clipboard = document.createElement("textarea");
    clipboard.id = id;
    clipboard.readOnly = true;
    clipboard.style.cssText = "font-size: 15px; position: fixed; top: -1000%; left: -1000%;";
    document.body.appendChild(clipboard);
  }
  clipboard.value = text;
  clipboard.select();
  clipboard.setSelectionRange(0, clipboard.value.length);
  const state = document.execCommand("copy");
  if (state) {
    if (success) {
      success();
    } else {
      message.success("复制成功!");
    }
  } else {
    fail && fail("复制失败");
  }
}

/**
 * 将目标对象挂在到`window`对象上
 * @param target 
 */
export function exportToWindow<T extends object>(target: T) {
  for (const key in target) {
    (window as any)[key] = target[key];
  }
}

export function outputVersion() {
  const version = document.createElement("div");
  version.style.cssText = `
width: 100%;
text-align: center;
position: fixed;
left: 0;
bottom: 0;
z-index: 99;
padding: 20px;
font-size: 12px;
color: #999;
  `;
  version.textContent = `版本更新时间：${formatDate(window._version)}`;
  document.body.appendChild(version);
}
