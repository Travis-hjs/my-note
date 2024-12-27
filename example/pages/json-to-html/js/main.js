const obj = {
  id: 12,
  name: "the object",
  info: {
    desc: "this is a text",
    sub: {
      date: "2024-12-22"
    }
  },
  ids: [1, 2, 3],
  list: [
    {
      id: 1,
      value: "content-1"
    },
    {
      id: 2,
      value: "content-2"
    }
  ]
}

function format(params) {
  if (Array.isArray(params)) {
    return params.map(item => format(item));
  } else if (typeof params === "object" && params !== null) {
    const formattedObj = {};
    for (const key in params) {
      formattedObj[key] = format(params[key]);
    }
    return formattedObj;
  } else if (typeof params === "number") {
    return `<code style='color: var(--orange)'>${params}</code>`;
  } else if (typeof params === "string") {
    return `<code style='color: var(--green)'>${params}</code>`;
  } else if (params === null || params === undefined) {
    return `<code style='color: var(--empty)'>${params}</code>`;
  }
  return params;
}

/**
 * `json`转`html`结构
 * @param {string} json `json`字符串
 * @param {number=} indent 缩进数量，默认`2`
 */
function jsonToHtml(json, indent = 2) {
  const obj = format(JSON.parse(json));
  const text = JSON.stringify(obj, null, 4);
  const list = text.split("\n");
  const indentValue = indent * 2;
  /**
   * 获取字符串前面空格数量
   * @param {string} str
   */
  function getPrefixLength(str) {
    const match = str.match(/^\s*/)[0];
    return match.length;
  }
  let html = "";
  list.forEach(paragraph => {
    const n = getPrefixLength(paragraph);
    let content = paragraph.trim();
    if (content.includes(`color: var(--orange)`)) {
      content = content.replace(`"<code`, `<code`).replace(`</code>"`, `</code>`)
    }
    html += `<p style="text-indent: ${n * indentValue}px;">${content}</p>`;
  });
  const cssText = "--black: #555; --orange: orange; --green: green; --empty: #ff4949; padding: 10px; background-color: #f8f8f8;";
  return `<section style="${cssText}">${html}</section>`;
}

const html = jsonToHtml(JSON.stringify(obj));

// console.log(html);

document.querySelector(".page").innerHTML = html;
