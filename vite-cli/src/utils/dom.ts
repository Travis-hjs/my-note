import { formatDate } from "./index";
import { message } from "./message";

/**
 * 查找单个元素
 * @param name
 * @param target 指定目标节点查找
 */
export function find<T = HTMLElement>(name: string, target?: HTMLElement) {
  return (target || document).querySelector(name) as T;
}

/**
 * 查找所有元素
 * @param name
 * @param target 指定目标节点查找
 */
export function findAll<T = HTMLElement>(name: string, target?: HTMLElement) {
  const els = (target || document).querySelectorAll(name);
  return Array.from(els) as Array<T>;
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

/**
 * `json`转`html`结构
 * @param json `json`字符串
 * @param indent 缩进数量，默认`2`
 */
export function jsonToHtml(json: string, indent = 2) {
  function format(target: any): any {
    if (target === null || target === undefined) {
      return `<code style='color: var(--red)'>${target}</code>`;
    }
    if (typeof target === "number") {
      return `<code style='color: var(--orange)'>${target}</code>`;
    }
    if (typeof target === "string") {
      return `<code style='color: var(--green)'>${target}</code>`;
    }
    if (typeof target === "boolean") {
      return `<code style='color: var(--purple)'>${target}</code>`;
    }
    if (Array.isArray(target)) {
      return target.map(el => format(el));
    }
    if (typeof target === "object") {
      const formattedObj: Record<string, any> = {};
      for (const key in target) {
        formattedObj[key] = format(target[key]);
      }
      return formattedObj;
    }
    return target;
  }
  const obj = format(JSON.parse(json));
  const text = JSON.stringify(obj, null, 4);
  const list = text.split("\n");
  const indentValue = indent * 2 || 4;
  /**
   * 获取字符串前面空格数量
   * @param str
   */
  function getPrefixLength(str: string) {
    const match = str.match(/^\s*/)![0];
    return match.length;
  }
  let html = "";
  list.forEach(paragraph => {
    const n = getPrefixLength(paragraph);
    let content = paragraph.trim();
    if (content.includes(`color: var(--orange)`) || content.includes(`color: var(--red)`) || content.includes(`color: var(--purple)`)) {
      content = content.replace(`"<code`, `<code`).replace(`</code>"`, `</code>`);
    }
    html += `<p style="text-indent: ${n * indentValue}px;">${content}</p>`;
  });
  const cssText = `
  --black: #555;
  --orange: orange;
  --green: green;
  --red: #FF4D5C;
  --purple: #9e019e;
  padding: 10px;
  background-color: #f8f8f8;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
  color: var(--black);
  border-radius: 4px;
  `;
  return `<section style="${cssText}">${html}</section>`;
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
