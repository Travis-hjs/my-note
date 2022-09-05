// -------------------------------- Bom 类工具函数 --------------------------------

const storage = window.localStorage;

/**
 * 本地储存数据
 * @param {string} key 对应的 key 值
 * @param {object} data 对应的数据
 */
function saveCache(key, data) {
  storage.setItem(key, JSON.stringify(data));
}

/**
 * 获取本地数据
 * @param {string} key 对应的 key 值
 */
function getCache(key) {
  let data = storage.getItem(key)
  data = data ? JSON.parse(data) : null;
  return data;
}

/**
 * 清除本地数据
 * @param {string} key 删除键值对，不传则全部删除
 */
function removeCache(key) {
  if (key) {
    storage.removeItem("key");
  } else {
    storage.clear();
  }
}

/** 长震动 */
function vibrateLong() {
  if ("vibrate" in window.navigator) {
    window.navigator.vibrate(400);
  } else if (window["wx"] && wx.vibrateLong) {
    wx.vibrateLong();
  }
}

/** 短震动 */
function vibrateShort() {
  if ("vibrate" in window.navigator) {
    window.navigator.vibrate(15);
  } else if (window["wx"] && wx.vibrateShort) {
    wx.vibrateShort();
  }
}

/** 检查是否移动端 */
function isMobile() {
  const pattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i;
  return pattern.test(navigator.userAgent); //  ? "Mobile" : "Desktop";
}

/**
 * 创建浏览器指纹
 * @param {string} domain 
 */
function createFingerprint(domain = location.host) {
  /**
   * @param {string} string 
   */
  function bin2hex(string) {
    let result = "";
    for (let i = 0; i < string.length; i++) {
      const n = string.charCodeAt(i).toString(16);
      result += n.length < 2 ? "0" + n : n;
    }
    return result;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const txt = domain;
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.textBaseline = "tencent";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText(txt, 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText(txt, 4, 17);
  let b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
  let bin = atob(b64);
  return bin2hex(bin.slice(-16, -12));
}

/**
 * 写入并下载文件（只支持Chrome && Firefox）
 * @param {string} filename 文件名 xxx.text | xxx.js | xxx.[type]
 * @param {string} content 文件内容
 */
function download(filename, content) {
  const label = document.createElement("a");
  label.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
  label.setAttribute("download", filename);
  if (document.createEvent) {
    const event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    label.dispatchEvent(event);
  } else {
    label.click();
  }
}

/**
 * 复制文本
 * @param {string} text 复制的内容
 * @param {() => void} success 成功回调
 * @param {(error: string) => void} fail 出错回调
 */
function copyText(text, success = undefined, fail = undefined) {
  text = text.replace(/(^\s*)|(\s*$)/g, "");
  if (!text) {
    typeof fail === "function" && fail("复制的内容不能为空！");
    return;
  }
  const id = "the-clipboard";
  /**
   * 粘贴板节点
   * @type {HTMLTextAreaElement}
   */
  let clipboard = document.getElementById(id);
  if (!clipboard) {
    clipboard = document.createElement("textarea");
    clipboard.id = id;
    clipboard.readOnly = true;
    clipboard.style.cssText = "font-size: 15px; position: fixed; top: -1000%; left: -1000%;";
    document.body.appendChild(clipboard);
  }
  clipboard.value = text;
  clipboard.select();
  clipboard.setSelectionRange(0, text.length);
  const state = document.execCommand("copy");
  // clipboard.blur(); // 设置readOnly就不需要这行了
  if (state) {
    typeof success === "function" && success();
  } else {
    typeof fail === "function" && fail("复制失败");
  }
}

/** 自定义 log */
function log() {
  const args = [].slice.call(arguments);
  args.unshift("%c the-log >>", "color: #4fc08d");
  console.log.apply(console, args);
}

/**
 * `blob`转`file`（这个两个对象实际上是相同的）
 * @param {Blob} blob 
 * @param {string} fileName 文件名
 */
function blobToFile(blob, fileName) {
  blob.lastModifiedDate = new Date();
  blob.name = fileName;
  return blob;
}

/**
 * `blob`或者`file`转`base64`
 * @param {File | Blob} target 目标对象
 * @returns {Promise<string>}
 */
function blobOrFlieToBase64(target) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    }
    reader.onerror = function () {
      console.warn("reader error >>", reader.error);
      reject(new Error("blobOrFlieToBase64 error"));
    }
    reader.readAsDataURL(target);
  })
}

/**
 * `base64`转`file`或者`blob`对象
 * @param {string} base64
 * @param {"blob"|"file"} type 转换的类型，默认`"blob"`
 * @param {string} filename 转换后的文件名，`type: "file"`时生效
 */
function base64ToBlobOrFile(base64, type, filename) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const suffix = mime.split("/")[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  if (type === "file") {
    return new File([u8arr], `${filename}.${suffix}`, { type: mime });
  } else {
    return new Blob([u8arr], { type: mime });
  }
}

/**
 * `blob`或者`file`转读取路径
 * @param {File | Blob} target 目标对象 
 * @returns {string}
 */
function blobOrFlieToUrl(target) {
  let url;
  if (window.createObjectURL) {
    url = window.createObjectURL(target);
  } else if (window.URL) {
    url = window.URL.createObjectURL(target);
  } else if (window.webkitURL) {
    url = window.webkitURL.createObjectURL(target);
  }
  return url;
}
