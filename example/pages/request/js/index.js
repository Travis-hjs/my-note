
// 类型提示用（运行时不会引用）
/// <reference path="../../../utils/string.js" />

/**
 * `XMLHttpRequest`请求 [MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
 * @param {object} params 传参对象
 * @param {string} params.url 请求路径
 * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method 请求方法
 * @param {object|FormData|string=} params.data 传参对象，json、formdata、普通表单字符串
 * @param {{ [key: string]: string }=} params.headers `XMLHttpRequest.header`设置对象
 * @param {number=} params.timeout 超时检测毫秒数
 * @param {(result: any, response: XMLHttpRequest) => void=} params.success 成功回调 
 * @param {(error: XMLHttpRequest) => void=} params.fail 失败回调 
 * @param {(info: XMLHttpRequest) => void=} params.onTimeout 超时回调
 * @param {(res: ProgressEvent<XMLHttpRequestEventTarget>) => void=} params.onProgress 请求进度回调（上传文件）
 * @param {"arraybuffer"|"blob"|"document"|"json"|"text"=} params.responseType 响应结果类型，默认`json`
 */
function ajax(params) {
  if (checkType(params) !== "object") return console.error("ajax 请求参数类型有误");
  if (!params.method) return console.error("ajax 缺少请求方法");
  if (!params.url) return console.error("ajax 缺少请求 url");

  const XHR = new XMLHttpRequest();
  /** 请求方法 */
  const method = params.method;
  /** 超时检测 */
  const timeout = checkType(params.timeout) === "number" ? params.timeout : 0;
  /** 请求链接 */
  let url = params.url;
  /** 非`GET`请求传参 */
  let body = "";
  /** `GET`请求传参 */
  let query = "";
  /** 传参数据类型 */
  const dataType = checkType(params.data);

  // 传参处理
  if (method === "GET") {
    // 解析对象传参
    if (dataType === "object") {
      for (const key in params.data) {
        query += "&" + key + "=" + params.data[key];
      }
    } else {
      console.warn("ajax 传参处理 GET 传参有误，需要的请求参数应为 object 类型");
    }
    if (query) {
      query = "?" + query.slice(1);
      url += query;
    }
  } else {
    body = ["object", "array"].includes(dataType) ? JSON.stringify(params.data) : params.data;
  }

  // 监听请求变化；XHR.status learn: http://tool.oschina.net/commons?type=5
  XHR.onreadystatechange = function () {
    if (XHR.readyState !== 4) return;
    if (XHR.status === 200 || XHR.status === 304) {
      typeof params.success === "function" && params.success(XHR.response, XHR);
    } else {
      typeof params.fail === "function" && params.fail(XHR);
    }
  }

  // 判断请求进度
  if (params.onProgress) {
    XHR.upload.addEventListener("progress", params.onProgress);
  }
  
  XHR.responseType = params.responseType || "json"; // TODO: 设置响应结果为`json`这个一般由后台返回指定格式，前端无需配置
  // XHR.withCredentials = true;	// 是否Access-Control应使用cookie或授权标头等凭据进行跨站点请求。
  XHR.open(method, url, true);

  // 设置对应的传参请求头，GET 方法不需要
  if (params.method !== "GET") {
    switch (dataType) {
      case "object":
      case "array":
        XHR.setRequestHeader("Content-Type", "application/json"); // `json`请求
        break;

      case "string":
        XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // 表单请求，`id=1&type=2` 非`new FormData()`
        break;

      default:
        break;
    }
  }

  // 判断设置配置头信息
  if (params.headers) {
    for (const key in params.headers) {
      const value = params.headers[key];
      XHR.setRequestHeader(key, value);
    }
  }

  // 在IE中，超时属性只能在调用 open() 方法之后且在调用 send() 方法之前设置。
  if (timeout > 0) {
    XHR.timeout = timeout;
    XHR.ontimeout = function () {
      console.warn("XMLHttpRequest 请求超时 !!!");
      XHR.abort();
      typeof params.onTimeout === "function" && params.onTimeout(XHR);
    }
  }

  XHR.send(body);
}

/**
 * 基于`fetch`请求 [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method 请求方法
 * @param {string} url 请求路径
 * @param {object|FormData|string=} data 传参对象，json、formdata、普通表单字符串
 * @param {RequestInit & { timeout: number }} option 其他配置
 */
/**
 * @template T
 * @param {object} option 
 * @param {string} option.url 请求路径
 * @param {"GET"|"POST"|"PUT"|"DELETE"} option.method 请求方法
 * @param {string | object | FormData=} option.params 请求参数
 * @param {Record<string, string>=} option.headers 请求头配置
 * @param {"json" | "blob" | "arraybuffer" | "text"=} option.responseType 接口响应类型，默认为`json`
 * @param {number=} option.timeout 请求超时毫秒数，不传则永不超时
 * @returns {Promise<{ code: number, data: T, msg: string }>}
 */
function fetchRequest(option) {
  const { url, method, params, headers = {}, responseType, timeout } = option;
  const result = {
    code: -1,
    data: null,
    msg: "",
  }
  const dataType = checkType(params);
  let fetchUrl = url;
  let body = undefined;
  if (method === "GET") {
    let query = "";
    if (dataType === "object") {
      for (const key in params) {
        query += `&${key}=${params[key]}`;
      }
    } else {
      console.warn("fetch 传参处理 GET 传参有误，需要的请求参数应为 object 类型");
    }
    if (query) {
      query = "?" + query.slice(1);
      fetchUrl += query;
    }
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  } else {
    body = params;
    switch (dataType) {
      case "object":
        body = JSON.stringify(params);
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
        break;
      
      case "string":
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        break;
    
      default:
        break;
    }
  }
  return new Promise(function(resolve) {
    /** @type {RequestInit} */
    const init = {
      method,
      headers,
      body,
    }
    /** @type {AbortController} */
    let controller;
    /** @type {number} */
    let timer;
    if (timeout) {
      controller = new AbortController();
      init.signal = controller.signal;
    }
    fetch(fetchUrl, init).then(response => {
      if (response.ok) {
        if (responseType === "blob") {
          return response.blob();
        }
        if (responseType === "arraybuffer") {
          return response.arrayBuffer();
        }
        if (responseType === "text") {
          return response.text();
        }
        return response.json();
      } else {
        result.msg = `请求出错：${response.status}`;
        resolve(result);
      }
    }).then(res => {
      if (res.code === 200) {
        result.code = 1;
        result.data = res.data;
        result.msg = res.message || "ok";
      } else {
        result.code = res.code;
        result.msg = res.message;
      }
      timer && clearTimeout(timer);
      resolve(result);
    }).catch(error => {
      timer && clearTimeout(timer);
      result.msg = `error: ${error}`;
      resolve(result);
    });
    if (timeout) {
      timer = setTimeout(function() {
        result.msg = "请求超时";
        resolve(result);
        controller.abort();
      }, timeout);
    }
  });
}

const apiUrl = "http://wthrcdn.etouch.cn/weather_mini";

const cityList = ["北京", "上海", "广州", "深圳"];

function getCity() {
  const city = cityList[Math.floor(Math.random() * cityList.length)];
  return encodeURIComponent(city);
}

async function clickFetchRequest() {
  const res = await fetchRequest({
    url: apiUrl,
    method: "GET",
    params: {
      city: getCity()
    },
    timeout: 5000,
  });
  console.log("响应结果", res);
}

function ajaxRequest() {
  const error = {
    message: "",
    info: null
  }
  ajax({
    url: apiUrl,
    method: "GET",
    data: {
      city: getCity()
    },
    timeout: 5000,
    success(res, response) {
      console.log("xhr success >>", res);
      console.log("XMLHttpRequest 对象 >>", response);
    },
    fail(err) {
      error.message = "接口报错，请看 network";
      error.info = err;
      if (err.response && err.response.charAt(0) == "{") {
        error.info = JSON.parse(err.response);
      }
      console.log("xhr fail >>", error);
    },
    onTimeout(info) {
      error.message = "请求超时";
      error.info = info;
      console.log("xhr timeout >>", error);
    },
    progress(e) {
      if (e.lengthComputable) {
        let percentComplete = e.loaded / e.total;
        console.log("请求进度 >>", percentComplete, e.loaded, e.total);
      }
      console.log("xhr progress >>", e);
    }
  });
}
